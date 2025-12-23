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

// Seed data for demo
export const seedDatabase = () => {
  const existing = getAllCandidates();
  if (existing.length > 0) return;
  
  const demoData: CandidateFormData[] = [
    {
      nom: 'BENALI',
      prenom: 'Youssef',
      cin: 'AB123456',
      dateNaissance: '1998-05-15',
      lieuNaissance: 'Rabat',
      genre: 'Homme',
      adresse: '25 Rue Mohamed V',
      arrondissement: 'Agdal Riad',
      telephone: '0612345678',
      email: 'youssef.benali@email.com',
      typeCandidat: 'Jeune diplômé en chômage',
      situationMatrimoniale: 'Célibataire',
      occupationMere: 'Enseignante',
      occupationPere: 'Commerçant',
      niveauEtude: 'Supérieur',
      typeDiplome: 'Bac+3',
      filiereDiplome: 'Informatique',
      experienceGenerale: "Moins d'un an",
      langues: [
        { name: 'Arabe', level: 'Natif' },
        { name: 'Français', level: 'Courant' },
        { name: 'Anglais', level: 'Intermédiaire' },
      ],
      milieu: 'Urbain',
      sourceInscription: 'ANAPEC',
      objectif: 'Employabilité',
      formationChoisie: 'Développement Web',
      orientation: 'Interne',
      destination: 'Centre de formation',
      dateOrientation: '2024-01-15',
      observations: 'Candidat motivé avec de bonnes compétences techniques.',
    },
    {
      nom: 'CHAKIR',
      prenom: 'Fatima',
      cin: 'CD789012',
      dateNaissance: '2000-08-22',
      lieuNaissance: 'Casablanca',
      genre: 'Femme',
      adresse: '10 Avenue Hassan II',
      arrondissement: 'Hassan',
      telephone: '0698765432',
      email: 'fatima.chakir@email.com',
      typeCandidat: 'NEET',
      situationMatrimoniale: 'Célibataire',
      occupationMere: 'Femme au foyer',
      occupationPere: 'Retraité',
      niveauEtude: 'Secondaire qualifiant',
      typeDiplome: 'Bac',
      filiereDiplome: 'Commerce',
      experienceGenerale: "Pas d'expérience",
      langues: [
        { name: 'Arabe', level: 'Natif' },
        { name: 'Français', level: 'Avancé' },
      ],
      milieu: 'Urbain',
      sourceInscription: 'Réseaux sociaux',
      objectif: 'Formation',
      formationChoisie: 'Marketing Digital',
      orientation: 'Externe',
      destination: 'Entreprise partenaire',
      dateOrientation: '2024-02-01',
      observations: 'Intéressée par le marketing digital.',
    },
    {
      nom: 'EL AMRANI',
      prenom: 'Omar',
      cin: 'EF345678',
      dateNaissance: '1995-03-10',
      lieuNaissance: 'Fès',
      genre: 'Homme',
      adresse: '5 Rue Ibn Khaldoun',
      arrondissement: 'Youssoufia',
      telephone: '0654321098',
      email: 'omar.elamrani@email.com',
      typeCandidat: 'Jeune diplômé actif',
      situationMatrimoniale: 'Marié(e)',
      occupationMere: 'Artisane',
      occupationPere: 'Agriculteur',
      niveauEtude: 'Supérieur',
      typeDiplome: 'Bac+5',
      filiereDiplome: 'Gestion',
      experienceGenerale: 'Entre 3 et 5 ans',
      langues: [
        { name: 'Arabe', level: 'Natif' },
        { name: 'Français', level: 'Courant' },
        { name: 'Anglais', level: 'Avancé' },
        { name: 'Espagnol', level: 'Débutant' },
      ],
      milieu: 'Périurbain',
      sourceInscription: 'Partenaire',
      objectif: 'Entrepreneuriat',
      formationChoisie: 'Gestion de projet',
      orientation: 'Interne',
      destination: 'Incubateur',
      dateOrientation: '2024-01-20',
      observations: 'Projet de création d\'entreprise dans le secteur agricole.',
    },
  ];
  
  demoData.forEach(data => addCandidate(data));
};
