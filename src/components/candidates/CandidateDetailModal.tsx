import { Candidate } from '@/types/candidate';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  GraduationCap, 
  Briefcase,
  Target,
  Calendar,
  FileText,
  Download,
  Languages
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { exportToPDF } from '@/lib/export';

interface CandidateDetailModalProps {
  candidate: Candidate | null;
  open: boolean;
  onClose: () => void;
}

const Section = ({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 text-primary">
      <Icon className="w-5 h-5" />
      <h3 className="font-semibold text-lg">{title}</h3>
    </div>
    <div className="bg-muted/30 rounded-lg p-4">
      {children}
    </div>
  </div>
);

const Field = ({ label, value }: { label: string; value: string | undefined }) => (
  <div className="space-y-1">
    <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
    <p className="text-sm font-medium text-foreground">{value || '-'}</p>
  </div>
);

export function CandidateDetailModal({ candidate, open, onClose }: CandidateDetailModalProps) {
  if (!candidate) return null;

  const handleExportPDF = () => {
    exportToPDF([candidate], `fiche_${candidate.nom}_${candidate.prenom}`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-info flex items-center justify-center text-primary-foreground text-2xl font-bold shadow-lg">
                {candidate.prenom[0]}{candidate.nom[0]}
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">
                  {candidate.prenom} {candidate.nom}
                </DialogTitle>
                <p className="text-muted-foreground text-sm mt-1">ID: {candidate.id}</p>
                <div className="flex gap-2 mt-2">
                  <Badge className={cn(
                    "text-xs",
                    candidate.typeCandidat === 'Jeune diplômé actif' && "bg-success/10 text-success border-success/20",
                    candidate.typeCandidat === 'Jeune diplômé en chômage' && "bg-warning/10 text-warning border-warning/20",
                    candidate.typeCandidat === 'NEET' && "bg-destructive/10 text-destructive border-destructive/20"
                  )} variant="outline">
                    {candidate.typeCandidat}
                  </Badge>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
                    {candidate.objectif}
                  </Badge>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleExportPDF}>
              <Download className="w-4 h-4 mr-2" />
              Exporter PDF
            </Button>
          </div>
        </DialogHeader>

        <Separator />

        <div className="grid gap-6 py-4">
          {/* Identité */}
          <Section title="Identité" icon={User}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Field label="CIN" value={candidate.cin} />
              <Field label="Date de naissance" value={new Date(candidate.dateNaissance).toLocaleDateString('fr-FR')} />
              <Field label="Lieu de naissance" value={candidate.lieuNaissance} />
              <Field label="Genre" value={candidate.genre} />
              <Field label="Situation matrimoniale" value={candidate.situationMatrimoniale} />
              <Field label="Occupation mère" value={candidate.occupationMere} />
              <Field label="Occupation père" value={candidate.occupationPere} />
              <Field label="Milieu" value={candidate.milieu} />
            </div>
          </Section>

          {/* Coordonnées */}
          <Section title="Coordonnées" icon={MapPin}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="col-span-2">
                <Field label="Adresse" value={candidate.adresse} />
              </div>
              <Field label="Arrondissement" value={candidate.arrondissement} />
              <Field label="Téléphone" value={candidate.telephone} />
              <div className="col-span-2">
                <Field label="Email" value={candidate.email} />
              </div>
            </div>
          </Section>

          {/* Formation & Expérience */}
          <Section title="Formation & Expérience" icon={GraduationCap}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Field label="Niveau d'étude" value={candidate.niveauEtude} />
              <Field label="Type de diplôme" value={candidate.typeDiplome} />
              <Field label="Filière" value={candidate.filiereDiplome} />
              <Field label="Expérience générale" value={candidate.experienceGenerale} />
            </div>
          </Section>

          {/* Langues */}
          <Section title="Langues" icon={Languages}>
            <div className="flex flex-wrap gap-2">
              {candidate.langues.map((langue, index) => (
                <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                  {langue.name} <span className="text-muted-foreground ml-1">({langue.level})</span>
                </Badge>
              ))}
            </div>
          </Section>

          {/* Orientation */}
          <Section title="Orientation" icon={Target}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Field label="Source d'inscription" value={candidate.sourceInscription} />
              <Field label="Objectif" value={candidate.objectif} />
              <Field label="Formation choisie" value={candidate.formationChoisie} />
              <Field label="Type d'orientation" value={candidate.orientation} />
              <Field label="Destination" value={candidate.destination} />
              <Field label="Date d'orientation" value={candidate.dateOrientation ? new Date(candidate.dateOrientation).toLocaleDateString('fr-FR') : '-'} />
            </div>
          </Section>

          {/* Observations */}
          {candidate.observations && (
            <Section title="Observations" icon={FileText}>
              <p className="text-sm text-foreground whitespace-pre-wrap">{candidate.observations}</p>
            </Section>
          )}

          {/* Métadonnées */}
          <div className="flex justify-between text-xs text-muted-foreground pt-4 border-t">
            <span>Créé le {new Date(candidate.dateCreation).toLocaleDateString('fr-FR')}</span>
            <span>Modifié le {new Date(candidate.dateModification).toLocaleDateString('fr-FR')}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
