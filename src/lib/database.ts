import { Candidate, CandidateFormData } from '@/types/candidate';

const STORAGE_KEY = 'candidates_db';

const generateId = (): string => {
  return `CND-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

export const getAllCandidates = (): Candidate[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const getCandidateById = (id: string): Candidate | undefined => {
  const candidates = getAllCandidates();
  return candidates.find(c => c.id === id);
};

export const addCandidate = (data: CandidateFormData): Candidate => {
  const candidates = getAllCandidates();
  const now = new Date().toISOString();
  
  const newCandidate: Candidate = {
    ...data,
    id: generateId(),
    dateCreation: now,
    dateModification: now,
  };
  
  candidates.push(newCandidate);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates));
  
  return newCandidate;
};

export const updateCandidate = (id: string, data: Partial<CandidateFormData>): Candidate | undefined => {
  const candidates = getAllCandidates();
  const index = candidates.findIndex(c => c.id === id);
  
  if (index === -1) return undefined;
  
  candidates[index] = {
    ...candidates[index],
    ...data,
    dateModification: new Date().toISOString(),
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates));
  return candidates[index];
};

export const deleteCandidate = (id: string): boolean => {
  const candidates = getAllCandidates();
  const filtered = candidates.filter(c => c.id !== id);
  
  if (filtered.length === candidates.length) return false;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
};

export const getStatistics = () => {
  const candidates = getAllCandidates();
  
  return {
    total: candidates.length,
    parType: {
      actif: candidates.filter(c => c.typeCandidat === 'Jeune diplômé actif').length,
      chomage: candidates.filter(c => c.typeCandidat === 'Jeune diplômé en chômage').length,
      neet: candidates.filter(c => c.typeCandidat === 'NEET').length,
    },
    parObjectif: {
      entrepreneuriat: candidates.filter(c => c.objectif === 'Entrepreneuriat').length,
      ess: candidates.filter(c => c.objectif === 'ESS').length,
      formation: candidates.filter(c => c.objectif === 'Formation').length,
      employabilite: candidates.filter(c => c.objectif === 'Employabilité').length,
    },
    parGenre: {
      homme: candidates.filter(c => c.genre === 'Homme').length,
      femme: candidates.filter(c => c.genre === 'Femme').length,
    },
  };
};

// Seed data for demo - 30 candidats
export const seedDatabase = () => {
  const existing = getAllCandidates();
  if (existing.length >= 30) return;
  
  // Clear and reseed if less than 30
  localStorage.removeItem(STORAGE_KEY);
  
  const demoData: CandidateFormData[] = [
    {
      nom: 'BENALI', prenom: 'Youssef', cin: 'AB123456', dateNaissance: '1998-05-15', lieuNaissance: 'Rabat',
      genre: 'Homme', adresse: '25 Rue Mohamed V', arrondissement: 'Agdal Riad', telephone: '0612345678',
      email: 'youssef.benali@email.com', typeCandidat: 'Jeune diplômé en chômage', situationMatrimoniale: 'Célibataire',
      occupationMere: 'Enseignante', occupationPere: 'Commerçant', niveauEtude: 'Supérieur', typeDiplome: 'Bac+3',
      filiereDiplome: 'Informatique', experienceGenerale: "Moins d'un an",
      langues: [{ name: 'Arabe', level: 'Natif' }, { name: 'Français', level: 'Courant' }],
      milieu: 'Urbain', sourceInscription: 'ANAPEC', objectif: 'Employabilité', formationChoisie: 'Développement Web',
      orientation: 'Interne', destination: 'Centre de formation', dateOrientation: '2024-01-15', observations: 'Candidat motivé.',
    },
    {
      nom: 'CHAKIR', prenom: 'Fatima', cin: 'CD789012', dateNaissance: '2000-08-22', lieuNaissance: 'Casablanca',
      genre: 'Femme', adresse: '10 Avenue Hassan II', arrondissement: 'Hassan', telephone: '0698765432',
      email: 'fatima.chakir@email.com', typeCandidat: 'NEET', situationMatrimoniale: 'Célibataire',
      occupationMere: 'Femme au foyer', occupationPere: 'Retraité', niveauEtude: 'Secondaire qualifiant', typeDiplome: 'Bac',
      filiereDiplome: 'Commerce', experienceGenerale: "Pas d'expérience",
      langues: [{ name: 'Arabe', level: 'Natif' }, { name: 'Français', level: 'Avancé' }],
      milieu: 'Urbain', sourceInscription: 'Réseaux sociaux', objectif: 'Formation', formationChoisie: 'Marketing Digital',
      orientation: 'Externe', destination: 'Entreprise partenaire', dateOrientation: '2024-02-01', observations: 'Intéressée par le marketing.',
    },
    {
      nom: 'EL AMRANI', prenom: 'Omar', cin: 'EF345678', dateNaissance: '1995-03-10', lieuNaissance: 'Fès',
      genre: 'Homme', adresse: '5 Rue Ibn Khaldoun', arrondissement: 'Youssoufia', telephone: '0654321098',
      email: 'omar.elamrani@email.com', typeCandidat: 'Jeune diplômé actif', situationMatrimoniale: 'Marié(e)',
      occupationMere: 'Artisane', occupationPere: 'Agriculteur', niveauEtude: 'Supérieur', typeDiplome: 'Bac+5',
      filiereDiplome: 'Gestion', experienceGenerale: 'Entre 3 et 5 ans',
      langues: [{ name: 'Arabe', level: 'Natif' }, { name: 'Français', level: 'Courant' }, { name: 'Anglais', level: 'Avancé' }],
      milieu: 'Périurbain', sourceInscription: 'Partenaire', objectif: 'Entrepreneuriat', formationChoisie: 'Gestion de projet',
      orientation: 'Interne', destination: 'Incubateur', dateOrientation: '2024-01-20', observations: 'Projet agricole.',
    },
    {
      nom: 'IDRISSI', prenom: 'Khadija', cin: 'GH901234', dateNaissance: '1999-11-05', lieuNaissance: 'Marrakech',
      genre: 'Femme', adresse: '15 Rue Moulay Rachid', arrondissement: 'Hay Riad', telephone: '0623456789',
      email: 'khadija.idrissi@email.com', typeCandidat: 'Jeune diplômé en chômage', situationMatrimoniale: 'Célibataire',
      occupationMere: 'Couturière', occupationPere: 'Chauffeur', niveauEtude: 'Supérieur', typeDiplome: 'Bac+2',
      filiereDiplome: 'Commerce', experienceGenerale: "Moins d'un an",
      langues: [{ name: 'Arabe', level: 'Natif' }, { name: 'Français', level: 'Courant' }],
      milieu: 'Urbain', sourceInscription: 'Site web', objectif: 'Employabilité', formationChoisie: 'Comptabilité',
      orientation: 'Interne', destination: 'Entreprise partenaire', dateOrientation: '2024-03-10', observations: 'Sérieuse et motivée.',
    },
    {
      nom: 'OULAD', prenom: 'Mehdi', cin: 'IJ567890', dateNaissance: '1997-07-18', lieuNaissance: 'Tanger',
      genre: 'Homme', adresse: '30 Boulevard Zerktouni', arrondissement: 'Souissi', telephone: '0634567890',
      email: 'mehdi.oulad@email.com', typeCandidat: 'NEET', situationMatrimoniale: 'Célibataire',
      occupationMere: 'Sans emploi', occupationPere: 'Ouvrier', niveauEtude: 'Secondaire collégial', typeDiplome: 'Sans',
      filiereDiplome: 'Non applicable', experienceGenerale: "Pas d'expérience",
      langues: [{ name: 'Arabe', level: 'Natif' }],
      milieu: 'Rural', sourceInscription: 'Entraide Nationale', objectif: 'Formation', formationChoisie: 'Artisanat',
      orientation: 'Externe', destination: 'Centre de formation', dateOrientation: '2024-02-15', observations: 'Besoin d\'accompagnement.',
    },
    {
      nom: 'BENNANI', prenom: 'Sara', cin: 'KL234567', dateNaissance: '2001-04-25', lieuNaissance: 'Rabat',
      genre: 'Femme', adresse: '8 Rue Allal Ben Abdellah', arrondissement: 'Akkari', telephone: '0645678901',
      email: 'sara.bennani@email.com', typeCandidat: 'Jeune diplômé actif', situationMatrimoniale: 'Célibataire',
      occupationMere: 'Infirmière', occupationPere: 'Fonctionnaire', niveauEtude: 'Supérieur', typeDiplome: 'Bac+4',
      filiereDiplome: 'Informatique', experienceGenerale: 'Entre 1 et 3 ans',
      langues: [{ name: 'Arabe', level: 'Natif' }, { name: 'Français', level: 'Courant' }, { name: 'Anglais', level: 'Courant' }],
      milieu: 'Urbain', sourceInscription: 'ANAPEC', objectif: 'Employabilité', formationChoisie: 'Développement Web',
      orientation: 'Interne', destination: 'Entreprise partenaire', dateOrientation: '2024-01-25', observations: 'Excellentes compétences.',
    },
    {
      nom: 'TAZI', prenom: 'Amine', cin: 'MN890123', dateNaissance: '1996-12-08', lieuNaissance: 'Meknès',
      genre: 'Homme', adresse: '22 Avenue des FAR', arrondissement: 'Océan', telephone: '0656789012',
      email: 'amine.tazi@email.com', typeCandidat: 'Jeune diplômé en chômage', situationMatrimoniale: 'Marié(e)',
      occupationMere: 'Commerçante', occupationPere: 'Mécanicien', niveauEtude: 'Supérieur', typeDiplome: 'Bac+3',
      filiereDiplome: 'Économie', experienceGenerale: "Moins d'un an",
      langues: [{ name: 'Arabe', level: 'Natif' }, { name: 'Français', level: 'Avancé' }],
      milieu: 'Urbain', sourceInscription: 'Bouche à oreille', objectif: 'ESS', formationChoisie: 'Gestion de projet',
      orientation: 'Externe', destination: 'Coopérative', dateOrientation: '2024-03-05', observations: 'Intéressé par l\'ESS.',
    },
    {
      nom: 'LAHLOU', prenom: 'Nadia', cin: 'OP456789', dateNaissance: '1998-09-30', lieuNaissance: 'Agadir',
      genre: 'Femme', adresse: '12 Rue Oqba Ibn Nafia', arrondissement: 'Takaddoum', telephone: '0667890123',
      email: 'nadia.lahlou@email.com', typeCandidat: 'NEET', situationMatrimoniale: 'Divorcé(e)',
      occupationMere: 'Femme au foyer', occupationPere: 'Pêcheur', niveauEtude: 'Primaire', typeDiplome: 'Sans',
      filiereDiplome: 'Non applicable', experienceGenerale: "Pas d'expérience",
      langues: [{ name: 'Arabe', level: 'Natif' }, { name: 'Amazigh', level: 'Natif' }],
      milieu: 'Rural', sourceInscription: 'Entraide Nationale', objectif: 'Formation', formationChoisie: 'Artisanat',
      orientation: 'Interne', destination: 'Centre de formation', dateOrientation: '2024-02-20', observations: 'Situation difficile.',
    },
    {
      nom: 'FILALI', prenom: 'Rachid', cin: 'QR012345', dateNaissance: '1994-06-14', lieuNaissance: 'Oujda',
      genre: 'Homme', adresse: '45 Boulevard Mohammed VI', arrondissement: 'Hay El Fath', telephone: '0678901234',
      email: 'rachid.filali@email.com', typeCandidat: 'Jeune diplômé actif', situationMatrimoniale: 'Marié(e)',
      occupationMere: 'Enseignante', occupationPere: 'Médecin', niveauEtude: 'Supérieur', typeDiplome: 'Supérieur à Bac+5',
      filiereDiplome: 'Ingénierie', experienceGenerale: 'Plus de 5 ans',
      langues: [{ name: 'Arabe', level: 'Natif' }, { name: 'Français', level: 'Courant' }, { name: 'Anglais', level: 'Courant' }, { name: 'Allemand', level: 'Intermédiaire' }],
      milieu: 'Urbain', sourceInscription: 'Événement', objectif: 'Entrepreneuriat', formationChoisie: 'Gestion de projet',
      orientation: 'Interne', destination: 'Incubateur', dateOrientation: '2024-01-30', observations: 'Profil senior.',
    },
    {
      nom: 'MOUSSAOUI', prenom: 'Zineb', cin: 'ST678901', dateNaissance: '2002-02-28', lieuNaissance: 'Kénitra',
      genre: 'Femme', adresse: '3 Rue Abdelkrim Khattabi', arrondissement: 'Yacoub El Mansour', telephone: '0689012345',
      email: 'zineb.moussaoui@email.com', typeCandidat: 'Jeune diplômé en chômage', situationMatrimoniale: 'Célibataire',
      occupationMere: 'Couturière', occupationPere: 'Agriculteur', niveauEtude: 'Supérieur', typeDiplome: 'Bac+2',
      filiereDiplome: 'Lettres', experienceGenerale: "Pas d'expérience",
      langues: [{ name: 'Arabe', level: 'Natif' }, { name: 'Français', level: 'Avancé' }],
      milieu: 'Périurbain', sourceInscription: 'Réseaux sociaux', objectif: 'Formation', formationChoisie: 'Marketing Digital',
      orientation: 'Externe', destination: 'Entreprise partenaire', dateOrientation: '2024-03-15', observations: 'Créative.',
    },
    {
      nom: 'ALAOUI', prenom: 'Hassan', cin: 'UV234567', dateNaissance: '1997-01-12', lieuNaissance: 'Tétouan',
      genre: 'Homme', adresse: '18 Avenue Moulay Ismail', arrondissement: 'Agdal Riad', telephone: '0690123456',
      email: 'hassan.alaoui@email.com', typeCandidat: 'NEET', situationMatrimoniale: 'Célibataire',
      occupationMere: 'Sans emploi', occupationPere: 'Sans emploi', niveauEtude: 'Secondaire qualifiant', typeDiplome: 'Niveau Bac',
      filiereDiplome: 'Non applicable', experienceGenerale: "Moins d'un an",
      langues: [{ name: 'Arabe', level: 'Natif' }, { name: 'Espagnol', level: 'Intermédiaire' }],
      milieu: 'Urbain', sourceInscription: 'Partenaire', objectif: 'Employabilité', formationChoisie: 'Commerce',
      orientation: 'Interne', destination: 'Centre de formation', dateOrientation: '2024-02-10', observations: 'Motivé.',
    },
    {
      nom: 'BENJELLOUN', prenom: 'Imane', cin: 'WX890123', dateNaissance: '1999-10-20', lieuNaissance: 'Rabat',
      genre: 'Femme', adresse: '7 Rue de Tunis', arrondissement: 'Hassan', telephone: '0601234567',
      email: 'imane.benjelloun@email.com', typeCandidat: 'Jeune diplômé actif', situationMatrimoniale: 'Célibataire',
      occupationMere: 'Pharmacienne', occupationPere: 'Avocat', niveauEtude: 'Supérieur', typeDiplome: 'Bac+5',
      filiereDiplome: 'Droit', experienceGenerale: 'Entre 1 et 3 ans',
      langues: [{ name: 'Arabe', level: 'Natif' }, { name: 'Français', level: 'Courant' }, { name: 'Anglais', level: 'Avancé' }],
      milieu: 'Urbain', sourceInscription: 'Site web', objectif: 'Entrepreneuriat', formationChoisie: 'Gestion de projet',
      orientation: 'Interne', destination: 'Incubateur', dateOrientation: '2024-01-18', observations: 'Projet juridique.',
    },
    {
      nom: 'KADIRI', prenom: 'Yassine', cin: 'YZ456789', dateNaissance: '1996-08-05', lieuNaissance: 'Salé',
      genre: 'Homme', adresse: '28 Rue Palestine', arrondissement: 'Océan', telephone: '0612345670',
      email: 'yassine.kadiri@email.com', typeCandidat: 'Jeune diplômé en chômage', situationMatrimoniale: 'Célibataire',
      occupationMere: 'Femme au foyer', occupationPere: 'Menuisier', niveauEtude: 'Supérieur', typeDiplome: 'Bac+3',
      filiereDiplome: 'Informatique', experienceGenerale: "Moins d'un an",
      langues: [{ name: 'Arabe', level: 'Natif' }, { name: 'Français', level: 'Courant' }],
      milieu: 'Urbain', sourceInscription: 'ANAPEC', objectif: 'Employabilité', formationChoisie: 'Développement Web',
      orientation: 'Externe', destination: 'Entreprise partenaire', dateOrientation: '2024-03-01', observations: 'Passionné par le code.',
    },
    {
      nom: 'SEFRIOUI', prenom: 'Asmae', cin: 'AB012345', dateNaissance: '2000-05-17', lieuNaissance: 'Fès',
      genre: 'Femme', adresse: '14 Boulevard Lalla Yacout', arrondissement: 'Souissi', telephone: '0623456780',
      email: 'asmae.sefrioui@email.com', typeCandidat: 'NEET', situationMatrimoniale: 'Célibataire',
      occupationMere: 'Artisane', occupationPere: 'Retraité', niveauEtude: 'Secondaire collégial', typeDiplome: 'Brevet',
      filiereDiplome: 'Non applicable', experienceGenerale: "Pas d'expérience",
      langues: [{ name: 'Arabe', level: 'Natif' }],
      milieu: 'Rural', sourceInscription: 'Entraide Nationale', objectif: 'Formation', formationChoisie: 'Artisanat',
      orientation: 'Interne', destination: 'Centre de formation', dateOrientation: '2024-02-25', observations: 'Talent artistique.',
    },
    {
      nom: 'OUAZZANI', prenom: 'Karim', cin: 'CD567890', dateNaissance: '1995-11-22', lieuNaissance: 'Casablanca',
      genre: 'Homme', adresse: '35 Avenue Anfa', arrondissement: 'Hay Riad', telephone: '0634567891',
      email: 'karim.ouazzani@email.com', typeCandidat: 'Jeune diplômé actif', situationMatrimoniale: 'Marié(e)',
      occupationMere: 'Directrice', occupationPere: 'Entrepreneur', niveauEtude: 'Supérieur', typeDiplome: 'Bac+5',
      filiereDiplome: 'Gestion', experienceGenerale: 'Entre 3 et 5 ans',
      langues: [{ name: 'Arabe', level: 'Natif' }, { name: 'Français', level: 'Courant' }, { name: 'Anglais', level: 'Courant' }],
      milieu: 'Urbain', sourceInscription: 'Événement', objectif: 'Entrepreneuriat', formationChoisie: 'Gestion de projet',
      orientation: 'Interne', destination: 'Incubateur', dateOrientation: '2024-01-22', observations: 'Expérience startup.',
    },
    {
      nom: 'CHAMI', prenom: 'Leila', cin: 'EF123456', dateNaissance: '1998-03-08', lieuNaissance: 'Rabat',
      genre: 'Femme', adresse: '20 Rue Souissi', arrondissement: 'Souissi', telephone: '0645678902',
      email: 'leila.chami@email.com', typeCandidat: 'Jeune diplômé en chômage', situationMatrimoniale: 'Célibataire',
      occupationMere: 'Enseignante', occupationPere: 'Ingénieur', niveauEtude: 'Supérieur', typeDiplome: 'Bac+4',
      filiereDiplome: 'Sciences', experienceGenerale: "Moins d'un an",
      langues: [{ name: 'Arabe', level: 'Natif' }, { name: 'Français', level: 'Courant' }, { name: 'Anglais', level: 'Avancé' }],
      milieu: 'Urbain', sourceInscription: 'Site web', objectif: 'Formation', formationChoisie: 'Design Graphique',
      orientation: 'Externe', destination: 'Entreprise partenaire', dateOrientation: '2024-03-08', observations: 'Créative et organisée.',
    },
    {
      nom: 'RHAZI', prenom: 'Ayoub', cin: 'GH789012', dateNaissance: '1997-09-14', lieuNaissance: 'Marrakech',
      genre: 'Homme', adresse: '9 Rue Gueliz', arrondissement: 'Akkari', telephone: '0656789013',
      email: 'ayoub.rhazi@email.com', typeCandidat: 'NEET', situationMatrimoniale: 'Célibataire',
      occupationMere: 'Femme au foyer', occupationPere: 'Chauffeur taxi', niveauEtude: 'Secondaire qualifiant', typeDiplome: 'Bac',
      filiereDiplome: 'Commerce', experienceGenerale: "Moins d'un an",
      langues: [{ name: 'Arabe', level: 'Natif' }, { name: 'Français', level: 'Intermédiaire' }],
      milieu: 'Périurbain', sourceInscription: 'Bouche à oreille', objectif: 'Employabilité', formationChoisie: 'Commerce',
      orientation: 'Interne', destination: 'Centre de formation', dateOrientation: '2024-02-28', observations: 'Dynamique.',
    },
    {
      nom: 'AMRANI', prenom: 'Sanae', cin: 'IJ345678', dateNaissance: '2001-07-03', lieuNaissance: 'Tanger',
      genre: 'Femme', adresse: '16 Avenue Mohammed V', arrondissement: 'Takaddoum', telephone: '0667890124',
      email: 'sanae.amrani@email.com', typeCandidat: 'Jeune diplômé en chômage', situationMatrimoniale: 'Célibataire',
      occupationMere: 'Commerçante', occupationPere: 'Marin', niveauEtude: 'Supérieur', typeDiplome: 'Bac+2',
      filiereDiplome: 'Tourisme', experienceGenerale: "Pas d'expérience",
      langues: [{ name: 'Arabe', level: 'Natif' }, { name: 'Français', level: 'Avancé' }, { name: 'Espagnol', level: 'Avancé' }],
      milieu: 'Urbain', sourceInscription: 'Réseaux sociaux', objectif: 'Employabilité', formationChoisie: 'Tourisme',
      orientation: 'Externe', destination: 'Entreprise partenaire', dateOrientation: '2024-03-12', observations: 'Polyglotte.',
    },
    {
      nom: 'HADDAD', prenom: 'Mohammed', cin: 'KL901234', dateNaissance: '1994-04-28', lieuNaissance: 'Agadir',
      genre: 'Homme', adresse: '40 Rue Talborjt', arrondissement: 'Hay El Fath', telephone: '0678901235',
      email: 'mohammed.haddad@email.com', typeCandidat: 'Jeune diplômé actif', situationMatrimoniale: 'Marié(e)',
      occupationMere: 'Femme au foyer', occupationPere: 'Pêcheur', niveauEtude: 'Supérieur', typeDiplome: 'Bac+3',
      filiereDiplome: 'Agriculture', experienceGenerale: 'Entre 3 et 5 ans',
      langues: [{ name: 'Arabe', level: 'Natif' }, { name: 'Français', level: 'Courant' }, { name: 'Amazigh', level: 'Natif' }],
      milieu: 'Rural', sourceInscription: 'Partenaire', objectif: 'ESS', formationChoisie: 'Agriculture',
      orientation: 'Interne', destination: 'Coopérative', dateOrientation: '2024-01-28', observations: 'Projet coopérative.',
    },
    {
      nom: 'MANSOURI', prenom: 'Hajar', cin: 'MN567890', dateNaissance: '1999-12-10', lieuNaissance: 'Oujda',
      genre: 'Femme', adresse: '6 Rue Berkane', arrondissement: 'Yacoub El Mansour', telephone: '0689012346',
      email: 'hajar.mansouri@email.com', typeCandidat: 'NEET', situationMatrimoniale: 'Célibataire',
      occupationMere: 'Sans emploi', occupationPere: 'Ouvrier', niveauEtude: 'Primaire', typeDiplome: 'Sans',
      filiereDiplome: 'Non applicable', experienceGenerale: "Pas d'expérience",
      langues: [{ name: 'Arabe', level: 'Natif' }],
      milieu: 'Rural', sourceInscription: 'Entraide Nationale', objectif: 'Formation', formationChoisie: 'Artisanat',
      orientation: 'Interne', destination: 'Centre de formation', dateOrientation: '2024-02-18', observations: 'Besoin d\'aide.',
    },
    {
      nom: 'ZEROUAL', prenom: 'Othmane', cin: 'OP123456', dateNaissance: '1996-06-25', lieuNaissance: 'Kénitra',
      genre: 'Homme', adresse: '25 Avenue Hassan II', arrondissement: 'Agdal Riad', telephone: '0690123457',
      email: 'othmane.zeroual@email.com', typeCandidat: 'Jeune diplômé en chômage', situationMatrimoniale: 'Célibataire',
      occupationMere: 'Secrétaire', occupationPere: 'Comptable', niveauEtude: 'Supérieur', typeDiplome: 'Bac+5',
      filiereDiplome: 'Informatique', experienceGenerale: 'Entre 1 et 3 ans',
      langues: [{ name: 'Arabe', level: 'Natif' }, { name: 'Français', level: 'Courant' }, { name: 'Anglais', level: 'Courant' }],
      milieu: 'Urbain', sourceInscription: 'ANAPEC', objectif: 'Entrepreneuriat', formationChoisie: 'Développement Web',
      orientation: 'Interne', destination: 'Incubateur', dateOrientation: '2024-01-12', observations: 'Projet tech startup.',
    },
    {
      nom: 'NACIRI', prenom: 'Salma', cin: 'QR789012', dateNaissance: '2000-02-14', lieuNaissance: 'Rabat',
      genre: 'Femme', adresse: '11 Rue Agdal', arrondissement: 'Agdal Riad', telephone: '0601234568',
      email: 'salma.naciri@email.com', typeCandidat: 'Jeune diplômé actif', situationMatrimoniale: 'Célibataire',
      occupationMere: 'Médecin', occupationPere: 'Professeur', niveauEtude: 'Supérieur', typeDiplome: 'Bac+4',
      filiereDiplome: 'Médecine', experienceGenerale: 'Entre 1 et 3 ans',
      langues: [{ name: 'Arabe', level: 'Natif' }, { name: 'Français', level: 'Courant' }, { name: 'Anglais', level: 'Avancé' }],
      milieu: 'Urbain', sourceInscription: 'Site web', objectif: 'Employabilité', formationChoisie: 'Gestion de projet',
      orientation: 'Externe', destination: 'Entreprise partenaire', dateOrientation: '2024-03-05', observations: 'Excellente candidate.',
    },
    {
      nom: 'BOUAZZA', prenom: 'Hamza', cin: 'ST345678', dateNaissance: '1997-08-30', lieuNaissance: 'Meknès',
      genre: 'Homme', adresse: '33 Rue Zitoune', arrondissement: 'Hassan', telephone: '0612345671',
      email: 'hamza.bouazza@email.com', typeCandidat: 'NEET', situationMatrimoniale: 'Célibataire',
      occupationMere: 'Femme au foyer', occupationPere: 'Artisan', niveauEtude: 'Secondaire collégial', typeDiplome: 'Brevet',
      filiereDiplome: 'Non applicable', experienceGenerale: "Moins d'un an",
      langues: [{ name: 'Arabe', level: 'Natif' }],
      milieu: 'Périurbain', sourceInscription: 'Bouche à oreille', objectif: 'Formation', formationChoisie: 'Artisanat',
      orientation: 'Interne', destination: 'Centre de formation', dateOrientation: '2024-02-22', observations: 'Intéressé par l\'artisanat.',
    },
    {
      nom: 'SEBTI', prenom: 'Meryem', cin: 'UV901234', dateNaissance: '1998-11-18', lieuNaissance: 'Casablanca',
      genre: 'Femme', adresse: '19 Boulevard Zerktouni', arrondissement: 'Hay Riad', telephone: '0623456781',
      email: 'meryem.sebti@email.com', typeCandidat: 'Jeune diplômé en chômage', situationMatrimoniale: 'Célibataire',
      occupationMere: 'Enseignante', occupationPere: 'Banquier', niveauEtude: 'Supérieur', typeDiplome: 'Bac+3',
      filiereDiplome: 'Commerce', experienceGenerale: "Moins d'un an",
      langues: [{ name: 'Arabe', level: 'Natif' }, { name: 'Français', level: 'Courant' }, { name: 'Anglais', level: 'Intermédiaire' }],
      milieu: 'Urbain', sourceInscription: 'Réseaux sociaux', objectif: 'Employabilité', formationChoisie: 'Marketing Digital',
      orientation: 'Externe', destination: 'Entreprise partenaire', dateOrientation: '2024-03-18', observations: 'Bonne communicante.',
    },
    {
      nom: 'FASSI', prenom: 'Adil', cin: 'WX567890', dateNaissance: '1995-05-07', lieuNaissance: 'Fès',
      genre: 'Homme', adresse: '27 Rue des Mérinides', arrondissement: 'Youssoufia', telephone: '0634567892',
      email: 'adil.fassi@email.com', typeCandidat: 'Jeune diplômé actif', situationMatrimoniale: 'Marié(e)',
      occupationMere: 'Artisane', occupationPere: 'Commerçant', niveauEtude: 'Supérieur', typeDiplome: 'Bac+5',
      filiereDiplome: 'Art', experienceGenerale: 'Entre 3 et 5 ans',
      langues: [{ name: 'Arabe', level: 'Natif' }, { name: 'Français', level: 'Courant' }],
      milieu: 'Urbain', sourceInscription: 'Partenaire', objectif: 'Entrepreneuriat', formationChoisie: 'Design Graphique',
      orientation: 'Interne', destination: 'Incubateur', dateOrientation: '2024-01-08', observations: 'Designer talentueux.',
    },
    {
      nom: 'LAMRANI', prenom: 'Wiam', cin: 'YZ123456', dateNaissance: '2001-09-23', lieuNaissance: 'Rabat',
      genre: 'Femme', adresse: '4 Rue Temara', arrondissement: 'Akkari', telephone: '0645678903',
      email: 'wiam.lamrani@email.com', typeCandidat: 'Jeune diplômé en chômage', situationMatrimoniale: 'Célibataire',
      occupationMere: 'Infirmière', occupationPere: 'Policier', niveauEtude: 'Supérieur', typeDiplome: 'Bac+2',
      filiereDiplome: 'Informatique', experienceGenerale: "Pas d'expérience",
      langues: [{ name: 'Arabe', level: 'Natif' }, { name: 'Français', level: 'Avancé' }],
      milieu: 'Urbain', sourceInscription: 'ANAPEC', objectif: 'Formation', formationChoisie: 'Développement Web',
      orientation: 'Interne', destination: 'Centre de formation', dateOrientation: '2024-02-05', observations: 'Motivée à apprendre.',
    },
    {
      nom: 'KETTANI', prenom: 'Soufiane', cin: 'AB789012', dateNaissance: '1996-03-15', lieuNaissance: 'Tanger',
      genre: 'Homme', adresse: '38 Avenue Espagne', arrondissement: 'Océan', telephone: '0656789014',
      email: 'soufiane.kettani@email.com', typeCandidat: 'NEET', situationMatrimoniale: 'Célibataire',
      occupationMere: 'Sans emploi', occupationPere: 'Marin', niveauEtude: 'Secondaire qualifiant', typeDiplome: 'Niveau Bac',
      filiereDiplome: 'Non applicable', experienceGenerale: "Moins d'un an",
      langues: [{ name: 'Arabe', level: 'Natif' }, { name: 'Espagnol', level: 'Courant' }],
      milieu: 'Urbain', sourceInscription: 'Entraide Nationale', objectif: 'Employabilité', formationChoisie: 'Tourisme',
      orientation: 'Externe', destination: 'Entreprise partenaire', dateOrientation: '2024-03-20', observations: 'Bilingue espagnol.',
    },
    {
      nom: 'BOUZIDI', prenom: 'Ghita', cin: 'CD234567', dateNaissance: '1999-07-11', lieuNaissance: 'Salé',
      genre: 'Femme', adresse: '21 Rue Bab Fès', arrondissement: 'Takaddoum', telephone: '0667890125',
      email: 'ghita.bouzidi@email.com', typeCandidat: 'Jeune diplômé actif', situationMatrimoniale: 'Célibataire',
      occupationMere: 'Couturière', occupationPere: 'Électricien', niveauEtude: 'Supérieur', typeDiplome: 'Bac+3',
      filiereDiplome: 'Économie', experienceGenerale: 'Entre 1 et 3 ans',
      langues: [{ name: 'Arabe', level: 'Natif' }, { name: 'Français', level: 'Courant' }],
      milieu: 'Périurbain', sourceInscription: 'Site web', objectif: 'ESS', formationChoisie: 'Comptabilité',
      orientation: 'Interne', destination: 'Coopérative', dateOrientation: '2024-01-25', observations: 'Projet social.',
    },
  ];
  
  demoData.forEach(data => addCandidate(data));
};
