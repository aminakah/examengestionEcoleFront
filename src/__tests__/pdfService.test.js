import { PDFService } from '../services/pdfService';

// Mock jsPDF
jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => ({
    setFillColor: jest.fn(),
    rect: jest.fn(),
    setTextColor: jest.fn(),
    setFontSize: jest.fn(),
    setFont: jest.fn(),
    text: jest.fn(),
    setDrawColor: jest.fn(),
    setLineWidth: jest.fn(),
    line: jest.fn(),
    save: jest.fn(),
    output: jest.fn(() => 'mocked-pdf-blob'),
    internal: {
      pageSize: {
        height: 297
      }
    }
  }));
});

describe('PDFService', () => {
  const mockEleve = {
    prenom: 'Aminata',
    nom: 'Diallo',
    classe: '6ème A'
  };

  const mockNotes = [
    {
      matiere: 'Mathématiques',
      note: 15.5,
      coefficient: 4,
      appreciation: 'Très bon travail'
    },
    {
      matiere: 'Français',
      note: 13,
      coefficient: 4,
      appreciation: 'Bon niveau'
    },
    {
      matiere: 'Histoire-Géographie',
      note: 16,
      coefficient: 3,
      appreciation: 'Excellent'
    }
  ];

  const periode = 'Trimestre 1';

  describe('generateBulletinPDF', () => {
    test('generates PDF document successfully', () => {
      const doc = PDFService.generateBulletinPDF(mockEleve, mockNotes, periode);
      
      expect(doc).toBeDefined();
      expect(doc.setFillColor).toHaveBeenCalled();
      expect(doc.setTextColor).toHaveBeenCalled();
      expect(doc.setFontSize).toHaveBeenCalled();
      expect(doc.text).toHaveBeenCalled();
    });

    test('calls all required PDF methods', () => {
      const doc = PDFService.generateBulletinPDF(mockEleve, mockNotes, periode);
      
      // Vérifier que les méthodes principales sont appelées
      expect(doc.setFillColor).toHaveBeenCalledTimes(3); // Header, table, summary
      expect(doc.rect).toHaveBeenCalled(); // Headers and borders
      expect(doc.text).toHaveBeenCalled(); // All text content
      expect(doc.line).toHaveBeenCalled(); // Table separators
    });
  });

  describe('calculateMoyenne', () => {
    test('calculates average correctly', () => {
      const moyenne = PDFService.calculateMoyenne(mockNotes);
      
      // (15.5*4 + 13*4 + 16*3) / (4+4+3) = (62 + 52 + 48) / 11 = 162/11 ≈ 14.73
      expect(parseFloat(moyenne)).toBeCloseTo(14.73, 2);
    });

    test('handles empty notes array', () => {
      const moyenne = PDFService.calculateMoyenne([]);
      expect(moyenne).toBe(0);
    });

    test('handles notes with missing values', () => {
      const notesWithMissing = [
        { note: 15, coefficient: 4 },
        { note: null, coefficient: 3 },
        { note: 12, coefficient: 2 }
      ];
      
      const moyenne = PDFService.calculateMoyenne(notesWithMissing);
      // (15*4 + 0*3 + 12*2) / (4+3+2) = (60+0+24) / 9 = 84/9 ≈ 9.33
      expect(parseFloat(moyenne)).toBeCloseTo(9.33, 2);
    });

    test('handles zero coefficients', () => {
      const notesWithZeroCoeff = [
        { note: 15, coefficient: 0 },
        { note: 12, coefficient: 2 }
      ];
      
      const moyenne = PDFService.calculateMoyenne(notesWithZeroCoeff);
      // Only the note with coefficient 2 should count
      expect(parseFloat(moyenne)).toBe(12.00);
    });
  });

  describe('getMention', () => {
    test('returns correct mentions for different averages', () => {
      expect(PDFService.getMention(18)).toBe('Très Bien');
      expect(PDFService.getMention(16)).toBe('Très Bien');
      expect(PDFService.getMention(15)).toBe('Bien');
      expect(PDFService.getMention(14)).toBe('Bien');
      expect(PDFService.getMention(13)).toBe('Assez Bien');
      expect(PDFService.getMention(12)).toBe('Assez Bien');
      expect(PDFService.getMention(11)).toBe('Passable');
      expect(PDFService.getMention(10)).toBe('Passable');
      expect(PDFService.getMention(9)).toBe('Insuffisant');
      expect(PDFService.getMention(5)).toBe('Insuffisant');
    });

    test('handles edge cases', () => {
      expect(PDFService.getMention(16.0)).toBe('Très Bien');
      expect(PDFService.getMention(15.99)).toBe('Bien');
      expect(PDFService.getMention(10.0)).toBe('Passable');
      expect(PDFService.getMention(9.99)).toBe('Insuffisant');
    });
  });

  describe('PDF generation integration', () => {
    test('complete bulletin generation workflow', () => {
      // Generate the PDF
      const doc = PDFService.generateBulletinPDF(mockEleve, mockNotes, periode);
      
      // Calculate statistics
      const moyenne = PDFService.calculateMoyenne(mockNotes);
      const mention = PDFService.getMention(moyenne);
      
      // Verify the results
      expect(doc).toBeDefined();
      expect(parseFloat(moyenne)).toBeGreaterThan(0);
      expect(mention).toMatch(/Très Bien|Bien|Assez Bien|Passable|Insuffisant/);
    });

    test('handles student with no notes', () => {
      const doc = PDFService.generateBulletinPDF(mockEleve, [], periode);
      const moyenne = PDFService.calculateMoyenne([]);
      const mention = PDFService.getMention(moyenne);
      
      expect(doc).toBeDefined();
      expect(moyenne).toBe(0);
      expect(mention).toBe('Insuffisant');
    });
  });

  describe('downloadPDF', () => {
    test('calls save method with correct filename', () => {
      const mockDoc = {
        save: jest.fn()
      };
      
      const filename = 'test-bulletin.pdf';
      PDFService.downloadPDF(mockDoc, filename);
      
      expect(mockDoc.save).toHaveBeenCalledWith(filename);
    });
  });

  describe('openPDFInNewTab', () => {
    test('creates blob URL and opens in new tab', () => {
      const mockDoc = {
        output: jest.fn(() => 'blob-data')
      };
      
      // Mock window.open and URL.createObjectURL
      global.window.open = jest.fn();
      global.URL.createObjectURL = jest.fn(() => 'blob-url');
      
      PDFService.openPDFInNewTab(mockDoc);
      
      expect(mockDoc.output).toHaveBeenCalledWith('blob');
      expect(URL.createObjectURL).toHaveBeenCalled();
      expect(window.open).toHaveBeenCalledWith('blob-url', '_blank');
    });
  });
});

describe('PDF Layout and Formatting', () => {
  test('header formatting is applied correctly', () => {
    const doc = PDFService.generateBulletinPDF(mockEleve, mockNotes, periode);
    
    // Verify header styling calls
    expect(doc.setFillColor).toHaveBeenCalledWith(41, 128, 185); // Blue header
    expect(doc.rect).toHaveBeenCalledWith(0, 0, 220, 25, 'F'); // Header rectangle
  });

  test('table formatting is applied correctly', () => {
    const doc = PDFService.generateBulletinPDF(mockEleve, mockNotes, periode);
    
    // Verify table styling
    expect(doc.setFillColor).toHaveBeenCalledWith(240, 240, 240); // Table header
    expect(doc.line).toHaveBeenCalled(); // Table separators
  });

  test('summary section is formatted correctly', () => {
    const doc = PDFService.generateBulletinPDF(mockEleve, mockNotes, periode);
    
    // Verify summary box
    expect(doc.setDrawColor).toHaveBeenCalledWith(41, 128, 185);
    expect(doc.setLineWidth).toHaveBeenCalledWith(1);
    expect(doc.rect).toHaveBeenCalledWith(20, 160, 170, 30); // Summary box
  });
});
