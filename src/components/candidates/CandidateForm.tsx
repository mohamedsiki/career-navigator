import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, X, Save, RotateCcw, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { 
  CandidateFormData, 
  Language,
  CustomField,
  ARRONDISSEMENTS, 
  SOURCES_INSCRIPTION, 
  FORMATIONS, 
  DESTINATIONS, 
  FILIERES,
  LANGUES_DISPONIBLES 
} from '@/types/candidate';

// Schema pour nouveau candidat (tous les champs d'identité requis)
const newCandidateSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  prenom: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  cin: z.string().min(6, 'Le CIN doit contenir au moins 6 caractères'),
  dateNaissance: z.string().min(1, 'La date de naissance est requise'),
  lieuNaissance: z.string().min(2, 'Le lieu de naissance est requis'),
  genre: z.enum(['Homme', 'Femme']),
  adresse: z.string().min(5, 'L\'adresse doit contenir au moins 5 caractères'),
  arrondissement: z.string().min(1, 'L\'arrondissement est requis'),
  telephone: z.string().min(10, 'Le téléphone doit contenir au moins 10 chiffres'),
  email: z.string().email('Email invalide'),
  typeCandidat: z.enum(['Jeune diplômé actif', 'Jeune diplômé en chômage', 'NEET']),
  situationMatrimoniale: z.enum(['Célibataire', 'Marié(e)', 'Divorcé(e)', 'Veuf(ve)']),
  occupationMere: z.string().min(1, 'L\'occupation de la mère est requise'),
  occupationPere: z.string().min(1, 'L\'occupation du père est requise'),
  niveauEtude: z.enum(['Sans', 'Primaire', 'Secondaire collégial', 'Secondaire qualifiant', 'Supérieur']),
  typeDiplome: z.enum(['Sans', 'Niveau Bac', 'Bac', 'Bac+2', 'Bac+3', 'Bac+4', 'Bac+5', 'Supérieur à Bac+5', 'Brevet']),
  filiereDiplome: z.string().min(1, 'La filière est requise'),
  experienceGenerale: z.enum(["Pas d'expérience", "Moins d'un an", 'Entre 1 et 3 ans', 'Entre 3 et 5 ans', 'Plus de 5 ans']),
  milieu: z.enum(['Urbain', 'Rural', 'Périurbain']),
  sourceInscription: z.string().min(1, 'La source d\'inscription est requise'),
  objectif: z.enum(['Entrepreneuriat', 'ESS', 'Formation', 'Employabilité']),
  formationChoisie: z.string().min(1, 'La formation est requise'),
  orientation: z.enum(['Interne', 'Externe']),
  destination: z.string().min(1, 'La destination est requise'),
  dateOrientation: z.string().optional(),
  observations: z.string().optional(),
});

// Schema pour modification (champs d'identité optionnels car en lecture seule)
const editCandidateSchema = z.object({
  nom: z.string().optional(),
  prenom: z.string().optional(),
  cin: z.string().optional(),
  dateNaissance: z.string().optional(),
  lieuNaissance: z.string().optional(),
  genre: z.enum(['Homme', 'Femme']).optional(),
  adresse: z.string().optional(),
  arrondissement: z.string().optional(),
  telephone: z.string().optional(),
  email: z.string().optional(),
  typeCandidat: z.enum(['Jeune diplômé actif', 'Jeune diplômé en chômage', 'NEET']),
  situationMatrimoniale: z.enum(['Célibataire', 'Marié(e)', 'Divorcé(e)', 'Veuf(ve)']),
  occupationMere: z.string().min(1, 'L\'occupation de la mère est requise'),
  occupationPere: z.string().min(1, 'L\'occupation du père est requise'),
  niveauEtude: z.enum(['Sans', 'Primaire', 'Secondaire collégial', 'Secondaire qualifiant', 'Supérieur']),
  typeDiplome: z.enum(['Sans', 'Niveau Bac', 'Bac', 'Bac+2', 'Bac+3', 'Bac+4', 'Bac+5', 'Supérieur à Bac+5', 'Brevet']),
  filiereDiplome: z.string().min(1, 'La filière est requise'),
  experienceGenerale: z.enum(["Pas d'expérience", "Moins d'un an", 'Entre 1 et 3 ans', 'Entre 3 et 5 ans', 'Plus de 5 ans']),
  milieu: z.enum(['Urbain', 'Rural', 'Périurbain']),
  sourceInscription: z.string().min(1, 'La source d\'inscription est requise'),
  objectif: z.enum(['Entrepreneuriat', 'ESS', 'Formation', 'Employabilité']),
  formationChoisie: z.string().min(1, 'La formation est requise'),
  orientation: z.enum(['Interne', 'Externe']),
  destination: z.string().min(1, 'La destination est requise'),
  dateOrientation: z.string().optional(),
  observations: z.string().optional(),
});

