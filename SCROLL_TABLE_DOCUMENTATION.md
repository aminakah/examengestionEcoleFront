# Documentation - TableWithAdvancedScroll

## Description
Le composant `TableWithAdvancedScroll` est une version améliorée du composant Table de base qui offre :
- Scroll vertical et horizontal optimisé
- Pagination intégrée
- En-têtes et colonnes d'actions collants (sticky)
- Indicateurs de scroll
- Animations et effets visuels améliorés
- Scrollbars personnalisées

## Import
```javascript
import { TableWithAdvancedScroll } from '../components/UIComponents';
```

## Props

### Props obligatoires
- `columns` (Array) : Configuration des colonnes
- `data` (Array) : Données à afficher

### Props optionnelles
- `actions` (Array) : Actions disponibles pour chaque ligne (défaut: [])
- `maxHeight` (String) : Hauteur maximale du tableau (défaut: '600px')
- `itemsPerPage` (Number) : Nombre d'éléments par page (défaut: 20)
- `showPagination` (Boolean) : Afficher la pagination (défaut: true)
- `stickyHeader` (Boolean) : En-têtes collants (défaut: true)
- `stickyActions` (Boolean) : Colonne d'actions collante (défaut: true)
- `className` (String) : Classes CSS additionnelles (défaut: '')
- `emptyMessage` (String) : Message si aucune donnée (défaut: "Aucune donnée disponible")

## Configuration des colonnes

Chaque colonne dans le tableau `columns` peut avoir :

```javascript
{
  key: 'nom_colonne',           // Clé de la donnée
  label: 'Nom affiché',         // Titre de la colonne
  minWidth: '200px',            // Largeur minimale (optionnel)
  wrap: true,                   // Retour à la ligne (optionnel, défaut: false)
  render: (value, row, index) => {  // Fonction de rendu personnalisé (optionnel)
    return <span>{value}</span>;
  }
}
```

## Configuration des actions

Chaque action dans le tableau `actions` peut avoir :

```javascript
{
  icon: Edit,                   // Composant icône Lucide React
  label: 'Modifier',           // Texte de l'infobulle
  onClick: (row, index) => {}, // Fonction appelée au clic
  variant: 'default',          // Style : 'default', 'danger', 'warning', 'success'
  disabled: (row) => false     // Fonction pour désactiver l'action (optionnel)
}
```

## Exemple d'utilisation basique

```javascript
const columns = [
  {
    key: 'nom',
    label: 'Nom',
    minWidth: '200px',
    render: (value, row) => (
      <div className="font-medium">{value}</div>
    )
  },
  {
    key: 'email',
    label: 'Email',
    minWidth: '250px'
  },
  {
    key: 'date_creation',
    label: 'Date création',
    render: (value) => new Date(value).toLocaleDateString('fr-FR')
  }
];

const actions = [
  {
    icon: Eye,
    label: 'Voir détails',
    onClick: (row) => console.log('Voir', row),
    variant: 'default'
  },
  {
    icon: Edit,
    label: 'Modifier',
    onClick: (row) => console.log('Modifier', row),
    variant: 'default'
  },
  {
    icon: Trash2,
    label: 'Supprimer',
    onClick: (row) => console.log('Supprimer', row),
    variant: 'danger'
  }
];

return (
  <TableWithAdvancedScroll
    columns={columns}
    data={mesdonnees}
    actions={actions}
    maxHeight="500px"
    itemsPerPage={15}
    showPagination={true}
    stickyHeader={true}
    stickyActions={true}
  />
);
```

## Exemple d'utilisation avancée

