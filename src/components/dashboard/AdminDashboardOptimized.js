import React from 'react';

/**
 * Dashboard Administrateur Optimisé pour les données existantes
 * Copier cette fonction pour remplacer AdminDashboard dans SmartDashboard.js
 */
function QuickActionButton({ title, icon, href, onClick }) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      // Navigation vers l'URL
      window.location.href = href;
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-gray-50 hover:bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center transition-colors"
    >
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-sm font-medium text-gray-700">{title}</div>
    </button>
  );
}

function StatCard({ title, value, icon, color = 'blue', subtitle }) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center">
        <div className={`${colorClasses[color]} rounded-lg p-3 text-white text-2xl`}>
          {icon}
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
} 
function AdminDashboard({ data }) {
  const stats = data?.main?.totaux || {};
  const anneeScolaire = data?.main?.annee_scolaire || {};
  const inscriptions = data?.main?.inscriptions || {};
  const tauxRemplissage = data?.main?.taux_remplissage || {};
  const derniersInscrits = data?.main?.derniers_inscrits || [];
  const activiteRecente = data?.main?.activite_recente || [];
  
  console.log('Admin Dashboard Data:', data);

  // Transformer les données pour le tableau des classes
  const classesData = tauxRemplissage.details || [];

  return (
    <div className="space-y-6">
      {/* Informations sur l'année scolaire */}
      {anneeScolaire.libelle && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
          <div className="flex items-center">
            <span className="text-blue-400 text-xl mr-3">📅</span>
            <div>
              <p className="text-blue-700 font-medium">
                Année Scolaire Actuelle : {anneeScolaire.libelle}
              </p>
              <p className="text-blue-600 text-sm">
                Du {new Date(anneeScolaire.date_debut).toLocaleDateString('fr-FR')} au {new Date(anneeScolaire.date_fin).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Élèves"
          value={stats.eleves || 0}
          icon="👥"
          color="blue"
          subtitle="Élèves inscrits"
        />
        <StatCard
          title="Enseignants"
          value={stats.enseignants || 0}
          icon="👨‍🏫"
          color="green"
          subtitle="Corps enseignant"
        />
        <StatCard
          title="Classes Actives"
          value={stats.classes || 0}
          icon="🏫"
          color="purple"
          subtitle="Toutes classes"
        />
        <StatCard
          title="Parents"
          value={stats.parents || 0}
          icon="👨‍👩‍👧‍👦"
          color="orange"
          subtitle="Familles inscrites"
        />
      </div>

      {/* Statistiques d'inscriptions et performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Inscriptions</h3>
            <span className="text-3xl">📊</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total inscriptions</span>
              <span className="font-bold text-xl text-blue-600">
                {inscriptions.total || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Filles</span>
              <span className="font-bold text-pink-600">
                {inscriptions.par_sexe?.find(s => s.sexe === 'F')?.total || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Garçons</span>
              <span className="font-bold text-blue-600">
                {inscriptions.par_sexe?.find(s => s.sexe === 'M')?.total || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Taux de Remplissage</h3>
            <span className="text-3xl">📈</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Taux global</span>
              <div className="text-right">
                <span className={`font-bold text-xl ${
                  tauxRemplissage.taux_global >= 80 ? 'text-green-600' : 
                  tauxRemplissage.taux_global >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {tauxRemplissage.taux_global || 0}%
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  tauxRemplissage.taux_global >= 80 ? 'bg-green-500' : 
                  tauxRemplissage.taux_global >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${tauxRemplissage.taux_global || 0}%` }}
              ></div>
            </div>
            <div className="text-sm text-gray-500">
              Capacité totale utilisée
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Activité Récente</h3>
            <span className="text-3xl">🔄</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Notes saisies</span>
              <span className="font-medium text-blue-600">
                {activiteRecente.filter(a => a.type === 'note').length}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Bulletins générés</span>
              <span className="font-medium text-green-600">
                {activiteRecente.filter(a => a.type === 'bulletin').length}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Nouvelles inscriptions</span>
              <span className="font-medium text-purple-600">
                {derniersInscrits.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Répartition par niveau */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Répartition des Élèves par Niveau</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {inscriptions.par_niveau?.map((niveau, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="text-2xl font-bold text-blue-600">{niveau.total}</div>
                <div className="text-sm text-gray-600">{niveau.nom}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {((niveau.total / inscriptions.total) * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tableau détaillé des classes */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Performance des Classes (Taux de Remplissage)</h3>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Taux global: {tauxRemplissage.taux_global}%
              </span>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Gérer les classes
              </button>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Classe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Niveau
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Effectif
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Taux
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {classesData.length > 0 ? classesData.map((classe, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{classe.classe}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{classe.niveau}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">{classe.effectif}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{classe.capacite}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-bold ${
                        classe.taux >= 80 ? 'text-green-600' : 
                        classe.taux >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {classe.taux.toFixed(1)}%
                      </div>
                      <div className="w-12 bg-gray-200 rounded-full h-1 mt-1">
                        <div 
                          className={`h-1 rounded-full ${
                            classe.taux >= 80 ? 'bg-green-500' : 
                            classe.taux >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${classe.taux}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        classe.taux >= 80 ? 'bg-green-100 text-green-800' : 
                        classe.taux >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {classe.taux >= 80 ? 'Optimal' : 
                         classe.taux >= 60 ? 'Correct' : 'Faible'}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      Aucune donnée disponible
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Activité récente et inscriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Activité Récente</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {activiteRecente.slice(0, 10).map((activite, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                  <span className="text-xl flex-shrink-0">
                    {activite.type === 'note' ? '📝' : activite.type === 'bulletin' ? '📋' : '📋'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 font-medium">{activite.description}</p>
                    <p className="text-xs text-gray-500">
                      Par {activite.par} • {new Date(activite.date).toLocaleDateString('fr-FR')} à {new Date(activite.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    activite.type === 'note' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {activite.type === 'note' ? 'Note' : 'Bulletin'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Dernières Inscriptions</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {derniersInscrits.slice(0, 8).map((inscription, index) => (
                <div key={index} className="flex items-start justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{inscription.eleve}</p>
                    <p className="text-xs text-gray-500">{inscription.matricule}</p>
                    <p className="text-xs text-blue-600 font-medium">{inscription.classe}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="text-xs text-gray-500">{inscription.date}</p>
                    <span className="inline-flex px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full mt-1">
                      Nouveau
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides administrateur */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Actions Asdcvdministratives</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <QuickActionButton
            title="Nouvel élève"
            icon="👤"
            href="/admin/eleves/nouveau"
          />
          <QuickActionButton
            title="Nouvelle classe"
            icon="🏫"
            href="/admin/classes/nouvelle"
          />
          <QuickActionButton
            title="Ajouter enseignant"
            icon="👨‍🏫"
            href="/admin/enseignants/nouveau"
          />
          <QuickActionButton
            title="Gérer matières"
            icon="📚"
            href="/admin/matieres"
          />
          <QuickActionButton
            title="Générer bulletins"
            icon="📋"
            href="/admin/bulletins/generer"
          />
          <QuickActionButton
            title="Rapports"
            icon="📊"
            href="/admin/rapports"
          />
        </div>
      </div>

      {/* Alertes basées sur les données */}
      {classesData.filter(c => c.taux < 60).length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-yellow-400 text-xl">⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <span className="font-medium">Attention :</span> {classesData.filter(c => c.taux < 60).length} classe(s) 
                ont un taux de remplissage faible 
              </p>
              <div className="mt-2">
                <button className="text-yellow-700 hover:text-yellow-600 text-sm font-medium underline">
                  Voir les détails
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
