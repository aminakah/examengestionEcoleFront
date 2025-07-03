import { 
  mockClasses, 
  mockMatieres, 
  mockEnseignants, 
  mockEleves, 
  mockNotes, 
  mockBulletins 
} from '../utils/mockData';

// Simulation d'un délai réseau
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ApiService {
  async get(endpoint) {
    await delay(500); // Simule un délai réseau
    
    switch(endpoint) {
      case '/classes':
        return { data: mockClasses };
      case '/matieres':
        return { data: mockMatieres };
      case '/enseignants':
        return { data: mockEnseignants };
      case '/eleves':
        return { data: mockEleves };
      case '/notes':
        return { data: mockNotes };
      case '/bulletins':
        return { data: mockBulletins };
      default:
        throw new Error(`Endpoint ${endpoint} not found`);
    }
  }

  async post(endpoint, data) {
    await delay(500);
    
    // Simulation de création d'un nouvel élément
    const newId = Date.now();
    return { 
      data: { 
        id: newId, 
        ...data, 
        created_at: new Date().toISOString() 
      } 
    };
  }

  async put(endpoint, data) {
    await delay(500);
    
    // Simulation de mise à jour
    return { 
      data: { 
        ...data, 
        updated_at: new Date().toISOString() 
      } 
    };
  }

  async delete(endpoint) {
    await delay(500);
    
    // Simulation de suppression
    return { success: true };
  }
}

export const apiService = new ApiService();