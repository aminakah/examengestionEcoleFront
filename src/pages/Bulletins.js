import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, Calendar, Users, BookOpen, TrendingUp, Award } from 'lucide-react';
import { apiService } from '../services/apiService';
import PageLayout from '../components/PageLayout';
import { Card, Table, Badge, Loading, EmptyState, StatsCard } from '../components/UIComponents';
import { getInitials, formatFullName, formatEmail } from '../utils/formatters';

const Bulletins = () => {
  const [bulletins, setBulletins] = useState([]);
  const [classes, setClasses] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClasse, setSelectedClasse] = useState('');
  const [selectedTrimestre, setSelectedTrimestre] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const trimestres = ['Trimestre 1', 'Trimestre 2', 'Trimestre 3'];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedClasse) {
      loadEleves();
    }
  }, [selectedClasse]);

  const loadData = async () => {
    try {
      const [bulletinsRes, classesRes] = await Promise.all([
        apiService.get('/bulletins'),
        apiService.get('/classes')
      ]);
      
      setBulletins(bulletinsRes.data);
      setClasses(classesRes.data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEleves = async () => {
    if (!selectedClasse) return;
    
    try {
      const response = await apiService.get(`/classes/${selectedClasse}/eleves`);
      setEleves(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des élèves:', error);
    }
  };

  const generateBulletin = async (eleveId) => {
    if (!selectedTrimestre) {
      alert('Veuillez sélectionner un trimestre');
      return;
    }

    try {
      const response = await apiService.post('/bulletins/generate', {
        eleve_id: eleveId,
        trimestre: selectedTrimestre,
        classe_id: selectedClasse
      });
      
      setBulletins([...bulletins, response.data]);
      alert('Bulletin généré avec succès!');
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      alert('Erreur lors de la génération du bulletin');
    }
  };

  const downloadBulletin = async (bulletinId) => {
    try {
      const response = await apiService.get(`/bulletins/${bulletinId}/download`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `bulletin_${bulletinId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Erreur lors du téléchargement du bulletin');
    }
  };

  const filteredEleves = eleves.filter(eleve =>
    eleve.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eleve.prenom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: 'nom',
      label: 'Élève',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-medium">
            {getInitials(row.prenom, value)}
          </div>
          <div>
            <div className="font-medium text-gray-900">{formatFullName(row.prenom, value)}</div>
            <div className="text-sm text-gray-500">{formatEmail(row.email)}</div>
          </div>
        </div>
      )
    },
    {
      key: 'classe_nom',
      label: 'Classe',
      render: (value) => (
        <Badge variant="info">{value}</Badge>
      )
    },
    {
      key: 'moyenne_generale',
      label: 'Moyenne',
      render: (value) => {
        if (!value) return <span className="text-gray-400">Non calculée</span>;
        const moyenne = parseFloat(value);
        return (
          <Badge variant={moyenne >= 10 ? 'success' : 'danger'}>
            {moyenne.toFixed(2)}/20
          </Badge>
        );
      }
    },
    {
      key: 'bulletin_status',
      label: 'Bulletin',
      render: (value, row) => {
        const hasBulletin = bulletins.some(b => 
          b.eleve_id === row.id && 
          b.trimestre === selectedTrimestre
        );
        
        return hasBulletin ? (
          <Badge variant="success">Généré</Badge>
        ) : (
          <Badge variant="warning">À générer</Badge>
        );
      }
    }
  ];

  const actions = [
    {
      icon: FileText,
      label: 'Générer bulletin',
      onClick: (eleve) => generateBulletin(eleve.id),
      variant: 'default'
    },
    {
      icon: Download,
      label: 'Télécharger',
      onClick: (eleve) => {
        const bulletin = bulletins.find(b => 
          b.eleve_id === eleve.id && 
          b.trimestre === selectedTrimestre
        );
        if (bulletin) {
          downloadBulletin(bulletin.id);
        } else {
          alert('Bulletin non généré pour cet élève');
        }
      },
      variant: 'default'
    }
  ];

  // Statistiques
  const totalEleves = eleves.length;
  const bulletinsGeneres = selectedTrimestre ? 
    bulletins.filter(b => b.trimestre === selectedTrimestre).length : 0;
  const tauxCompletion = totalEleves > 0 ? 
    Math.round((bulletinsGeneres / totalEleves) * 100) : 0;
  const moyenneClasse = eleves.length > 0 ? 
    Math.round((eleves.reduce((sum, e) => sum + (e.moyenne_generale || 0), 0) / eleves.length) * 100) / 100 : 0;

  const pageActions = [
    {
      label: 'Générer tous les bulletins',
      icon: FileText,
      onClick: () => {
        if (!selectedTrimestre) {
          alert('Veuillez sélectionner un trimestre');
          return;
        }
        filteredEleves.forEach(eleve => generateBulletin(eleve.id));
      },
      variant: 'primary'
    }
  ];

  if (loading) {
    return (
      <PageLayout title="Gestion des Bulletins" icon={FileText}>
        <Loading text="Chargement des bulletins..." />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Gestion des Bulletins"
      subtitle="Générez et gérez les bulletins de notes des élèves"
      icon={FileText}
      actions={selectedClasse && selectedTrimestre ? pageActions : []}
      searchValue={searchTerm}
      onSearchChange={(e) => setSearchTerm(e.target.value)}
    >
      {/* Sélection classe et trimestre */}
      <Card title="Paramètres de génération" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Classe *
            </label>
            <select
              value={selectedClasse}
              onChange={(e) => setSelectedClasse(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Sélectionner une classe</option>
              {classes.map(classe => (
                <option key={classe.id} value={classe.id}>
                  {classe.nom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trimestre *
            </label>
            <select
              value={selectedTrimestre}
              onChange={(e) => setSelectedTrimestre(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Sélectionner un trimestre</option>
              {trimestres.map(trimestre => (
                <option key={trimestre} value={trimestre}>
                  {trimestre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {selectedClasse && selectedTrimestre && (
        <>
          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Élèves"
              value={totalEleves}
              icon={Users}
              color="blue"
            />
            <StatsCard
              title="Bulletins Générés"
              value={bulletinsGeneres}
              icon={FileText}
              color="green"
              trend={`${tauxCompletion}% complété`}
            />
            <StatsCard
              title="Moyenne Classe"
              value={`${moyenneClasse}/20`}
              icon={Award}
              color="orange"
              trend={moyenneClasse >= 10 ? "Satisfaisant" : "À améliorer"}
            />
            <StatsCard
              title="Progression"
              value={`${tauxCompletion}%`}
              icon={TrendingUp}
              color="purple"
              trend={tauxCompletion === 100 ? "Terminé" : "En cours"}
            />
          </div>

          {/* Liste des élèves */}
          <Card title={`Bulletins - ${classes.find(c => c.id == selectedClasse)?.nom} - ${selectedTrimestre}`}>
            {filteredEleves.length === 0 ? (
              <EmptyState
                title="Aucun élève trouvé"
                description="Aucun élève n'est inscrit dans cette classe ou ne correspond à votre recherche."
                icon={Users}
              />
            ) : (
              <Table
                columns={columns}
                data={filteredEleves}
                actions={actions}
              />
            )}
          </Card>
        </>
      )}

      {!selectedClasse || !selectedTrimestre ? (
        <Card>
          <EmptyState
            title="Sélectionnez une classe et un trimestre"
            description="Pour gérer les bulletins, veuillez d'abord sélectionner une classe et un trimestre."
            icon={FileText}
          />
        </Card>
      ) : null}
    </PageLayout>
  );
};

export default Bulletins;
