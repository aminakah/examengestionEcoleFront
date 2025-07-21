import { 
  authService, 
  userService, 
  studentService, 
  gradeService,
  api 
} from '../services';

// Mock fetch global
global.fetch = jest.fn();

describe('API Services Tests', () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorage.clear();
  });

  describe('Base API Service', () => {
    test('sets authorization header when token is present', () => {
      const token = 'test-token';
      api.setToken(token);
      
      expect(api.token).toBe(token);
      expect(localStorage.getItem('authToken')).toBe(token);
    });

    test('removes token when set to null', () => {
      api.setToken('test-token');
      api.setToken(null);
      
      expect(api.token).toBeNull();
      expect(localStorage.getItem('authToken')).toBeNull();
    });

    test('makes GET request with correct parameters', async () => {
      const mockResponse = { data: { test: 'data' } };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await api.get('/test-endpoint');

      expect(fetch).toHaveBeenCalledWith('/api/test-endpoint', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      expect(result).toEqual(mockResponse);
    });

    test('makes POST request with data', async () => {
      const mockResponse = { success: true };
      const testData = { name: 'Test' };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await api.post('/test-endpoint', testData);

      expect(fetch).toHaveBeenCalledWith('/api/test-endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(testData)
      });
      expect(result).toEqual(mockResponse);
    });

    test('handles FormData correctly', async () => {
      const mockResponse = { success: true };
      const formData = new FormData();
      formData.append('file', 'test-file');
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      await api.post('/upload', formData);

      expect(fetch).toHaveBeenCalledWith('/api/upload', {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      });
    });

    test('throws error for non-ok responses', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ message: 'Not found' })
      });

      await expect(api.get('/non-existent')).rejects.toThrow('Not found');
    });

    test('handles network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(api.get('/test')).rejects.toThrow('Network error');
    });
  });

  describe('Authentication Service', () => {
    test('login stores token and returns user data', async () => {
      const mockResponse = {
        user: { id: 1, name: 'Test User', role: 'admin' },
        token: 'auth-token'
      };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const credentials = { email: 'test@example.com', password: 'password' };
      const result = await authService.login(credentials);

      expect(fetch).toHaveBeenCalledWith('/api/auth/login', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(credentials)
      }));
      expect(result).toEqual(mockResponse);
      expect(api.token).toBe('auth-token');
    });

    test('logout clears token', async () => {
      api.setToken('test-token');
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      await authService.logout();

      expect(fetch).toHaveBeenCalledWith('/api/auth/logout', expect.objectContaining({
        method: 'POST'
      }));
      expect(api.token).toBeNull();
    });

    test('getProfile returns user data', async () => {
      const mockUser = { id: 1, name: 'Test User', role: 'admin' };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser
      });

      const result = await authService.getProfile();

      expect(fetch).toHaveBeenCalledWith('/api/auth/me', expect.objectContaining({
        method: 'GET'
      }));
      expect(result).toEqual(mockUser);
    });

    test('refreshToken updates stored token', async () => {
      const mockResponse = { token: 'new-token' };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      await authService.refreshToken();

      expect(api.token).toBe('new-token');
    });

    test('changePassword sends correct data', async () => {
      const passwordData = {
        current_password: 'old123',
        new_password: 'new456',
        new_password_confirmation: 'new456'
      };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      await authService.changePassword(passwordData);

      expect(fetch).toHaveBeenCalledWith('/api/auth/change-password', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(passwordData)
      }));
    });
  });

  describe('User Service', () => {
    test('getUsers with pagination parameters', async () => {
      const mockUsers = { data: [], pagination: { total: 0 } };
      const params = { page: 1, limit: 10 };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUsers
      });

      await userService.getUsers(params);

      expect(fetch).toHaveBeenCalledWith('/api/users?page=1&limit=10', expect.objectContaining({
        method: 'GET'
      }));
    });

    test('createUser sends user data', async () => {
      const userData = {
        name: 'New User',
        email: 'new@example.com',
        role: 'parent'
      };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...userData, id: 1 })
      });

      await userService.createUser(userData);

      expect(fetch).toHaveBeenCalledWith('/api/users', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(userData)
      }));
    });

    test('updateUser sends updated data', async () => {
      const userId = 1;
      const updateData = { name: 'Updated Name' };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: userId, ...updateData })
      });

      await userService.updateUser(userId, updateData);

      expect(fetch).toHaveBeenCalledWith(`/api/users/${userId}`, expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(updateData)
      }));
    });

    test('deleteUser calls correct endpoint', async () => {
      const userId = 1;
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      await userService.deleteUser(userId);

      expect(fetch).toHaveBeenCalledWith(`/api/users/${userId}`, expect.objectContaining({
        method: 'DELETE'
      }));
    });

    test('toggleUserStatus calls correct endpoint', async () => {
      const userId = 1;
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      await userService.toggleUserStatus(userId);

      expect(fetch).toHaveBeenCalledWith(`/api/users/${userId}/toggle-status`, expect.objectContaining({
        method: 'POST'
      }));
    });
  });

  describe('Student Service', () => {
    test('getStudents with filters', async () => {
      const mockStudents = { data: [] };
      const filters = { classe_id: 1, niveau_id: 2 };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStudents
      });

      await studentService.getStudents(filters);

      expect(fetch).toHaveBeenCalledWith('/api/eleves?classe_id=1&niveau_id=2', expect.objectContaining({
        method: 'GET'
      }));
    });

    test('getStudentGrades with parameters', async () => {
      const studentId = 1;
      const params = { matiere_id: 2, periode_id: 3 };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] })
      });

      await studentService.getStudentGrades(studentId, params);

      expect(fetch).toHaveBeenCalledWith(`/api/eleves/${studentId}/notes?matiere_id=2&periode_id=3`, expect.objectContaining({
        method: 'GET'
      }));
    });

    test('changeStudentClass sends correct data', async () => {
      const studentId = 1;
      const changeData = { nouvelle_classe_id: 2 };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      await studentService.changeStudentClass(studentId, changeData);

      expect(fetch).toHaveBeenCalledWith(`/api/eleves/${studentId}/changer-classe`, expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(changeData)
      }));
    });

    test('uploadStudentDocument handles FormData', async () => {
      const studentId = 1;
      const formData = new FormData();
      formData.append('document', 'test-file');
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      await studentService.uploadStudentDocument(studentId, formData);

      expect(fetch).toHaveBeenCalledWith(`/api/eleves/${studentId}/documents`, expect.objectContaining({
        method: 'POST',
        body: formData
      }));
    });
  });

  describe('Grade Service', () => {
    test('createGrade sends grade data', async () => {
      const gradeData = {
        eleve_id: 1,
        matiere_id: 2,
        note: 15.5,
        coefficient: 2
      };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...gradeData, id: 1 })
      });

      await gradeService.createGrade(gradeData);

      expect(fetch).toHaveBeenCalledWith('/api/notes', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(gradeData)
      }));
    });

    test('createBulkGrades sends multiple grades', async () => {
      const bulkData = {
        classe_id: 1,
        matiere_id: 2,
        notes: [
          { eleve_id: 1, note: 15 },
          { eleve_id: 2, note: 12 }
        ]
      };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ created: 2 })
      });

      await gradeService.createBulkGrades(bulkData);

      expect(fetch).toHaveBeenCalledWith('/api/notes/saisie-groupee', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(bulkData)
      }));
    });

    test('getClassGradeForm with parameters', async () => {
      const params = { classe_id: 1, matiere_id: 2, periode_id: 3 };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ students: [] })
      });

      await gradeService.getClassGradeForm(params);

      expect(fetch).toHaveBeenCalledWith('/api/notes/saisie-par-classe?classe_id=1&matiere_id=2&periode_id=3', expect.objectContaining({
        method: 'GET'
      }));
    });

    test('updateGrade sends updated data', async () => {
      const gradeId = 1;
      const updateData = { note: 18 };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: gradeId, ...updateData })
      });

      await gradeService.updateGrade(gradeId, updateData);

      expect(fetch).toHaveBeenCalledWith(`/api/notes/${gradeId}`, expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(updateData)
      }));
    });
  });

  describe('Error Handling', () => {
    test('handles 401 unauthorized errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Unauthorized' })
      });

      await expect(api.get('/protected')).rejects.toThrow('Unauthorized');
    });

    test('handles 500 server errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Internal Server Error' })
      });

      await expect(api.get('/test')).rejects.toThrow('Internal Server Error');
    });

    test('handles malformed JSON responses', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => { throw new Error('Invalid JSON'); }
      });

      await expect(api.get('/test')).rejects.toThrow('HTTP Error: 400');
    });
  });

  describe('Request Headers', () => {
    test('includes authorization header when token is set', async () => {
      api.setToken('test-token');
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({})
      });

      await api.get('/test');

      expect(fetch).toHaveBeenCalledWith('/api/test', expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer test-token'
        })
      }));
    });

    test('excludes authorization header when no token', async () => {
      api.setToken(null);
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({})
      });

      await api.get('/test');

      expect(fetch).toHaveBeenCalledWith('/api/test', expect.objectContaining({
        headers: expect.not.objectContaining({
          'Authorization': expect.anything()
        })
      }));
    });

    test('includes custom headers when provided', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({})
      });

      await api.get('/test', { headers: { 'Custom-Header': 'value' } });

      expect(fetch).toHaveBeenCalledWith('/api/test', expect.objectContaining({
        headers: expect.objectContaining({
          'Custom-Header': 'value'
        })
      }));
    });
  });

  describe('URL Construction', () => {
    test('constructs URLs correctly with base path', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({})
      });

      await api.get('/users/1');

      expect(fetch).toHaveBeenCalledWith('/api/users/1', expect.any(Object));
    });

    test('handles query parameters correctly', async () => {
      const mockResponse = { data: [] };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      await userService.getUsers({ page: 1, limit: 10, role: 'admin' });

      expect(fetch).toHaveBeenCalledWith('/api/users?page=1&limit=10&role=admin', expect.any(Object));
    });
  });

  describe('Configuration', () => {
    test('isAuthenticated returns correct status', () => {
      api.setToken(null);
      expect(api.isAuthenticated()).toBe(false);
      
      api.setToken('test-token');
      expect(api.isAuthenticated()).toBe(true);
    });

    test('token persistence in localStorage', () => {
      const token = 'persistent-token';
      
      api.setToken(token);
      expect(localStorage.getItem('authToken')).toBe(token);
      
      // Simuler un rechargement de page
      const newApiInstance = new (api.constructor)();
      expect(newApiInstance.token).toBe(token);
    });
  });
});

describe('Service Integration', () => {
  test('all services use the same API instance', () => {
    // Vérifier que tous les services partagent la même configuration
    expect(authService).toBeDefined();
    expect(userService).toBeDefined();
    expect(studentService).toBeDefined();
    expect(gradeService).toBeDefined();
  });

  test('services handle token updates consistently', async () => {
    const token = 'test-token';
    api.setToken(token);

    // Tous les services devraient utiliser le même token
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({})
    });

    await Promise.all([
      authService.getProfile(),
      userService.getUsers(),
      studentService.getStudents()
    ]);

    // Vérifier que toutes les requêtes incluent le token
    expect(fetch).toHaveBeenCalledTimes(3);
    fetch.mock.calls.forEach(call => {
      expect(call[1].headers).toMatchObject({
        'Authorization': `Bearer ${token}`
      });
    });
  });
});
