export interface Candidat {
  id: string;
  numero: number;
  date: string;
  cin: string;
  nom: string;
  prenom: string;
  date_nessance: string;
  objectif: string;
  formation: string;
  observation: string;
  adress: string;
  arrondissement: string;
  telephone: string;
  email: string;
  source: string;
  genre: string;
  oriente_vers: string;
  destination: string;
}

export type CandidatFormData = Omit<Candidat, 'id' | 'numero'>;

export const arrondissements = [
  'sidi bernoussi',
  'sidi moumen',
];

export const sources = [
  'réseaux sociaux',
  'site web',
  'bouche à oreille',
  "centre d'accueil",
  'autre',
];
 export const genres = [
  'masculin',
  'féminin',
];
export const oriente_versOptions = [
  'intern',
  'extern',
];

export const OBJECTIVES = [
  'Entrepreneuriat',
  'ESS',
  'Formation',
  'Employabilité',
];

export const TRAININGS = [
  'Deutsch',
  'Français',
  'Anglais',
  'Full Stack',
  'Marketing',
  'Création de contenu',
  'UI/UX',
  'E-commerce',
];
