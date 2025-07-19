import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import { PDFService } from '../services/pdfService';
import { NotificationService } from '../services/notificationService';
import { FileText, Download, Mail, Eye, Users, Filter } from 'lucide-react';

const BulletinsAdmin = () => {
  const { user } = useAuth();
  const [bulletins, setBulletins] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriode, setSelectedPeriode] = useState('Trimestre 1');
  const [selectedClasse, setSelectedClasse] = useState('');
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [sendingNotifications, setSendingNotifications] = useState(false);

  const periodes = ['Trimestre 1', 'Trimestre 2', 'Trimestre 3'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [bulletinsRes, elevesRes, notesRes] = await Promise.all([
        apiService.get('/bulletins'),
        apiService.get('/eleves'),
        apiService.get('/notes')
      ]);
      
      setBulletins(bulletinsRes.data);
      setEleves(elevesRes.data);
      setNotes(notesRes.data);
    } catch (error) {
      console.error('Erreur chargement données:', error);
      alert('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const getNotesForEleve = (eleveId, periode) => {
    return notes.filter(note => 
      note.eleve_id === eleveId && 
      note.periode === periode
    ).map(note => ({
      matiere: note.matiere_nom || 'Matière inconnue',
      note: note.note || 0,
      coefficient: note.coefficient || 1,
      appreciation: note.appreciation || 'Aucune appréciation'
    }));
  };

  const generateSingleBulletin = async (eleve) => {
    setGeneratingPDF(true);
    try {
      const eleveNotes = getNotesForEleve(eleve.id, selectedPeriode);
      
      if (eleveNotes.length === 0) {
        alert(`Aucune note trouvée pour ${eleve.prenom} ${eleve.nom} en ${selectedPeriode}`);
        return;
      }

      const eleveData = {
        ...eleve,
        classe: eleve.classe_nom || 'Classe non définie'
      };

      const doc = PDFService.generateBulletinPDF(
        eleveData, 
        eleveNotes, 
        selectedPeriode
      );

      const filename = `Bulletin_${eleve.nom}_${eleve.prenom}_${selectedPeriode.replace(/\s+/g, '_')}.pdf`;
      PDFService.downloadPDF(doc, filename);

      alert(`Bulletin généré pour ${eleve.prenom} ${eleve.nom}`);
    } catch (error) {
      console.error('Erreur génération PDF:', error);
      alert('Erreur lors de la génération du bulletin');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const generateBulletinsForClass = async () => {
    if (!selectedClasse) {
      alert('Veuillez sélectionner une classe');
      return;
    }

    setGeneratingPDF(true);
    try {
      const elevesClasse = eleves.filter(eleve => 
        eleve.classe_id.toString() === selectedClasse
      );

      for (const eleve of elevesClasse) {
        const eleveNotes = getNotesForEleve(eleve.id, selectedPeriode);
        
        if (eleveNotes.length > 0) {
          const eleveData = {
            ...eleve,
            classe: eleve.classe_nom || 'Classe non définie'
          };

          const doc = PDFService.generateBulletinPDF(
            eleveData, 
            eleveNotes, 
            selectedPeriode
          );

          const filename = `Bulletin_${eleve.nom}_${eleve.prenom}_${selectedPeriode.replace(/\s+/g, '_')}.pdf`;
          PDFService.downloadPDF(doc, filename);
        }
        
        // Petit délai entre les téléchargements
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      alert(`Bulletins générés pour ${elevesClasse.length} élèves`);
    } catch (error) {
      console.error('Erreur génération groupée:', error);
      alert('Erreur lors de la génération groupée');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const sendNotificationsToParents = async () => {
    if (!selectedClasse) {
      alert('Veuillez sélectionner une classe');
      return;
    }

    setSendingNotifications(true);
    try {
      const elevesClasse = eleves.filter(eleve => 
        eleve.classe_id.toString() === selectedClasse
      );

      let successCount = 0;
      for (const eleve of elevesClasse) {
        if (eleve.parent_email) {
          const parent = {
            nom: eleve.parent_nom || 'Parent',
            email: eleve.parent_email
          };

          const result = await NotificationService.sendBulletinNotification(
            parent, 
            eleve, 
            selectedPeriode
          );

          if (result.success) {
            successCount++;
          }
        }
        
        // Délai entre les envois
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      alert(`Notifications envoyées à ${successCount} parents sur ${elevesClasse.length} élèves`);
    } catch (error) {
      console.error('Erreur envoi notifications:', error);
      alert('Erreur lors de l\'envoi des notifications');
    } finally {
      setSendingNotifications(false);
    }
  };

  const previewBulletin = (eleve) => {
    const eleveNotes = getNotesForEleve(eleve.id, selectedPeriode);
    
    if (eleveNotes.length === 0) {
      alert(`Aucune note pour ${eleve.prenom} ${eleve.nom}`);
      return;
    }

    const eleveData = {
      ...eleve,
      classe: eleve.classe_nom || 'Classe non définie'
    };

    const doc = PDFService.generateBulletinPDF(
      eleveData, 
      eleveNotes, 
      selectedPeriode
    );

    PDFService.openPDFInNewTab(doc);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3">Chargement des bulletins...</span>
      </div>
    );
  }

  const classes = [...new Set(eleves.map(eleve => ({ 
    id: eleve.classe_id, 
    nom: eleve.classe_nom 
  })))];

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <FileText className="mr-3 text-blue-500" />
          Gestion des Bulletins
        </h2>
      </div>

      {/* Filtres et Actions */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Période
            </label>
            <select
              value={selectedPeriode}
              onChange={(e) => setSelectedPeriode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {periodes.map(periode => (
                <option key={periode} value={periode}>{periode}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Classe (pour actions groupées)
            </label>
            <select
              value={selectedClasse}
              onChange={(e) => setSelectedClasse(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner une classe</option>
              {classes.map(classe => (
                <option key={classe.id} value={classe.id}>{classe.nom}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end space-x-2">
            <button
              onClick={generateBulletinsForClass}
              disabled={!selectedClasse || generatingPDF}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Users className="w-4 h-4 mr-2" />
              {generatingPDF ? 'Génération...' : 'Générer Classe'}
            </button>

            <button
              onClick={sendNotificationsToParents}
              disabled={!selectedClasse || sendingNotifications}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Mail className="w-4 h-4 mr-2" />
              {sendingNotifications ? 'Envoi...' : 'Notifier Parents'}
            </button>
          </div>
        </div>
      </div>

      {/* Liste des élèves */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Élève
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Classe
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email Parent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Moyenne {selectedPeriode}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {eleves.map(eleve => {
              const eleveNotes = getNotesForEleve(eleve.id, selectedPeriode);
              const moyenne = eleveNotes.length > 0 ? PDFService.calculateMoyenne(eleveNotes) : 'N/A';
              
              return (
                <tr key={eleve.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {eleve.prenom} {eleve.nom}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {eleve.classe_nom || 'Non définie'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {eleve.parent_email || 'Non défini'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      parseFloat(moyenne) >= 10 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {moyenne}/20
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => previewBulletin(eleve)}
                      className="text-blue-600 hover:text-blue-900 flex items-center"
                      title="Aperçu"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                    </button>
                    <button
                      onClick={() => generateSingleBulletin(eleve)}
                      disabled={generatingPDF}
                      className="text-green-600 hover:text-green-900 flex items-center disabled:opacity-50"
                      title="Télécharger PDF"
                    >
                      <Download className="w-4 h-4 mr-1" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {eleves.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun élève</h3>
          <p className="mt-1 text-sm text-gray-500">
            Aucun élève trouvé pour cette période.
          </p>
        </div>
      )}
    </div>
  );
};

export default BulletinsAdmin;