type FormValues = z.infer<typeof newCandidateSchema>;

interface CandidateFormProps {
  initialData?: CandidateFormData;
  onSubmit: (data: CandidateFormData) => void;
  onCancel?: () => void;
}

const FormSection = ({ title, children, locked = false }: { title: string; children: React.ReactNode; locked?: boolean }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-primary border-b border-border pb-2 flex items-center gap-2">
      {title}
      {locked && (
        <Badge variant="outline" className="text-xs bg-muted">
          <Lock className="w-3 h-3 mr-1" />
          Lecture seule
        </Badge>
      )}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {children}
    </div>
  </div>
);

export function CandidateForm({ initialData, onSubmit, onCancel }: CandidateFormProps) {
  const [langues, setLangues] = useState<Language[]>(initialData?.langues || []);
  const [newLangue, setNewLangue] = useState('');
  const [newLevel, setNewLevel] = useState<Language['level']>('Intermédiaire');
  const [customFields, setCustomFields] = useState<CustomField[]>(initialData?.customFields || []);
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');
  
  const isEditing = !!initialData;

  const form = useForm<FormValues>({
    resolver: zodResolver(isEditing ? editCandidateSchema : newCandidateSchema),
    defaultValues: {
      nom: initialData?.nom || '',
      prenom: initialData?.prenom || '',
      cin: initialData?.cin || '',
      dateNaissance: initialData?.dateNaissance || '',
      lieuNaissance: initialData?.lieuNaissance || '',
      genre: initialData?.genre || 'Homme',
      adresse: initialData?.adresse || '',
      arrondissement: initialData?.arrondissement || '',
      telephone: initialData?.telephone || '',
      email: initialData?.email || '',
      typeCandidat: initialData?.typeCandidat || 'Jeune diplômé en chômage',
      situationMatrimoniale: initialData?.situationMatrimoniale || 'Célibataire',
      occupationMere: initialData?.occupationMere || '',
      occupationPere: initialData?.occupationPere || '',
      niveauEtude: initialData?.niveauEtude || 'Supérieur',
      typeDiplome: initialData?.typeDiplome || 'Bac',
      filiereDiplome: initialData?.filiereDiplome || '',
      experienceGenerale: initialData?.experienceGenerale || "Pas d'expérience",
      milieu: initialData?.milieu || 'Urbain',
      sourceInscription: initialData?.sourceInscription || '',
      objectif: initialData?.objectif || 'Employabilité',
      formationChoisie: initialData?.formationChoisie || '',
      orientation: initialData?.orientation || 'Interne',
      destination: initialData?.destination || '',
      dateOrientation: initialData?.dateOrientation || '',
      observations: initialData?.observations || '',
    },
  });

  const addLangue = () => {
    if (newLangue && !langues.find(l => l.name === newLangue)) {
      setLangues([...langues, { name: newLangue, level: newLevel }]);
      setNewLangue('');
    }
  };

  const removeLangue = (name: string) => {
    setLangues(langues.filter(l => l.name !== name));
  };

  const addCustomField = () => {
    if (newFieldLabel.trim() && newFieldValue.trim()) {
      setCustomFields([...customFields, { label: newFieldLabel.trim(), value: newFieldValue.trim() }]);
      setNewFieldLabel('');
      setNewFieldValue('');
    }
  };

  const removeCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const updateCustomField = (index: number, field: 'label' | 'value', newValue: string) => {
    const updated = [...customFields];
    updated[index][field] = newValue;
    setCustomFields(updated);
  };

  const handleSubmit = (values: FormValues) => {
    const formData: CandidateFormData = {
      nom: isEditing ? initialData!.nom : values.nom,
      prenom: isEditing ? initialData!.prenom : values.prenom,
      cin: isEditing ? initialData!.cin : values.cin,
      dateNaissance: isEditing ? initialData!.dateNaissance : values.dateNaissance,
      lieuNaissance: isEditing ? initialData!.lieuNaissance : values.lieuNaissance,
      genre: isEditing ? initialData!.genre : values.genre,
      adresse: isEditing ? initialData!.adresse : values.adresse,
      arrondissement: isEditing ? initialData!.arrondissement : values.arrondissement,
      telephone: isEditing ? initialData!.telephone : values.telephone,
      email: isEditing ? initialData!.email : values.email,
      typeCandidat: values.typeCandidat,
      situationMatrimoniale: values.situationMatrimoniale,
      occupationMere: values.occupationMere,
      occupationPere: values.occupationPere,
      niveauEtude: values.niveauEtude,
      typeDiplome: values.typeDiplome,
      filiereDiplome: values.filiereDiplome,
      experienceGenerale: values.experienceGenerale,
      langues,
      milieu: values.milieu,
      sourceInscription: values.sourceInscription,
      objectif: values.objectif,
      formationChoisie: values.formationChoisie,
      orientation: values.orientation,
      destination: values.destination,
      dateOrientation: values.dateOrientation || '',
      observations: values.observations || '',
      customFields: customFields.length > 0 ? customFields : undefined,
    };
    onSubmit(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 animate-fade-in">
        {/* Identité - Lecture seule en mode édition */}
        <FormSection title="Identité" locked={isEditing}>
          <FormField
            control={form.control}
            name="nom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom *</FormLabel>
                <FormControl>
                  <Input placeholder="Nom de famille" {...field} disabled={isEditing} className={isEditing ? 'bg-muted' : ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="prenom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom *</FormLabel>
                <FormControl>
                  <Input placeholder="Prénom" {...field} disabled={isEditing} className={isEditing ? 'bg-muted' : ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CIN *</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: AB123456" {...field} disabled={isEditing} className={isEditing ? 'bg-muted' : ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dateNaissance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de naissance *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} disabled={isEditing} className={isEditing ? 'bg-muted' : ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lieuNaissance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lieu de naissance *</FormLabel>
                <FormControl>
                  <Input placeholder="Ville de naissance" {...field} disabled={isEditing} className={isEditing ? 'bg-muted' : ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="genre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Genre *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isEditing}>
                  <FormControl>
                    <SelectTrigger className={isEditing ? 'bg-muted' : ''}>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Homme">Homme</SelectItem>
                    <SelectItem value="Femme">Femme</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        {/* Coordonnées - Lecture seule en mode édition */}
        <FormSection title="Coordonnées" locked={isEditing}>
          <FormField
            control={form.control}
            name="adresse"
            render={({ field }) => (
              <FormItem className="col-span-full lg:col-span-2">
                <FormLabel>Adresse *</FormLabel>
                <FormControl>
                  <Input placeholder="Adresse complète" {...field} disabled={isEditing} className={isEditing ? 'bg-muted' : ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="arrondissement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Arrondissement *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isEditing}>
                  <FormControl>
                    <SelectTrigger className={isEditing ? 'bg-muted' : ''}>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ARRONDISSEMENTS.map(arr => (
                      <SelectItem key={arr} value={arr}>{arr}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="telephone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Téléphone *</FormLabel>
                <FormControl>
                  <Input placeholder="0612345678" {...field} disabled={isEditing} className={isEditing ? 'bg-muted' : ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="col-span-full lg:col-span-1">
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@exemple.com" {...field} disabled={isEditing} className={isEditing ? 'bg-muted' : ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sourceInscription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source d'inscription *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isEditing}>
                  <FormControl>
                    <SelectTrigger className={isEditing ? 'bg-muted' : ''}>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SOURCES_INSCRIPTION.map(source => (
                      <SelectItem key={source} value={source}>{source}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        {/* Situation - Modifiable */}
        <FormSection title="Situation">
          <FormField
            control={form.control}
            name="typeCandidat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de candidat *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Jeune diplômé actif">Jeune diplômé actif</SelectItem>
                    <SelectItem value="Jeune diplômé en chômage">Jeune diplômé en chômage</SelectItem>
                    <SelectItem value="NEET">NEET</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="situationMatrimoniale"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Situation matrimoniale *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Célibataire">Célibataire</SelectItem>
                    <SelectItem value="Marié(e)">Marié(e)</SelectItem>
                    <SelectItem value="Divorcé(e)">Divorcé(e)</SelectItem>
                    <SelectItem value="Veuf(ve)">Veuf(ve)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="milieu"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Milieu *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Urbain">Urbain</SelectItem>
                    <SelectItem value="Rural">Rural</SelectItem>
                    <SelectItem value="Périurbain">Périurbain</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="occupationMere"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Occupation de la mère *</FormLabel>
                <FormControl>
                  <Input placeholder="Profession de la mère" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="occupationPere"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Occupation du père *</FormLabel>
                <FormControl>
                  <Input placeholder="Profession du père" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        {/* Formation & Expérience - Modifiable */}
        <FormSection title="Formation & Expérience">
          <FormField
            control={form.control}
            name="niveauEtude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Niveau d'étude *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Sans">Sans</SelectItem>
                    <SelectItem value="Primaire">Primaire</SelectItem>
                    <SelectItem value="Secondaire collégial">Secondaire collégial</SelectItem>
                    <SelectItem value="Secondaire qualifiant">Secondaire qualifiant</SelectItem>
                    <SelectItem value="Supérieur">Supérieur</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="typeDiplome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de diplôme *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Sans">Sans</SelectItem>
                    <SelectItem value="Niveau Bac">Niveau Bac</SelectItem>
                    <SelectItem value="Bac">Bac</SelectItem>
                    <SelectItem value="Bac+2">Bac+2</SelectItem>
                    <SelectItem value="Bac+3">Bac+3</SelectItem>
                    <SelectItem value="Bac+4">Bac+4</SelectItem>
                    <SelectItem value="Bac+5">Bac+5</SelectItem>
                    <SelectItem value="Supérieur à Bac+5">Supérieur à Bac+5</SelectItem>
                    <SelectItem value="Brevet">Brevet</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="filiereDiplome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Filière du diplôme *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {FILIERES.map(filiere => (
                      <SelectItem key={filiere} value={filiere}>{filiere}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="experienceGenerale"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expérience générale *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Pas d'expérience">Pas d'expérience</SelectItem>
                    <SelectItem value="Moins d'un an">Moins d'un an</SelectItem>
                    <SelectItem value="Entre 1 et 3 ans">Entre 1 et 3 ans</SelectItem>
                    <SelectItem value="Entre 3 et 5 ans">Entre 3 et 5 ans</SelectItem>
                    <SelectItem value="Plus de 5 ans">Plus de 5 ans</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        {/* Langues - Modifiable */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary border-b border-border pb-2">Langues</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {langues.map((langue) => (
              <Badge key={langue.name} variant="secondary" className="flex items-center gap-2 py-1.5 px-3">
                {langue.name} - {langue.level}
                <button type="button" onClick={() => removeLangue(langue.name)} className="hover:text-destructive">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            {langues.length === 0 && (
              <p className="text-sm text-muted-foreground">Aucune langue ajoutée</p>
            )}
          </div>
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[150px]">
              <label className="text-sm font-medium">Langue</label>
              <Select value={newLangue} onValueChange={setNewLangue}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUES_DISPONIBLES.filter(l => !langues.find(lang => lang.name === l)).map(langue => (
                    <SelectItem key={langue} value={langue}>{langue}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="text-sm font-medium">Niveau</label>
              <Select value={newLevel} onValueChange={(v) => setNewLevel(v as Language['level'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Débutant">Débutant</SelectItem>
                  <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
                  <SelectItem value="Avancé">Avancé</SelectItem>
                  <SelectItem value="Courant">Courant</SelectItem>
                  <SelectItem value="Natif">Natif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="button" variant="outline" onClick={addLangue} disabled={!newLangue}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </div>

        {/* Orientation - Modifiable */}
        <FormSection title="Orientation & Objectifs">
          <FormField
            control={form.control}
            name="objectif"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Objectif *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Entrepreneuriat">Entrepreneuriat</SelectItem>
                    <SelectItem value="ESS">ESS</SelectItem>
                    <SelectItem value="Formation">Formation</SelectItem>
                    <SelectItem value="Employabilité">Employabilité</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="formationChoisie"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Formation choisie *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {FORMATIONS.map(formation => (
                      <SelectItem key={formation} value={formation}>{formation}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="orientation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Orientation *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Interne">Interne</SelectItem>
                    <SelectItem value="Externe">Externe</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destination *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {DESTINATIONS.map(dest => (
                      <SelectItem key={dest} value={dest}>{dest}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dateOrientation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date d'orientation</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        {/* Observations - Modifiable */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary border-b border-border pb-2">Observations</h3>
          <FormField
            control={form.control}
            name="observations"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea 
                    placeholder="Notes et observations sur le candidat..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Champs personnalisés */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary border-b border-border pb-2">
            Champs personnalisés
          </h3>
          
          {/* Liste des champs existants */}
          {customFields.length > 0 && (
            <div className="space-y-3">
              {customFields.map((field, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Input
                    placeholder="Nom du champ"
                    value={field.label}
                    onChange={(e) => updateCustomField(index, 'label', e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Valeur"
                    value={field.value}
                    onChange={(e) => updateCustomField(index, 'value', e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCustomField(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Ajouter un nouveau champ */}
          <div className="flex items-end gap-3 p-4 border border-dashed border-border rounded-lg bg-muted/30">
            <div className="flex-1">
              <FormLabel className="text-sm text-muted-foreground">Nom du champ</FormLabel>
              <Input
                placeholder="Ex: Compétence particulière"
                value={newFieldLabel}
                onChange={(e) => setNewFieldLabel(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <FormLabel className="text-sm text-muted-foreground">Valeur</FormLabel>
              <Input
                placeholder="Ex: Excel avancé"
                value={newFieldValue}
                onChange={(e) => setNewFieldValue(e.target.value)}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={addCustomField}
              disabled={!newFieldLabel.trim() || !newFieldValue.trim()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Ajoutez des informations supplémentaires non prévues dans le formulaire standard.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Annuler
            </Button>
          )}
          <Button type="submit" className="gradient-primary">
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? 'Enregistrer les modifications' : 'Créer le candidat'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
