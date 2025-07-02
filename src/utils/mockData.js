// Données mock pour le développement

export const mockClasses = [
  { id: 1, nom: '6ème A', niveau: '6ème', effectif: 25 },
  { id: 2, nom: '6ème B', niveau: '6ème', effectif: 28 },
  { id: 3, nom: '5ème A', niveau: '5ème', effectif: 24 },
  { id: 4, nom: '4ème A', niveau: '4ème', effectif: 26 },
  { id: 5, nom: '3ème A', niveau: '3ème', effectif: 22 }
];

export const mockMatieres = [
  { id: 1, nom: 'Mathématiques', coefficient: 4, niveau: '6ème' },
  { id: 2, nom: 'Français', coefficient: 4, niveau: '6ème' },
  { id: 3, nom: 'Histoire-Géographie', coefficient: 3, niveau: '6ème' },
  { id: 4, nom: 'Sciences', coefficient: 3, niveau: '6ème' },
  { id: 5, nom: 'Anglais', coefficient: 3, niveau: '6ème' },
  { id: 6, nom: 'EPS', coefficient: 2, niveau: '6ème' }
];

export const mockEnseignants = [
  { 
    id: 1, 
    nom: 'Dupont', 
    prenom: 'Marie', 
    email: 'marie.dupont@ecole.com', 
    telephone: '0123456789',
    matieres: [1, 2], // IDs des matières
    classes: [1, 2] // IDs des classes
  },
  { 
    id: 2, 
    nom: 'Martin', 
    prenom: 'Pierre', 
    email: 'pierre.martin@ecole.com', 
    telephone: '0123456790',
    matieres: [3], 
    classes: [1, 3]
  }
];

export const mockEleves = [
  {
    id: 1,
    nom: 'Diallo',
    prenom: 'Aminata',
    email: 'aminata.diallo@eleve.com',
    classe_id: 1,
    date_naissance: '2010-05-15',
    adresse: '123 Rue de la Paix, Dakar',
    telephone_parent: '0123456791',
    parent_nom: 'Diallo',
    parent_prenom: 'Mamadou',
    parent_email: 'mamadou.diallo@parent.com'
  }
];

export const mockNotes = [
  {
    id: 1,
    eleve_id: 1,
    matiere_id: 1,
    note: 15,
    coefficient: 4,
    periode: 'Trimestre 1',
    date: '2024-11-15',
    type: 'Devoir'
  }
];

export const mockBulletins = [
  {
    id: 1,
    eleve_id: 1,
    periode: 'Trimestre 1',
    date_generation: '2024-12-15',
    moyenne_generale: 14.5,
    rang: 5,
    mention: 'Bien',
    appreciation: 'Bon travail, continue ainsi',
    notes: [
      { matiere: 'Mathématiques', note: 15, coefficient: 4 },
      { matiere: 'Français', note: 14, coefficient: 4 },
      { matiere: 'Histoire-Géographie', note: 13, coefficient: 3 }
    ]
  }
];