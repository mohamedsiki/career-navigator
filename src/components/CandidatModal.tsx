import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Candidat, CandidatFormData, OBJECTIVES, TRAININGS, arrondissements, sources, genres, oriente_versOptions } from '@/types/candidat';

interface CandidatModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CandidatFormData) => void;
  candidat?: Candidat | null;
}

const initialFormData: CandidatFormData = {
  date: new Date().toISOString().split('T')[0],
  date_nessance: '',
  nom: '',
  prenom: '',
  cin: '',
  objectif: '',
  formation: '',
  observation: '',
  adress: '',
  arrondissement: '',
  telephone: '',
  email: '',
  source: '',
  genre: '',
  oriente_vers: '',
  destination: '',
};

export function CandidatModal({ open, onClose, onSave, candidat }: CandidatModalProps) {
  const [formData, setFormData] = useState<CandidatFormData>(initialFormData);
  const [objectives, setObjectives] = useState(OBJECTIVES);
  const [trainings, setTrainings] = useState(TRAININGS);

  useEffect(() => {
    if (candidat) {
      setFormData({
        date: candidat.date,
        date_nessance: candidat.date_nessance,
        nom: candidat.nom,
        prenom: candidat.prenom,
        cin: candidat.cin,
        objectif: candidat.objectif,
        formation: candidat.formation,
        observation: candidat.observation,
        adress: candidat.adress,
        arrondissement: candidat.arrondissement,
        telephone: candidat.telephone,
        email: candidat.email,
        source: candidat.source,
        genre: candidat.genre,
        oriente_vers: candidat.oriente_vers,
        destination: candidat.destination,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [candidat, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const updateField = (field: keyof CandidatFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {candidat ? 'Modifier Candidat' : 'Nouveau Candidat'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
          {/* Ligne Date et Date de naissance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => updateField('date', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_nessance">Date de naissance</Label>
              <Input
                id="date_nessance"
                type="date"
                value={formData.date_nessance}
                onChange={(e) => updateField('date_nessance', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Ligne Nom et Prénom */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) => updateField('nom', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom</Label>
              <Input
                id="prenom"
                value={formData.prenom}
                onChange={(e) => updateField('prenom', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Ligne CIN et Téléphone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cin">CIN</Label>
              <Input
                id="cin"
                value={formData.cin}
                onChange={(e) => updateField('cin', e.target.value.toUpperCase())}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                value={formData.telephone}
                onChange={(e) => updateField('telephone', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Ligne Email et Adresse */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adress">Adresse</Label>
              <Input
                id="adress"
                value={formData.adress}
                onChange={(e) => updateField('adress', e.target.value)}
              />
            </div>
          </div>

          {/* Ligne Arrondissement et Source */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Arrondissement</Label>

            </div>
            <div className="space-y-2">
              <Label>Source</Label>

            </div>
          </div>

          {/* Ligne Genre et Orienté vers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Genre</Label>

            </div>
            <div className="space-y-2">
              <Label>Orienté vers</Label>

            </div>
          </div>

          {/* Objectif et Formation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Objectif</Label>
              /
            </div>
            {formData.objectif === 'Formation' && (
              <div className="space-y-2">
                <Label>Formation</Label>
/
              </div>
            )}
          </div>

          {/* Destination */}
          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              value={formData.destination}
              onChange={(e) => updateField('destination', e.target.value)}
            />
          </div>

          {/* Observation */}
          <div className="space-y-2">
            <Label htmlFor="observation">Observation</Label>
            <Textarea
              id="observation"
              value={formData.observation}
              onChange={(e) => updateField('observation', e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" variant="default">
              {candidat ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
