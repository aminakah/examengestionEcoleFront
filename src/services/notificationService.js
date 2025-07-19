import emailjs from 'emailjs-com';

export class NotificationService {
  // Configuration EmailJS (à remplacer par vos vraies clés)
  static SERVICE_ID = 'your_service_id';
  static TEMPLATE_BULLETIN = 'template_bulletin';
  static TEMPLATE_NOTE = 'template_note';
  static PUBLIC_KEY = 'your_public_key';

  static init() {
    emailjs.init(this.PUBLIC_KEY);
  }

  /**
   * Envoie une notification pour un nouveau bulletin disponible
   */
  static async sendBulletinNotification(parent, eleve, periode) {
    const templateParams = {
      to_name: parent.nom,
      parent_email: parent.email,
      student_name: `${eleve.prenom} ${eleve.nom}`,
      student_class: eleve.classe,
      periode: periode,
      school_name: 'École Moderne',
      message: `Le bulletin de ${periode} de votre enfant ${eleve.prenom} ${eleve.nom} est maintenant disponible sur le portail parental.`,
      login_url: `${window.location.origin}/login`,
      date: new Date().toLocaleDateString('fr-FR')
    };

    try {
      const response = await emailjs.send(
        this.SERVICE_ID,
        this.TEMPLATE_BULLETIN,
        templateParams
      );
      
      console.log('Notification bulletin envoyée:', response.status);
      return { success: true, messageId: response.text };
    } catch (error) {
      console.error('Erreur envoi notification bulletin:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Envoie une notification pour une nouvelle note
   */
  static async sendNewGradeNotification(parent, eleve, matiere, note, appreciation = '') {
    const templateParams = {
      to_name: parent.nom,
      parent_email: parent.email,
      student_name: `${eleve.prenom} ${eleve.nom}`,
      student_class: eleve.classe,
      subject: matiere,
      grade: `${note}/20`,
      appreciation: appreciation,
      school_name: 'École Moderne',
      message: `Une nouvelle note a été saisie pour votre enfant ${eleve.prenom} ${eleve.nom} en ${matiere} : ${note}/20`,
      login_url: `${window.location.origin}/login`,
      date: new Date().toLocaleDateString('fr-FR')
    };

    try {
      const response = await emailjs.send(
        this.SERVICE_ID,
        this.TEMPLATE_NOTE,
        templateParams
      );
      
      console.log('Notification note envoyée:', response.status);
      return { success: true, messageId: response.text };
    } catch (error) {
      console.error('Erreur envoi notification note:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Envoie une notification groupée aux parents d'une classe
   */
  static async sendBulkNotification(parents, subject, message, type = 'info') {
    const results = [];
    
    for (const parent of parents) {
      const templateParams = {
        to_name: parent.nom,
        parent_email: parent.email,
        subject: subject,
        message: message,
        school_name: 'École Moderne',
        date: new Date().toLocaleDateString('fr-FR'),
        type: type
      };

      try {
        const response = await emailjs.send(
          this.SERVICE_ID,
          'template_general',
          templateParams
        );
        
        results.push({
          parent: parent.email,
          success: true,
          messageId: response.text
        });
      } catch (error) {
        results.push({
          parent: parent.email,
          success: false,
          error: error.message
        });
      }
      
      // Délai entre les envois pour éviter le spam
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return results;
  }

  /**
   * Configuration des templates EmailJS recommandés
   */
  static getEmailTemplates() {
    return {
      bulletin: {
        name: 'template_bulletin',
        subject: 'Nouveau bulletin disponible - {{student_name}}',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #3498db; color: white; padding: 20px; text-align: center;">
              <h1>{{school_name}}</h1>
              <h2>Nouveau Bulletin Disponible</h2>
            </div>
            <div style="padding: 20px; background: #f8f9fa;">
              <p>Bonjour {{to_name}},</p>
              <p>{{message}}</p>
              <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <strong>Détails:</strong><br>
                Élève: {{student_name}}<br>
                Classe: {{student_class}}<br>
                Période: {{periode}}
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="{{login_url}}" style="background: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">
                  Consulter le Portail
                </a>
              </div>
              <p style="color: #666; font-size: 12px;">
                Email envoyé automatiquement le {{date}}
              </p>
            </div>
          </div>
        `
      },
      note: {
        name: 'template_note',
        subject: 'Nouvelle note - {{student_name}} - {{subject}}',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #27ae60; color: white; padding: 20px; text-align: center;">
              <h1>{{school_name}}</h1>
              <h2>Nouvelle Note</h2>
            </div>
            <div style="padding: 20px; background: #f8f9fa;">
              <p>Bonjour {{to_name}},</p>
              <p>{{message}}</p>
              <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <strong>Détails de la note:</strong><br>
                Élève: {{student_name}}<br>
                Classe: {{student_class}}<br>
                Matière: {{subject}}<br>
                Note: {{grade}}<br>
                {{#if appreciation}}Appréciation: {{appreciation}}{{/if}}
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="{{login_url}}" style="background: #27ae60; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">
                  Voir Plus de Détails
                </a>
              </div>
            </div>
          </div>
        `
      }
    };
  }

  /**
   * Teste la configuration EmailJS
   */
  static async testConfiguration() {
    const testParams = {
      to_name: 'Test',
      parent_email: 'test@example.com',
      message: 'Ceci est un test de configuration EmailJS',
      school_name: 'École Moderne',
      date: new Date().toLocaleDateString('fr-FR')
    };

    try {
      await emailjs.send(
        this.SERVICE_ID,
        'template_test',
        testParams
      );
      return { success: true, message: 'Configuration EmailJS OK' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Initialiser le service au chargement
NotificationService.init();
