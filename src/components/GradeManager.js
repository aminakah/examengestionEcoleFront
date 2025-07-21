import React, { useState, useEffect } from 'react';
import { useToast } from '../hooks/customHooks';
import { useGrades, useTeacherData } from '../hooks/schoolHooks';
import { useAuth } from '../context/AuthContext';
import { classService, periodService, subjectService } from '../services';
import LoadingSpinner from './LoadingSpinner';


/**
 * Composant de gestion des notes pour les enseignants
 */
export default function GradeManager() {
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  
  // États pour les filtres
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  
  // États pour les données de référence
  const [subjects, setSubjects] = useState([]);
  const [periods, setPeriods] = useState([]);
  
  // Hook pour les données enseignant
  const { myClasses, loading: classesLoading } = useTeacherData();
  
  // Hook pour les notes avec filtres
  const { 
    grades, 
    loading: gradesLoading, 
    error, 
    createGrade, 
    createBulkGrades, 
    updateGrade,
    refresh: refreshGrades 
  } = useGrades(null, {
    classe_id: selectedClass,
    matiere_id: selectedSubject,
    periode_id: selectedPeriod
  });

  // Mode de saisie
  const [gradeMode, setGradeMode] = useState('individual'); // 'individual' ou 'bulk'
  const [showGradeForm, setShowGradeForm] = useState(false);

  // Charger les données de référence
  useEffect(() => {
    const loadReferenceData = async () => {
      try {
        const [subjectsResponse, periodsResponse] = await Promise.all([
          subjectService.getSubjects(),
          periodService.getPeriods()
        ]);
        
        setSubjects(subjectsResponse.data || subjectsResponse);
        setPeriods(periodsResponse.data || periodsResponse);
      } catch (err) {
        showError('Erreur lors du chargement des données de référence');
      }
    };

    loadReferenceData();
  }, [showError]);

  // Gestion de la saisie individuelle
  const handleIndividualGrade = async (gradeData) => {
    try {
      await createGrade({
        eleve_id: gradeData.studentId,
        matiere_id: selectedSubject,
        periode_id: selectedPeriod,
        note: gradeData.grade,
        coefficient: gradeData.coefficient || 1,
        type_note: gradeData.type || 'devoir',
        commentaire: gradeData.comment
      });
      
      success('Note saisie avec succès');
      setShowGradeForm(false);
    } catch (err) {
      showError('Erreur lors de la saisie de la note');
    }
  };

  // Gestion de la saisie groupée
  const handleBulkGrades = async (bulkData) => {
    try {
      await createBulkGrades({
        classe_id: selectedClass,
        matiere_id: selectedSubject,
        periode_id: selectedPeriod,
        type_note: bulkData.type,
        coefficient: bulkData.coefficient,
        notes: bulkData.grades
      });
      
      success(`${bulkData.grades.length} notes saisies avec succès`);
      setShowGradeForm(false);
    } catch (err) {
      showError('Erreur lors de la saisie groupée');
    }
  };

  if (classesLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Notes</h1>
        <p className="text-gray-600 mt-2">Saisissez et gérez les notes de vos élèves</p>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Filtres</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Sélection de classe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Classe
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner une classe</option>
              {myClasses.map((classe) => (
                <option key={classe.id} value={classe.id}>
                  {classe.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Sélection de matière */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Matière
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner une matière</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Sélection de période */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Période
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner une période</option>
              {periods.map((period) => (
                <option key={period.id} value={period.id}>
                  {period.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Mode de saisie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mode de saisie
            </label>
            <select
              value={gradeMode}
              onChange={(e) => setGradeMode(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="individual">Saisie individuelle</option>
              <option value="bulk">Saisie groupée</option>
            </select>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="mt-4 flex space-x-4">
          <button
            onClick={() => setShowGradeForm(true)}
            disabled={!selectedClass || !selectedSubject || !selectedPeriod}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {gradeMode === 'individual' ? 'Saisir une note' : 'Saisie groupée'}
          </button>
          
          <button
            onClick={refreshGrades}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
          >
            Actualiser
          </button>
        </div>
      </div>

      {/* Affichage des notes */}
      {selectedClass && selectedSubject && selectedPeriod && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Notes existantes</h2>
          </div>
          
          {gradesLoading ? (
            <div className="p-6">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-600">
              Erreur: {error}
            </div>
          ) : grades.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Aucune note trouvée pour cette sélection
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Élève
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Note
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Coefficient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {grades.map((grade) => (
                    <tr key={grade.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {grade.eleve?.nom} {grade.eleve?.prenom}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-bold ${
                          grade.note >= 10 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {grade.note}/20
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {grade.type_note}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {grade.coefficient}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(grade.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {/* Logique de modification */}}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Modifier
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal de saisie */}
      {showGradeForm && (
        <GradeFormModal
          mode={gradeMode}
          classId={selectedClass}
          subjectId={selectedSubject}
          periodId={selectedPeriod}
          onSubmit={gradeMode === 'individual' ? handleIndividualGrade : handleBulkGrades}
          onClose={() => setShowGradeForm(false)}
        />
      )}
    </div>
  );
}

/**
 * Modal de saisie de notes
 */
function GradeFormModal({ mode, classId, subjectId, periodId, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    type: 'devoir',
    coefficient: 1,
    comment: ''
  });
  
  const [students, setStudents] = useState([]);
  const [bulkGrades, setBulkGrades] = useState([]);
  const [loading, setLoading] = useState(false);

  // Charger les élèves de la classe
  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        const response = await classService.getClassStudents(classId);
        const studentsList = response.data || response;
        setStudents(studentsList);
        
        // Initialiser les notes pour la saisie groupée
        if (mode === 'bulk') {
          setBulkGrades(studentsList.map(student => ({
            eleve_id: student.id,
            nom: student.nom,
            prenom: student.prenom,
            note: '',
            absent: false
          })));
        }
      } catch (err) {
        console.error('Erreur chargement élèves:', err);
      } finally {
        setLoading(false);
      }
    };

    if (classId) {
      loadStudents();
    }
  }, [classId, mode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (mode === 'individual') {
      // Validation saisie individuelle
      if (!formData.studentId || !formData.grade) {
        return;
      }
      onSubmit(formData);
    } else {
      // Validation saisie groupée
      const validGrades = bulkGrades.filter(g => g.note && !g.absent);
      if (validGrades.length === 0) {
        return;
      }
      onSubmit({
        ...formData,
        grades: validGrades
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-screen overflow-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              {mode === 'individual' ? 'Saisie individuelle' : 'Saisie groupée'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Paramètres communs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de note
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="devoir">Devoir</option>
                <option value="controle">Contrôle</option>
                <option value="examen">Examen</option>
                <option value="oral">Oral</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Coefficient
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.coefficient}
                onChange={(e) => setFormData({...formData, coefficient: parseInt(e.target.value)})}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commentaire
              </label>
              <input
                type="text"
                value={formData.comment}
                onChange={(e) => setFormData({...formData, comment: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Commentaire optionnel"
              />
            </div>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : mode === 'individual' ? (
            <IndividualGradeForm
              students={students}
              formData={formData}
              setFormData={setFormData}
            />
          ) : (
            <BulkGradeForm
              grades={bulkGrades}
              setGrades={setBulkGrades}
            />
          )}

          {/* Boutons */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * Formulaire de saisie individuelle
 */
function IndividualGradeForm({ students, formData, setFormData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Élève
        </label>
        <select
          value={formData.studentId || ''}
          onChange={(e) => setFormData({...formData, studentId: e.target.value})}
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        >
          <option value="">Sélectionner un élève</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.nom} {student.prenom}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Note (sur 20)
        </label>
        <input
          type="number"
          min="0"
          max="20"
          step="0.5"
          value={formData.grade || ''}
          onChange={(e) => setFormData({...formData, grade: parseFloat(e.target.value)})}
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>
    </div>
  );
}

/**
 * Formulaire de saisie groupée
 */
function BulkGradeForm({ grades, setGrades }) {
  const updateGrade = (index, field, value) => {
    const newGrades = [...grades];
    newGrades[index] = { ...newGrades[index], [field]: value };
    setGrades(newGrades);
  };

  return (
    <div className="max-h-96 overflow-y-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 sticky top-0">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Élève
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Note (/20)
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Absent
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {grades.map((grade, index) => (
            <tr key={grade.eleve_id}>
              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {grade.nom} {grade.prenom}
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <input
                  type="number"
                  min="0"
                  max="20"
                  step="0.5"
                  value={grade.note}
                  onChange={(e) => updateGrade(index, 'note', parseFloat(e.target.value) || '')}
                  disabled={grade.absent}
                  className="w-20 p-1 border border-gray-300 rounded text-center disabled:bg-gray-100"
                />
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={grade.absent}
                  onChange={(e) => updateGrade(index, 'absent', e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
