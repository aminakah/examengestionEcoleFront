import React, { useState, useEffect } from 'react';
import { 
  User, TrendingUp, TrendingDown, Award, AlertTriangle, 
  BookOpen, BarChart3, Calendar, Bell, Download, Eye,
  Users, Target, Clock, CheckCircle, XCircle, Home,
  Star, Activity, FileText, Phone, Mail, RefreshCw
} from 'lucide-react';
import { dashboardService } from '../../services/dashboardService';
import { useNavigate } from 'react-router-dom';

const ParentDashboardAmélioré = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Chargement dashboard parent...');
      const response = await dashboardService.getParentStats();
      
      if (response.success) {
        console.log('✅ Données dashboard reçues:', response.data);
        setStats(response.data);
        
        // Sélectionner automatiquement le premier enfant
        if (response.data.enfants_details && response.data.enfants_details.length > 0) {
          setSelectedChild(response.data.enfants_details[0]);
        }
      } else {
        throw new Error(response.message || 'Erreur lors du chargement');
      }
    } catch (error) {
      console.error('❌ Erreur chargement dashboard:', error);
      setError(error.message || 'Impossible de charger les données');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, color = "blue", trend = null, onClick = null }) => (
    <div 
      className={`bg-white rounded-xl shadow-lg p-6 border-l-4 border-l-${color}-500 ${onClick ? 'cursor-pointer hover:shadow-xl transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-center space-x-2">
            <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
            {trend && trend !== 0 && (
              <div className={`flex items-center text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>{Math.abs(trend)}</span>
              </div>
            )}
          </div>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className={`p-3 bg-${color}-100 rounded-full`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const EnfantCard = ({ enfant }) => (
    <div 
      className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all hover:shadow-xl border-2 ${
        selectedChild?.id === enfant.id ? 'border-blue-500' : 'border-transparent'
      }`}
      onClick={() => setSelectedChild(enfant)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {enfant.prenom ? enfant.prenom.charAt(0).toUpperCase() : 'E'}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{enfant.prenom || 'Élève'}</h3>
            <p className="text-sm text-gray-600">{enfant.classe || 'Classe non définie'}</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${
            enfant.moyenne_generale >= 10 ? 'text-green-600' : 'text-red-600'
          }`}>
            {enfant.moyenne_generale ? `${enfant.moyenne_generale}/20` : 'N/A'}
          </div>
          <div className="text-xs text-gray-500">Moyenne générale</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-purple-600">
            {enfant.rang || 'N/A'}
          </div>
          <div className="text-xs text-gray-600">Rang</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-blue-600">
            {enfant.mention || 'N/A'}
          </div>
          <div className="text-xs text-gray-600">Mention</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        {enfant.evolution !== undefined && enfant.evolution !== null && (
          <div className={`flex items-center space-x-1 text-sm ${
            enfant.evolution > 0 ? 'text-green-600' : 
            enfant.evolution < 0 ? 'text-red-600' : 'text-gray-600'
          }`}>
            {enfant.evolution > 0 ? <TrendingUp className="w-4 h-4" /> : 
             enfant.evolution < 0 ? <TrendingDown className="w-4 h-4" /> : 
             <Activity className="w-4 h-4" />}
            <span>{enfant.evolution > 0 ? '+' : ''}{enfant.evolution} pts</span>
          </div>
        )}
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {enfant.derniere_periode || 'N/A'}
        </span>
      </div>

      {/* Actions pour cet enfant */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/parent/bulletins?enfant=${enfant.id}`);
            }}
            className="flex-1 text-xs bg-blue-50 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors"
          >
            📋 Bulletins
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/parent/notes?enfant=${enfant.id}`);
            }}
            className="flex-1 text-xs bg-green-50 text-green-700 px-3 py-2 rounded-lg hover:bg-green-100 transition-colors"
          >
            📝 Notes
          </button>
        </div>
      </div>
    </div>
  );

  const AlerteCard = ({ alerte }) => (
    <div className={`p-4 rounded-lg border-l-4 ${
      alerte.priorite === 'haute' ? 'bg-red-50 border-red-500' : 
      alerte.priorite === 'moyenne' ? 'bg-yellow-50 border-yellow-500' : 
      'bg-blue-50 border-blue-500'
    }`}>
      <div className="flex items-start space-x-3">
        <AlertTriangle className={`w-5 h-5 mt-0.5 ${
          alerte.priorite === 'haute' ? 'text-red-600' : 
          alerte.priorite === 'moyenne' ? 'text-yellow-600' : 
          'text-blue-600'
        }`} />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-900">{alerte.enfant}</span>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              alerte.priorite === 'haute' ? 'bg-red-200 text-red-800' : 
              alerte.priorite === 'moyenne' ? 'bg-yellow-200 text-yellow-800' : 
              'bg-blue-200 text-blue-800'
            }`}>
              {alerte.priorite}
            </span>
          </div>
          <p className="text-sm text-gray-700 mt-1">{alerte.message}</p>
          <p className="text-xs text-gray-600 mt-2 italic">{alerte.action_recommandee}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Chargement du tableau de bord...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">Erreur de chargement</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button 
            onClick={loadDashboardData}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Réessayer</span>
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6 text-center">
        <div className="text-gray-500">Aucune donnée disponible</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* En-tête */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de Bord Parent</h1>
            <p className="text-gray-600">Suivez les performances scolaires de vos enfants</p>
          </div>
          <button 
            onClick={loadDashboardData}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Actualiser</span>
          </button>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Moyenne Famille"
          value={stats.moyennes_globales?.moyenne_famille ? `${stats.moyennes_globales.moyenne_famille}/20` : 'N/A'}
          subtitle="Toutes classes confondues"
          icon={Award}
          color="green"
        />
        <StatCard
          title="Enfants en Réussite"
          value={stats.moyennes_globales?.enfants_reussit || 0}
          subtitle={`/${stats.nombre_enfants || 0} enfants`}
          icon={CheckCircle}
          color="blue"
        />
        <StatCard
          title="Meilleure Performance"
          value={stats.moyennes_globales?.meilleure_moyenne ? `${stats.moyennes_globales.meilleure_moyenne}/20` : 'N/A'}
          subtitle={stats.moyennes_globales?.enfant_meilleur || 'N/A'}
          icon={Star}
          color="purple"
        />
        <StatCard
          title="Alertes"
          value={stats.alertes_scolaires?.length || 0}
          subtitle="Points d'attention"
          icon={AlertTriangle}
          color={(stats.alertes_scolaires?.length || 0) > 0 ? "red" : "green"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne gauche - Enfants */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mes enfants */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                <Users className="w-6 h-6 text-blue-600" />
                <span>Mes Enfants</span>
              </h2>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {stats.nombre_enfants || 0} enfant{(stats.nombre_enfants || 0) > 1 ? 's' : ''}
              </span>
            </div>
            
            {stats.enfants_details && stats.enfants_details.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stats.enfants_details.map((enfant) => (
                  <EnfantCard key={enfant.id} enfant={enfant} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">Aucun enfant inscrit</p>
              </div>
            )}
          </div>

          {/* Performances par matière */}
          {stats.performances_par_matiere && stats.performances_par_matiere.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <BookOpen className="w-6 h-6 text-green-600" />
                <span>Performances par Matière</span>
              </h2>
              
              <div className="space-y-4">
                {stats.performances_par_matiere.map((matiere, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{matiere.matiere}</h3>
                      <span className="text-lg font-bold text-blue-600">
                        {matiere.moyenne_famille}/20
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {matiere.details_enfants?.map((detail, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{detail.enfant}</span>
                          <span className={`font-medium ${
                            detail.moyenne >= 10 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {detail.moyenne}/20
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Évolution et tendances */}
          {stats.evolution_tendances && stats.evolution_tendances.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <BarChart3 className="w-6 h-6 text-purple-600" />
                <span>Évolution des Performances</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stats.evolution_tendances.map((evolution, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{evolution.enfant_nom}</h3>
                      <div className={`flex items-center space-x-1 text-sm font-medium ${
                        evolution.tendance === 'hausse' ? 'text-green-600' : 
                        evolution.tendance === 'baisse' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {evolution.tendance === 'hausse' ? <TrendingUp className="w-4 h-4" /> : 
                         evolution.tendance === 'baisse' ? <TrendingDown className="w-4 h-4" /> : 
                         <Activity className="w-4 h-4" />}
                        <span>{evolution.evolution > 0 ? '+' : ''}{evolution.evolution}</span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <div>Actuel: {evolution.moyenne_actuelle}/20</div>
                      <div>Précédent: {evolution.moyenne_precedente}/20</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Colonne droite - Alertes et activités */}
        <div className="space-y-6">
          {/* Alertes scolaires */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <Bell className="w-6 h-6 text-red-600" />
              <span>Alertes Scolaires</span>
            </h2>
            
            {stats.alertes_scolaires && stats.alertes_scolaires.length > 0 ? (
              <div className="space-y-4">
                {stats.alertes_scolaires.map((alerte, index) => (
                  <AlerteCard key={index} alerte={alerte} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-gray-600">Aucune alerte pour le moment</p>
                <p className="text-sm text-gray-500">Toutes les performances sont satisfaisantes</p>
              </div>
            )}
          </div>

          {/* Prochains bulletins */}
          {stats.prochains_bulletins && stats.prochains_bulletins.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <Calendar className="w-6 h-6 text-orange-600" />
                <span>Prochains Bulletins</span>
              </h2>
              
              <div className="space-y-3">
                {stats.prochains_bulletins.map((bulletin, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{bulletin.enfant}</span>
                      <span className="text-sm text-blue-600 font-medium">
                        {bulletin.jours_restants} jours
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>{bulletin.periode}</div>
                      <div className="text-xs text-gray-500">
                        Prévu le {new Date(bulletin.date_prevue).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activité récente */}
          {stats.activite_recente && stats.activite_recente.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <Activity className="w-6 h-6 text-indigo-600" />
                <span>Activité Récente</span>
              </h2>
              
              <div className="space-y-3">
                {stats.activite_recente.map((activite, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                      activite.type === 'note' ? 'bg-blue-500' : 'bg-green-500'
                    }`}>
                      {activite.type === 'note' ? '📝' : '📋'}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{activite.enfant}</div>
                      <div className="text-sm text-gray-600">{activite.description}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(activite.date).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions rapides */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Actions Rapides</h2>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => navigate('/parent/bulletins')}
                className="flex flex-col items-center space-y-2 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <FileText className="w-6 h-6 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Bulletins</span>
              </button>
              
              <button 
                onClick={() => navigate('/parent/notes')}
                className="flex flex-col items-center space-y-2 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <BookOpen className="w-6 h-6 text-green-600" />
                <span className="text-sm font-medium text-green-900">Notes</span>
              </button>
              
              <button 
                onClick={() => navigate('/parent/contact')}
                className="flex flex-col items-center space-y-2 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <Phone className="w-6 h-6 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Contact</span>
              </button>
              
              <button 
                onClick={() => navigate('/parent/planning')}
                className="flex flex-col items-center space-y-2 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
              >
                <Calendar className="w-6 h-6 text-orange-600" />
                <span className="text-sm font-medium text-orange-900">Planning</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboardAmélioré;