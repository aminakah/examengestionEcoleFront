// Données mock pour le développement - Version améliorée

export const mockClasses = [
  { 
    id: 1, 
    nom: '6ème A', 
    niveau: '6ème', 
    effectif: 25,
    enseignant_principal_id: 1,
    salle: 'Salle 101'
  },
  { 
    id: 2, 
    nom: '6ème B', 
    niveau: '6ème', 
    effectif: 28,
    enseignant_principal_id: 2,
    salle: 'Salle 102'
  },
  { 
    id: 3, 
    nom: '5ème A', 
    niveau: '5ème', 
    effectif: 24,
    enseignant_principal_id: 3,
    salle: 'Salle 201'
  },
  { 
    id: 4, 
    nom: '4ème A', 
    niveau: '4ème', 
    effectif: 26,
    enseignant_principal_id: 4,
    salle: 'Salle 202'
  },
  { 
    id: 5, 
    nom: '3ème A', 
    niveau: '3ème', 
    effectif: 22,
    enseignant_principal_id: 5,
    salle: 'Salle 301'
  }
];

export const mockMatieres = [
  { 
    id: 1, 
    nom: 'Mathématiques', 
    coefficient: 4, 
    niveau: '6ème',
    enseignant_id: 1,
    heures_semaine: 4
  },
  { 
    id: 2, 
    nom: 'Français', 
    coefficient: 4, 
    niveau: '6ème',
    enseignant_id: 2,
    heures_semaine: 5
  },
  { 
    id: 3, 
    nom: 'Histoire-Géographie', 
    coefficient: 3, 
    niveau: '6ème',
    enseignant_id: 3,
    heures_semaine: 3
  },
  { 
    id: 4, 
    nom: 'Sciences de la Vie et de la Terre', 
    coefficient: 3, 
    niveau: '6ème',
    enseignant_id: 4,
    heures_semaine: 2
  },
  { 
    id: 5, 
    nom: 'Anglais', 
    coefficient: 3, 
    niveau: '6ème',
    enseignant_id: 5,
    heures_semaine: 3
  },
  { 
    id: 6, 
    nom: 'Éducation Physique et Sportive', 
    coefficient: 2, 
    niveau: '6ème',
    enseignant_id: 6,
    heures_semaine: 2
  },
  { 
    id: 7, 
    nom: 'Arts Plastiques', 
    coefficient: 2, 
    niveau: '6ème',
    enseignant_id: 7,
    heures_semaine: 1
  },
  { 
    id: 8, 
    nom: 'Musique', 
    coefficient: 2, 
    niveau: '6ème',
    enseignant_id: 8,
    heures_semaine: 1
  }
];

export const mockEnseignants = [
  { 
    id: 1, 
    nom: 'Dupont', 
    prenom: 'Marie', 
    email: 'marie.dupont@ecole.com', 
    telephone: '0123456789',
    specialite: 'Mathématiques',
    date_embauche: '2018-09-01',
    matieres: [1], // IDs des matières
    classes: [1, 2], // IDs des classes
    statut: 'actif'
  },
  { 
    id: 2, 
    nom: 'Martin', 
    prenom: 'Pierre', 
    email: 'pierre.martin@ecole.com', 
    telephone: '0123456790',
    specialite: 'Français',
    date_embauche: '2019-09-01',
    matieres: [2], 
    classes: [1, 3],
    statut: 'actif'
  },
  { 
    id: 3, 
    nom: 'Leroy', 
    prenom: 'Sophie', 
    email: 'sophie.leroy@ecole.com', 
    telephone: '0123456791',
    specialite: 'Histoire-Géographie',
    date_embauche: '2017-09-01',
    matieres: [3], 
    classes: [1, 4],
    statut: 'actif'
  },
  { 
    id: 4, 
    nom: 'Dubois', 
    prenom: 'Laurent', 
    email: 'laurent.dubois@ecole.com', 
    telephone: '0123456792',
    specialite: 'Sciences',
    date_embauche: '2020-09-01',
    matieres: [4], 
    classes: [2, 3],
    statut: 'actif'
  },
  { 
    id: 5, 
    nom: 'Bernard', 
    prenom: 'Julie', 
    email: 'julie.bernard@ecole.com', 
    telephone: '0123456793',
    specialite: 'Anglais',
    date_embauche: '2019-09-01',
    matieres: [5], 
    classes: [1, 2, 3],
    statut: 'actif'
  },
  { 
    id: 6, 
    nom: 'Moreau', 
    prenom: 'Antoine', 
    email: 'antoine.moreau@ecole.com', 
    telephone: '0123456794',
    specialite: 'EPS',
    date_embauche: '2021-09-01',
    matieres: [6], 
    classes: [1, 2, 3, 4, 5],
    statut: 'actif'
  },
  { 
    id: 7, 
    nom: 'Garcia', 
    prenom: 'Carmen', 
    email: 'carmen.garcia@ecole.com', 
    telephone: '0123456795',
    specialite: 'Arts Plastiques',
    date_embauche: '2018-09-01',
    matieres: [7], 
    classes: [1, 2, 3],
    statut: 'actif'
  },
  { 
    id: 8, 
    nom: 'Roux', 
    prenom: 'David', 
    email: 'david.roux@ecole.com', 
    telephone: '0123456796',
    specialite: 'Musique',
    date_embauche: '2020-09-01',
    matieres: [8], 
    classes: [1, 2, 3, 4, 5],
    statut: 'actif'
  }
];

export const mockEleves = [
  {
    id: 1,
    nom: 'Diallo',
    prenom: 'Aminata',
    email: 'aminata.diallo@eleve.com',
    classe_id: 1,
    classe_nom: '6ème A',
    date_naissance: '2010-05-15',
    lieu_naissance: 'Dakar, Sénégal',
    adresse: '123 Rue de la Paix, Dakar',
    telephone: '0771234567',
    parent_nom: 'Diallo',
    parent_prenom: 'Mamadou',
    parent_email: 'parent@ecole.com',
    telephone_parent: '0781234567',
    parent_adresse: '123 Rue de la Paix, Dakar',
    date_inscription: '2024-09-01',
    statut: 'actif'
  },
  {
    id: 2,
    nom: 'Ndiaye',
    prenom: 'Omar',
    email: 'omar.ndiaye@eleve.com',
    classe_id: 1,
    classe_nom: '6ème A',
    date_naissance: '2010-08-22',
    lieu_naissance: 'Thiès, Sénégal',
    adresse: '456 Avenue Léopold Senghor, Dakar',
    telephone: '0772345678',
    parent_nom: 'Ndiaye',
    parent_prenom: 'Fatou',
    parent_email: 'fatou.ndiaye@parent.com',
    telephone_parent: '0782345678',
    parent_adresse: '456 Avenue Léopold Senghor, Dakar',
    date_inscription: '2024-09-01',
    statut: 'actif'
  },
  {
    id: 3,
    nom: 'Fall',
    prenom: 'Aïssatou',
    email: 'aissatou.fall@eleve.com',
    classe_id: 2,
    classe_nom: '6ème B',
    date_naissance: '2010-12-10',
    lieu_naissance: 'Saint-Louis, Sénégal',
    adresse: '789 Rue Victor Hugo, Dakar',
    telephone: '0773456789',
    parent_nom: 'Fall',
    parent_prenom: 'Moussa',
    parent_email: 'moussa.fall@parent.com',
    telephone_parent: '0783456789',
    parent_adresse: '789 Rue Victor Hugo, Dakar',
    date_inscription: '2024-09-01',
    statut: 'actif'
  },
  {
    id: 4,
    nom: 'Sow',
    prenom: 'Ibrahima',
    email: 'ibrahima.sow@eleve.com',
    classe_id: 2,
    classe_nom: '6ème B',
    date_naissance: '2010-03-18',
    lieu_naissance: 'Kaolack, Sénégal',
    adresse: '321 Boulevard de la République, Dakar',
    telephone: '0774567890',
    parent_nom: 'Sow',
    parent_prenom: 'Awa',
    parent_email: 'awa.sow@parent.com',
    telephone_parent: '0784567890',
    parent_adresse: '321 Boulevard de la République, Dakar',
    date_inscription: '2024-09-01',
    statut: 'actif'
  },
  {
    id: 5,
    nom: 'Ba',
    prenom: 'Khady',
    email: 'khady.ba@eleve.com',
    classe_id: 3,
    classe_nom: '5ème A',
    date_naissance: '2009-07-25',
    lieu_naissance: 'Ziguinchor, Sénégal',
    adresse: '654 Rue de la Liberté, Dakar',
    telephone: '0775678901',
    parent_nom: 'Ba',
    parent_prenom: 'Amadou',
    parent_email: 'amadou.ba@parent.com',
    telephone_parent: '0785678901',
    parent_adresse: '654 Rue de la Liberté, Dakar',
    date_inscription: '2023-09-01',
    statut: 'actif'
  },
  {
    id: 6,
    nom: 'Sy',
    prenom: 'Modou',
    email: 'modou.sy@eleve.com',
    classe_id: 3,
    classe_nom: '5ème A',
    date_naissance: '2009-11-30',
    lieu_naissance: 'Louga, Sénégal',
    adresse: '987 Avenue Cheikh Anta Diop, Dakar',
    telephone: '0776789012',
    parent_nom: 'Sy',
    parent_prenom: 'Marième',
    parent_email: 'marieme.sy@parent.com',
    telephone_parent: '0786789012',
    parent_adresse: '987 Avenue Cheikh Anta Diop, Dakar',
    date_inscription: '2023-09-01',
    statut: 'actif'
  }
];

export const mockNotes = [
  // Notes pour Aminata Diallo (élève 1) - 6ème A
  {
    id: 1,
    eleve_id: 1,
    matiere_id: 1,
    matiere_nom: 'Mathématiques',
    note: 15.5,
    coefficient: 4,
    periode: 'Trimestre 1',
    appreciation: 'Très bon travail, continue ainsi',
    date_saisie: '2025-01-15T10:00:00',
    enseignant_id: 1
  },
  {
    id: 2,
    eleve_id: 1,
    matiere_id: 2,
    matiere_nom: 'Français',
    note: 13,
    coefficient: 4,
    periode: 'Trimestre 1',
    appreciation: 'Bon niveau, peut encore progresser',
    date_saisie: '2025-01-16T14:00:00',
    enseignant_id: 2
  },
  {
    id: 3,
    eleve_id: 1,
    matiere_id: 3,
    matiere_nom: 'Histoire-Géographie',
    note: 16,
    coefficient: 3,
    periode: 'Trimestre 1',
    appreciation: 'Excellent travail, très bonne participation',
    date_saisie: '2025-01-17T09:00:00',
    enseignant_id: 3
  },
  {
    id: 4,
    eleve_id: 1,
    matiere_id: 5,
    matiere_nom: 'Anglais',
    note: 14,
    coefficient: 3,
    periode: 'Trimestre 1',
    appreciation: 'Bonne progression, continue tes efforts',
    date_saisie: '2025-01-18T11:00:00',
    enseignant_id: 5
  },

  // Notes pour Omar Ndiaye (élève 2) - 6ème A
  {
    id: 5,
    eleve_id: 2,
    matiere_id: 1,
    matiere_nom: 'Mathématiques',
    note: 12,
    coefficient: 4,
    periode: 'Trimestre 1',
    appreciation: 'Travail correct, doit consolider ses bases',
    date_saisie: '2025-01-15T10:00:00',
    enseignant_id: 1
  },
  {
    id: 6,
    eleve_id: 2,
    matiere_id: 2,
    matiere_nom: 'Français',
    note: 11,
    coefficient: 4,
    periode: 'Trimestre 1',
    appreciation: 'Doit travailler l\'expression écrite',
    date_saisie: '2025-01-16T14:00:00',
    enseignant_id: 2
  },
  {
    id: 7,
    eleve_id: 2,
    matiere_id: 3,
    matiere_nom: 'Histoire-Géographie',
    note: 13.5,
    coefficient: 3,
    periode: 'Trimestre 1',
    appreciation: 'Bon travail, participation active en classe',
    date_saisie: '2025-01-17T09:00:00',
    enseignant_id: 3
  },

  // Notes pour Aïssatou Fall (élève 3) - 6ème B
  {
    id: 8,
    eleve_id: 3,
    matiere_id: 1,
    matiere_nom: 'Mathématiques',
    note: 17,
    coefficient: 4,
    periode: 'Trimestre 1',
    appreciation: 'Excellent niveau, élève très douée',
    date_saisie: '2025-01-15T10:00:00',
    enseignant_id: 1
  },
  {
    id: 9,
    eleve_id: 3,
    matiere_id: 2,
    matiere_nom: 'Français',
    note: 15.5,
    coefficient: 4,
    periode: 'Trimestre 1',
    appreciation: 'Très bonne maîtrise de la langue',
    date_saisie: '2025-01-16T14:00:00',
    enseignant_id: 2
  },

  // Notes Trimestre 2 pour Aminata
  {
    id: 10,
    eleve_id: 1,
    matiere_id: 1,
    matiere_nom: 'Mathématiques',
    note: 16,
    coefficient: 4,
    periode: 'Trimestre 2',
    appreciation: 'Progression constante, excellent travail',
    date_saisie: '2025-01-20T10:00:00',
    enseignant_id: 1
  },
  {
    id: 11,
    eleve_id: 1,
    matiere_id: 2,
    matiere_nom: 'Français',
    note: 14.5,
    coefficient: 4,
    periode: 'Trimestre 2',
    appreciation: 'Nette amélioration, continue',
    date_saisie: '2025-01-21T14:00:00',
    enseignant_id: 2
  }
];