```javascript
const columns = [
  {
    key: 'nom',
    label: 'Nom complet',
    minWidth: '250px',
    render: (value, row) => (
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
          {value.charAt(0)}
        </div>
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-gray-500">{row.email}</div>
        </div>
      </div>
    )
  },
  {
    key: 'statut',
    label: 'Statut',
    minWidth: '120px',
    render: (value) => (
      <span className={`px-2 py-1 rounded-full text-xs ${
        value === 'actif' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {value}
      </span>
    )
  },
  {
    key: 'description',
    label: 'Description',
    minWidth: '300px',
    wrap: true,  // Permet le retour à la ligne
    render: (value) => (
      <div className="max-w-xs">
        {value}
      </div>
    )
  }
];

const actions = [
  {
    icon: Eye,
    label: 'Voir détails',
    onClick: handleView,
    variant: 'default'
  },
  {
    icon: Edit,
    label: 'Modifier',
    onClick: handleEdit,
    variant: 'default',
    disabled: (row) => row.statut === 'bloqué'  // Désactiver si bloqué
  },
  {
    icon: Trash2,
    label: 'Supprimer',
    onClick: handleDelete,
    variant: 'danger',
    disabled: (row) => row.statut === 'protégé'
  }
];

return (
  <div className="space-y-6">
    <TableWithAdvancedScroll
      columns={columns}
      data={filteredData}
      actions={actions}
      maxHeight="400px"
      itemsPerPage={10}
      showPagination={true}
      stickyHeader={true}
      stickyActions={true}
      className="shadow-lg"
      emptyMessage="Aucun élément ne correspond à vos critères"
    />
  </div>
);
```

## Fonctionnalités

### 1. Scroll vertical avec hauteur maximale
- Le tableau peut avoir une hauteur maximale définie
- Scroll automatique quand le contenu dépasse

### 2. En-têtes collants (Sticky Headers)
- Les en-têtes restent visibles lors du scroll vertical
- Option `stickyHeader` pour activer/désactiver

### 3. Colonne d'actions collante
- La colonne d'actions reste visible lors du scroll horizontal
- Option `stickyActions` pour activer/désactiver

### 4. Pagination intégrée
- Pagination automatique avec navigation
- Affichage intelligent des numéros de pages
- Navigation rapide première/dernière page

### 5. Indicateurs visuels
- Indicateur du nombre d'éléments total
- Indication quand le tableau est scrollable
- Animations au survol des lignes

### 6. Scrollbars personnalisées
- Design moderne et discret
- Apparition au survol
- Compatible avec tous les navigateurs

## Styles CSS requis

Le composant utilise les classes CSS définies dans `index.css` :
- `.scrollbar-thin`
- `.scrollbar-thumb-gray-300`
- `.scrollbar-track-gray-100`
- `.table-container`
- `.table-row-hover`

## Migration depuis Table basique

Pour migrer du composant `Table` vers `TableWithAdvancedScroll` :

1. Remplacer l'import :
```javascript
// Ancien
import { Table } from '../components/UIComponents';

// Nouveau
import { TableWithAdvancedScroll } from '../components/UIComponents';
```

2. Ajouter `minWidth` aux colonnes si nécessaire :
```javascript
const columns = [
  {
    key: 'nom',
    label: 'Nom',
    minWidth: '200px',  // Nouveau
    render: (value) => value
  }
];
```

3. Remplacer le composant :
```javascript
// Ancien
<Table columns={columns} data={data} actions={actions} />

// Nouveau
<TableWithAdvancedScroll 
  columns={columns} 
  data={data} 
  actions={actions}
  maxHeight="500px"
  itemsPerPage={15}
/>
```

## Bonnes pratiques

1. **Largeurs des colonnes** : Définir `minWidth` pour les colonnes importantes
2. **Actions** : Limiter à 3-4 actions par ligne pour une meilleure UX
3. **Pagination** : Utiliser 10-20 éléments par page selon la complexité
4. **Hauteur** : Adapter `maxHeight` selon l'espace disponible
5. **Données** : Prévoir des fallbacks pour les données manquantes

## Performance

- Pagination pour limiter le DOM
- Rendu optimisé avec React.memo possible
- Scrollbars natives optimisées
- Animations CSS hardware-accelerated
