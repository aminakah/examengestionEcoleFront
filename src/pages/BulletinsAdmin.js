import React, { useState, useEffect } from 'react';
import { 
  Shield, FileText, Users, BarChart3, TrendingUp, Download, 
  Eye, Settings, Calendar, Award, AlertCircle, CheckCircle
} from 'lucide-react';
import { apiService } from '../services/apiService';
import PageLayout from '../components/PageLayout';
import { Card, Table, Badge, Loading, EmptyState, StatsCard } from '../components/UIComponents';
import { getInitials, formatFullName } from '../utils/formatters';

const BulletinsAdmin = () => {
  const [bulletins, setBulletins] = useState([]);
  const [statistiques, setStatistiques] = useState({});
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriode, setSelectedPeriode] = useState('');
  const [selectedClasse, setSelectedClasse] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const periodes = [
    'Trimestre 1',
    'Trimestre 2', 
    'Trimestre 3',
    'Année scolaire'
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedPeriode) {
      loadStatistiques();
    }
  }, [selectedPeriode, selectedClasse]);

  const loadData = async () => {
    try {
      const [bulletinsRes, classesRes] = await Promise.all([
        apiService.get('/admin/bulletins'),
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

  const loadStatistiques = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedPeriode) params.append('periode', selectedPeriode);
      if (selectedClasse) params.append('classe_id', selectedClasse);
      
      const response = await apiService.get(`/admin/bulletins/statistiques?${params}`);
      setStatistiques(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const approuverBulletin = async (bulletinId) => {
    try {
      await apiService.put(`/admin/bulletins/${bulletinId}/approuver`);
      setBulletins(bulletins.map(b => 
        b.id === bulletinId ? { ...b, statut: 'approuve' } : b
      ));
      alert('Bulletin approuvé avec succès!');
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
      alert('Erreur lors de l\'approbation du bulletin');
    }
  };

  const rejeterBulletin = async (bulletinId) => {
    const motif = window.prompt('Motif de rejet:');
    if (!motif) return;

    try {
      await apiService.put(`/admin/bulletins/${bulletinId}/rejeter`, { motif });
      setBulletins(bulletins.map(b => 
        b.id === bulletinId ? { ...b, statut: 'rejete', motif_rejet: motif } : b
      ));
      alert('Bulletin rejeté avec succès!');
    } catch (error) {
      console.error('Erreur lors du rejet:', error);
      alert('Erreur lors du rejet du bulletin');
    }
  };

  const genererRapport = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedPeriode) params.append('periode', selectedPeriode);
      if (selectedClasse) params.append('classe_id', selectedClasse);
      
      const response = await apiService.get(`/admin/bulletins/rapport?${params}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `rapport_bulletins_${selectedPeriode || 'global'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erreur lors de la génération du rapport:', error);
      alert('Erreur lors de la génération du rapport');
    }
  };

  const filteredBulletins = bulletins.filter(bulletin => {
    const matchesSearch = bulletin.eleve_nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bulletin.eleve_prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bulletin.classe_nom?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPeriode = !selectedPeriode || bulletin.periode === selectedPeriode;
    const matchesClasse = !selectedClasse || bulletin.classe_id == selectedClasse;
    
    return matchesSearch && matchesPeriode && matchesClasse;
  });

  const columns = [
    {
      key: 'eleve_nom',
      label: 'Élève',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
            {getInitials(row.eleve_prenom, value)}
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {formatFullName(row.eleve_prenom, value)}
            </div>
            <div className="text-sm text-gray-500">
              {row.classe_nom || 'Classe non renseignée'}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'periode',
      label: 'Période',
      render: (value) => (
        <Badge variant="info">{value}</Badge>
      )
    },
    {
      key: 'moyenne_generale',
      label: 'Moyenne',
      render: (value) => {
        if (!value) return <span className="text-gray-400">-</span>;
        const moyenne = parseFloat(value);
        return (
          <div className="flex items-center space-x-2">
            <Badge variant={moyenne >= 10 ? 'success' : 'danger'}>
              {moyenne.toFixed(2)}/20
            </Badge>
          </div>
        );
      }
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (value) => {
        const statuts = {
          'en_attente': { label: 'En attente', variant: 'warning', icon: AlertCircle },
          'approuve': { label: 'Approuvé', variant: 'success', icon: CheckCircle },
          'rejete': { label: 'Rejeté', variant: 'danger', icon: AlertCircle }
        };
        
        const statut = statuts[value] || statuts['en_attente'];
        const IconComponent = statut.icon;
        
        return (
          <div className="flex items-center space-x-1">
            <IconComponent className="w-4 h-4" />
            <Badge variant={statut.variant}>{statut.label}</Badge>
          </div>
        );
      }
    },
    {
      key: 'date_generation',
      label: 'Date de génération',
      render: (value) => new Date(value).toLocaleDateString('fr-FR')
    }
  ];

  const actions = [
    {
      icon: Eye,
      label: 'Aperçu',
      onClick: (bulletin) => window.open(`/bulletins/${bulletin.id}/preview`, '_blank'),
      variant: 'default'
    },
    {
      icon: CheckCircle,
      label: 'Approuver',
      onClick: (bulletin) => approuverBulletin(bulletin.id),
      variant: 'success'
    },
    {
      icon: AlertCircle,
      label: 'Rejeter',
      onClick: (bulletin) => rejeterBulletin(bulletin.id),
      variant: 'danger'
    }
  ];

  const pageActions = [
    {
      label: 'Générer rapport',
      icon: Download,
      onClick: genererRapport,
      variant: 'primary'
    }
  ];

  // Calculs des statistiques locales
  const totalBulletins = filteredBulletins.length;
  const bulletinsApprouves = filteredBulletins.filter(b => b.statut === 'approuve').length;
  const bulletinsEnAttente = filteredBulletins.filter(b => b.statut === 'en_attente').length;
  const tauxApprobation = totalBulletins > 0 ? Math.round((bulletinsApprouves / totalBulletins) * 100) : 0;

  if (loading) {
    return (
      <PageLayout title="Administration des Bulletins" icon={Shield}>
        <Loading text="Chargement des bulletins..." />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Administration des Bulletins"
      subtitle="Gérez et validez les bulletins de notes"
      icon={Shield}
      actions={pageActions}
      searchValue={searchTerm}
      onSearchChange={(e) => setSearchTerm(e.target.value)}
    >
      {/* Filtres */}
      <Card title="Filtres et paramètres" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Période
            </label>
            <select
              value={selectedPeriode}
              onChange={(e) => setSelectedPeriode(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Toutes les périodes</option>
              {periodes.map(periode => (
                <option key={periode} value={periode}>
                  {periode}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Classe
            </label>
            <select
              value={selectedClasse}
              onChange={(e) => setSelectedClasse(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Toutes les classes</option>
              {classes.map(classe => (
                <option key={classe.id} value={classe.id}>
                  {classe.nom}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Bulletins"
          value={totalBulletins}
          icon={FileText}
          color="blue"
        />
        <StatsCard
          title="Approuvés"
          value={bulletinsApprouves}
          icon={CheckCircle}
          color="green"
          trend={`${tauxApprobation}% validés`}
        />
        <StatsCard
          title="En Attente"
          value={bulletinsEnAttente}
          icon={AlertCircle}
          color="orange"
          trend="À traiter"
        />
        <StatsCard
          title="Taux d'Approbation"
          value={`${tauxApprobation}%`}
          icon={TrendingUp}
          color="purple"
          trend={tauxApprobation >= 90 ? "Excellent" : "À améliorer"}
        />
      </div>

      {/* Alertes et notifications */}
      {bulletinsEnAttente > 0 && (
        <Card className="mb-6 border-l-4 border-orange-400 bg-orange-50">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-orange-600" />
            <div>
              <h3 className="text-lg font-medium text-orange-900">
                {bulletinsEnAttente} bulletin(s) en attente de validation
              </h3>
              <p className="text-orange-700 mt-1">
                Des bulletins nécessitent votre approbation avant diffusion aux familles.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Statistiques détaillées par classe */}
      {statistiques.classes && (
        <Card title="Statistiques par classe" className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {statistiques.classes.map(classe => (
              <div key={classe.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{classe.nom}</h4>
                  <Badge variant="info">{classe.total_bulletins}</Badge>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Moyenne classe:</span>
                    <span className="font-medium">{classe.moyenne_classe}/20</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Approuvés:</span>
                    <span className="text-green-600">{classe.approuves}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>En attente:</span>
                    <span className="text-orange-600">{classe.en_attente}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Liste des bulletins */}
      <Card title="Liste des bulletins">
        {filteredBulletins.length === 0 ? (
          <EmptyState
            title="Aucun bulletin trouvé"
            description="Aucun bulletin ne correspond aux critères de recherche."
            icon={FileText}
          />
        ) : (
          <Table
            columns={columns}
            data={filteredBulletins}
            actions={actions}
          />
        )}
      </Card>

      {/* Actions rapides */}
      <Card title="Actions rapides" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => {
              const enAttente = bulletins.filter(b => b.statut === 'en_attente');
              if (enAttente.length === 0) {
                alert('Aucun bulletin en attente');
                return;
              }
              if (window.confirm(`Approuver ${enAttente.length} bulletins en attente ?`)) {
                enAttente.forEach(b => approuverBulletin(b.id));
              }
            }}
            className="p-4 border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
          >
            <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-sm font-medium text-green-900">
              Approuver tous les bulletins en attente
            </div>
          </button>
          
          <button
            onClick={genererRapport}
            className="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <BarChart3 className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-sm font-medium text-blue-900">
              Générer rapport complet
            </div>
          </button>
          
          <button
            onClick={() => window.open('/admin/settings/bulletins', '_blank')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Settings className="w-6 h-6 text-gray-600 mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-900">
              Paramètres des bulletins
            </div>
          </button>
        </div>
      </Card>
    </PageLayout>
  );
};

export default BulletinsAdmin;