export const mockBulletins = [
  {
    id: 1,
    eleve_id: 1,
    periode: 'Trimestre 1',
    moyenne_generale: 14.2,
    rang: 3,
    total_eleves: 25,
    mention: 'Bien',
    date_generation: '2025-01-20T00:00:00',
    statut: 'final'
  },
  {
    id: 2,
    eleve_id: 2,
    periode: 'Trimestre 1',
    moyenne_generale: 12.1,
    rang: 12,
    total_eleves: 25,
    mention: 'Assez Bien',
    date_generation: '2025-01-20T00:00:00',
    statut: 'final'
  },
  {
    id: 3,
    eleve_id: 3,
    periode: 'Trimestre 1',
    moyenne_generale: 16.3,
    rang: 1,
    total_eleves: 28,
    mention: 'Très Bien',
    date_generation: '2025-01-20T00:00:00',
    statut: 'final'
  }
];

// Données statistiques pour le dashboard
export const mockStatistiques = {
  total_eleves: 125,
  total_enseignants: 18,
  total_classes: 8,
  moyenne_generale_etablissement: 13.4,
  taux_reussite: 82,
  notes_saisies_mois: 156,
  bulletins_generes_mois: 45,
  documents_en_attente: 8,
  moyennes_par_classe: [
    { classe: '6ème A', moyenne: 13.8, effectif: 25 },
    { classe: '6ème B', moyenne: 14.2, effectif: 28 },
    { classe: '5ème A', moyenne: 13.1, effectif: 24 },
    { classe: '4ème A', moyenne: 12.9, effectif: 26 },
    { classe: '3ème A', moyenne: 13.5, effectif: 22 }
  ],
  evolution_notes: [
    { mois: 'Sept', moyenne: 12.8 },
    { mois: 'Oct', moyenne: 13.1 },
    { mois: 'Nov', moyenne: 13.3 },
    { mois: 'Déc', moyenne: 13.4 },
    { mois: 'Jan', moyenne: 13.4 }
  ]
};
