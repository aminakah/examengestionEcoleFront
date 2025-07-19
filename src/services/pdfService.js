import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export class PDFService {
  static generateBulletinPDF(eleve, notes, periode, etablissement = "École Moderne") {
    const doc = new jsPDF();
    
    // Configuration des couleurs
    const primaryColor = [41, 128, 185]; // Bleu
    const secondaryColor = [52, 73, 94]; // Gris foncé
    
    // En-tête du bulletin
    this.addHeader(doc, etablissement, primaryColor);
    
    // Informations de l'élève
    this.addStudentInfo(doc, eleve, periode, 50);
    
    // Tableau des notes
    this.addGradesTable(doc, notes, 90);
    
    // Calculs et moyennes
    const moyenne = this.calculateMoyenne(notes);
    const mention = this.getMention(moyenne);
    
    this.addSummary(doc, moyenne, mention, notes.length, 160);
    
    // Pied de page
    this.addFooter(doc);
    
    return doc;
  }

  static addHeader(doc, etablissement, color) {
    // Rectangles de design
    doc.setFillColor(...color);
    doc.rect(0, 0, 220, 25, 'F');
    
    // Titre principal
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(etablissement.toUpperCase(), 105, 12, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text('BULLETIN SCOLAIRE', 105, 20, { align: 'center' });
    
    // Reset couleur
    doc.setTextColor(0, 0, 0);
  }

  static addStudentInfo(doc, eleve, periode, startY) {
    const info = [
      ['Élève:', `${eleve.prenom} ${eleve.nom}`],
      ['Classe:', eleve.classe || 'Non définie'],
      ['Période:', periode],
      ['Date d\'émission:', format(new Date(), 'dd/MM/yyyy', { locale: fr })]
    ];

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    info.forEach(([label, value], index) => {
      const y = startY + (index * 8);
      doc.setFont('helvetica', 'bold');
      doc.text(label, 20, y);
      doc.setFont('helvetica', 'normal');
      doc.text(value, 60, y);
    });
  }

  static addGradesTable(doc, notes, startY) {
    // En-tête du tableau
    doc.setFillColor(240, 240, 240);
    doc.rect(20, startY - 5, 170, 8, 'F');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Matière', 25, startY);
    doc.text('Note', 80, startY);
    doc.text('Coeff', 100, startY);
    doc.text('Note Coeff', 125, startY);
    doc.text('Appréciation', 155, startY);
    
    // Ligne de séparation
    doc.setDrawColor(200, 200, 200);
    doc.line(20, startY + 2, 190, startY + 2);
    
    // Données du tableau
    doc.setFont('helvetica', 'normal');
    notes.forEach((note, index) => {
      const y = startY + 10 + (index * 8);
      
      // Couleur alternée pour les lignes
      if (index % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(20, y - 4, 170, 6, 'F');
      }
      
      doc.text(note.matiere || 'Matière', 25, y);
      doc.text(`${note.note || 0}/20`, 80, y);
      doc.text(note.coefficient?.toString() || '1', 100, y);
      doc.text(`${((note.note || 0) * (note.coefficient || 1)).toFixed(1)}`, 125, y);
      doc.text(note.appreciation || 'Bien', 155, y);
    });
  }

  static addSummary(doc, moyenne, mention, nombreMatieres, startY) {
    // Cadre pour le résumé
    doc.setDrawColor(41, 128, 185);
    doc.setLineWidth(1);
    doc.rect(20, startY, 170, 30);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('RÉSULTATS', 25, startY + 10);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Moyenne générale: ${moyenne}/20`, 25, startY + 20);
    doc.text(`Mention: ${mention}`, 100, startY + 20);
    doc.text(`Nombre de matières: ${nombreMatieres}`, 25, startY + 27);
  }

  static addFooter(doc) {
    const pageHeight = doc.internal.pageSize.height;
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text(
      'Ce bulletin a été généré automatiquement par le système de gestion scolaire',
      105,
      pageHeight - 15,
      { align: 'center' }
    );
    
    doc.text(
      `Généré le ${format(new Date(), 'dd/MM/yyyy à HH:mm', { locale: fr })}`,
      105,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  static calculateMoyenne(notes) {
    if (!notes || notes.length === 0) return 0;
    
    const totalPoints = notes.reduce((sum, note) => {
      return sum + ((note.note || 0) * (note.coefficient || 1));
    }, 0);
    
    const totalCoefficients = notes.reduce((sum, note) => {
      return sum + (note.coefficient || 1);
    }, 0);
    
    return totalCoefficients > 0 ? (totalPoints / totalCoefficients).toFixed(2) : 0;
  }

  static getMention(moyenne) {
    const moy = parseFloat(moyenne);
    if (moy >= 16) return "Très Bien";
    if (moy >= 14) return "Bien";
    if (moy >= 12) return "Assez Bien";
    if (moy >= 10) return "Passable";
    return "Insuffisant";
  }

  static downloadPDF(doc, filename) {
    doc.save(filename);
  }

  static openPDFInNewTab(doc) {
    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    window.open(url, '_blank');
  }
}
