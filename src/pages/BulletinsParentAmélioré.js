import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import { PDFService } from '../services/pdfService';
import { Download, Eye, Calendar, BookOpen, TrendingUp, User, Mail, Phone, MapPin } from 'lucide-react';

const BulletinsParent = () => {
  const { user } = useAuth();
  const [enfants, setEnfants] = useState([]);
  const [selectedEnfant, setSelectedEnfant] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriode, setSelectedPeriode] = useState('Trimestre 1');

  const periodes = ['Trimestre 1', 'Trimestre 2', 'Trimestre 3'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Simuler la récupération des enfants du parent connecté
      const elevesRes = await apiService.get('/eleves');
      const notesRes = await apiService.get('/notes');
      
      // Filtrer les enfants du parent connecté (simulation)
      const mesEnfants = elevesRes.data.filter(eleve => 
        eleve.parent_email === user.email
      );
      
      setEnfants(mesEnfants);
      setNotes(notesRes.data);
      
      if (mesEnfants.length > 0 && !selectedEnfant) {
        setSelectedEnfant(mesEnfants[0]);
      }
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNotesForEnfant = (enfantId, periode) => {
    return notes.filter(note => 
      note.eleve_id === enfantId && 
      note.periode === periode
    ).map(note => ({
      matiere: note.matiere_nom || 'Matière',
      note: note.note || 0,
      coefficient: note.coefficient || 1,
      appreciation: note.appreciation || 'Aucune appréciation',
      date_saisie: note.date_saisie || new Date().toISOString()
    }));
  };

  const downloadBulletin = async (enfant, periode) => {
    try {
      const enfantNotes = getNotesForEnfant(enfant.id, periode);
      
      if (enfantNotes.length === 0) {
        alert(`Aucune note disponible pour ${periode}`);
        return;
      }

      const enfantData = {
        ...enfant,
        classe: enfant.classe_nom || 'Classe non définie'
      };

      const doc = PDFService.generateBulletinPDF(
        enfantData, 
        enfantNotes, 
        periode
      );

      const filename = `Bulletin_${enfant.nom}_${enfant.prenom}_${periode.replace(/\s+/g, '_')}.pdf`;
      PDFService.downloadPDF(doc, filename);
    } catch (error) {
      console.error('Erreur téléchargement bulletin:', error);
      alert('Erreur lors du téléchargement du bulletin');
    }
  };

  const previewBulletin = (enfant, periode) => {
    const enfantNotes = getNotesForEnfant(enfant.id, periode);
    
    if (enfantNotes.length === 0) {
      alert(`Aucune note disponible pour ${periode}`);
      return;
    }

    const enfantData = {
      ...enfant,
      classe: enfant.classe_nom || 'Classe non définie'
    };

    const doc = PDFService.generateBulletinPDF(
      enfantData, 
      enfantNotes, 
      periode
    );

    PDFService.openPDFInNewTab(doc);
  };

  const getStatistiques = (enfant) => {
    const toutesLesNotes = notes.filter(note => note.eleve_id === enfant.id);
    
    const moyennesParPeriode = periodes.map(periode => {
      const notesperiode = getNotesForEnfant(enfant.id, periode);
      return {
        periode,
        moyenne: notesperiode.length > 0 ? PDFService.calculateMoyenne(notesperiode) : 0,
        nombreNotes: notesperiode.length
      };
    });

    return {
      moyennesParPeriode,
      totalNotes: toutesLesNotes.length,
      moyenneGenerale: moyennesParPeriode.reduce((sum, p) => sum + parseFloat(p.moyenne), 0) / moyennesParPeriode.filter(p => p.moyenne > 0).length || 0
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3">Chargement...</span>
      </div>
    );
  }

  if (enfants.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <User className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun enfant trouvé</h3>
        <p className="mt-1 text-sm text-gray-500">
          Aucun enfant n'est associé à votre compte parent.
        </p>
      </div>
    );
  }

  const stats = selectedEnfant ? getStatistiques(selectedEnfant) : null;
  const notesEnfant = selectedEnfant ? getNotesForEnfant(selectedEnfant.id, selectedPeriode) : [];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* En-tête Parent */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Espace Parent - {user.name}
            </h1>
            <p className="text-gray-600 mt-1">
              Consultez les résultats scolaires de vos enfants
            </p>
          </div>
          <div className="text-right text-sm text-gray-500">
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-1" />
              {user.email}
            </div>
          </div>
        </div>
      </div>

      {/* Sélection Enfant */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sélectionner un enfant
            </label>
            <select
              value={selectedEnfant?.id || ''}
              onChange={(e) => {
                const enfant = enfants.find(e => e.id.toString() === e.target.value);
                setSelectedEnfant(enfant);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {enfants.map(enfant => (
                <option key={enfant.id} value={enfant.id}>
                  {enfant.prenom} {enfant.nom} - {enfant.classe_nom}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
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
        </div>
      </div>

      {selectedEnfant && (
        <>
          {/* Informations Enfant */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-500" />
              Informations de l'élève
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Nom complet</dt>
                <dd className="text-sm text-gray-900">{selectedEnfant.prenom} {selectedEnfant.nom}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Classe</dt>
                <dd className="text-sm text-gray-900">{selectedEnfant.classe_nom}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Date de naissance</dt>
                <dd className="text-sm text-gray-900">
                  {selectedEnfant.date_naissance ? new Date(selectedEnfant.date_naissance).toLocaleDateString('fr-FR') : 'Non renseignée'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="text-sm text-gray-900">{selectedEnfant.email}</dd>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.moyennesParPeriode.map(periode => (
                <div key={periode.periode} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">{periode.periode}</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {periode.moyenne > 0 ? `${periode.moyenne}/20` : 'N/A'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {periode.nombreNotes} note{periode.nombreNotes > 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className={`p-2 rounded-full ${
                      parseFloat(periode.moyenne) >= 10 ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <TrendingUp className={`w-6 h-6 ${
                        parseFloat(periode.moyenne) >= 10 ? 'text-green-600' : 'text-red-600'
                      }`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Actions Bulletins */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-500" />
              Bulletins disponibles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {periodes.map(periode => {
                const notesDisponibles = getNotesForEnfant(selectedEnfant.id, periode).length > 0;
                
                return (
                  <div key={periode} className={`border rounded-lg p-4 ${
                    notesDisponibles ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-800">{periode}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        notesDisponibles 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {notesDisponibles ? 'Disponible' : 'En attente'}
                      </span>
                    </div>
                    {notesDisponibles && (
                      <div className="space-y-2">
                        <button
                          onClick={() => previewBulletin(selectedEnfant, periode)}
                          className="w-full flex items-center justify-center px-3 py-2 text-sm border border-blue-300 text-blue-700 rounded-md hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Aperçu
                        </button>
                        <button
                          onClick={() => downloadBulletin(selectedEnfant, periode)}
                          className="w-full flex items-center justify-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Télécharger PDF
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dernières Notes */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
              Notes de {selectedPeriode}
            </h3>
            {notesEnfant.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Matière</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Note</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Coefficient</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Appréciation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notesEnfant.map((note, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-800">{note.matiere}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-sm ${
                            note.note >= 10 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {note.note}/20
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{note.coefficient}</td>
                        <td className="py-3 px-4 text-gray-600">{note.appreciation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Moyenne {selectedPeriode}: </strong>
                    {PDFService.calculateMoyenne(notesEnfant)}/20 - 
                    <span className="ml-2">{PDFService.getMention(PDFService.calculateMoyenne(notesEnfant))}</span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p>Aucune note disponible pour {selectedPeriode}</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BulletinsParent;
