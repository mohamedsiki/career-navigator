export interface Language {
  name: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Courant' | 'Natif';
}

export interface Candidate {
  id: string;
  // Identité
  nom: string;
  prenom: string;
  cin: string;
  dateNaissance: string;
  lieuNaissance: string;
  genre: 'Homme' | 'Femme';
  adresse: string;
  arrondissement: string;
  telephone: string;
  email: string;
  
  // Type de candidat
  typeCandidat: 'Jeune diplômé actif' | 'Jeune diplômé en chômage' | 'NEET';
  
  // Situation familiale
  situationMatrimoniale: 'Célibataire' | 'Marié(e)' | 'Divorcé(e)' | 'Veuf(ve)';
  occupationMere: string;
  occupationPere: string;
  
  // Formation
  niveauEtude: 'Sans' | 'Primaire' | 'Secondaire collégial' | 'Secondaire qualifiant' | 'Supérieur';
  typeDiplome: 'Sans' | 'Niveau Bac' | 'Bac' | 'Bac+2' | 'Bac+3' | 'Bac+4' | 'Bac+5' | 'Supérieur à Bac+5' | 'Brevet';
  filiereDiplome: string;
  
  // Expérience
  experienceGenerale: "Pas d'expérience" | "Moins d'un an" | 'Entre 1 et 3 ans' | 'Entre 3 et 5 ans' | 'Plus de 5 ans';
  
  // Langues
  langues: Language[];
  
  // Autres informations
  milieu: 'Urbain' | 'Rural' | 'Périurbain';
  sourceInscription: string;
  objectif: 'Entrepreneuriat' | 'ESS' | 'Formation' | 'Employabilité';
  formationChoisie: string;
  orientation: 'Interne' | 'Externe';
  destination: string;
  dateOrientation: string;
  observations: string;
  
  // Métadonnées
  dateCreation: string;
  dateModification: string;
}

export type CandidateFormData = Omit<Candidate, 'id' | 'dateCreation' | 'dateModification'>;

export const ARRONDISSEMENTS = [
  'Agdal Riad', 'Hay Riad', 'Hassan', 'Souissi', 'Yacoub El Mansour',
  'Akkari', 'Océan', 'Youssoufia', 'Takaddoum', 'Hay El Fath', 'Autre'
];

export const SOURCES_INSCRIPTION = [
  'ANAPEC', 'Entraide Nationale', 'Réseaux sociaux', 'Bouche à oreille',
  'Site web', 'Partenaire', 'Événement', 'Autre'
];

export const FORMATIONS = [
  'Développement Web', 'Marketing Digital', 'Comptabilité',
  'Gestion de projet', 'Design Graphique', 'Commerce',
  'Artisanat', 'Agriculture', 'Tourisme', 'Autre'
];

export const DESTINATIONS = [
  'Centre de formation', 'Entreprise partenaire', 'Coopérative',
  'Incubateur', 'Association', 'Autre'
];

export const FILIERES = [
  'Informatique', 'Gestion', 'Commerce', 'Droit', 'Économie',
  'Lettres', 'Sciences', 'Ingénierie', 'Médecine', 'Art',
  'Agriculture', 'Tourisme', 'Autre', 'Non applicable'
];

export const LANGUES_DISPONIBLES = [
  'Arabe', 'Français', 'Anglais', 'Espagnol', 'Allemand', 'Amazigh', 'Autre'
];
