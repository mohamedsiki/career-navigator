import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CandidateForm } from '@/components/candidates/CandidateForm';
import { Candidate, CandidateFormData } from '@/types/candidate';
import { getCandidateById, updateCandidate } from '@/lib/database';
import { useToast } from '@/hooks/use-toast';

export default function EditCandidate() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const found = getCandidateById(id);
      if (found) {
        setCandidate(found);
      } else {
        toast({
          title: "Candidat introuvable",
          description: "Le candidat demandé n'existe pas.",
          variant: "destructive",
        });
        navigate('/candidats');
      }
    }
    setLoading(false);
  }, [id, navigate, toast]);

  const handleSubmit = (data: CandidateFormData) => {
    if (id) {
      updateCandidate(id, data);
      
      toast({
        title: "Modifications enregistrées",
        description: `Les informations de ${data.prenom} ${data.nom} ont été mises à jour.`,
      });

      navigate('/candidats');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!candidate) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      
      <div className="p-8">
        <div className="max-w-5xl mx-auto bg-card rounded-xl border shadow-card p-8">
          <CandidateForm 
            initialData={candidate}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/candidats')}
          />
        </div>
      </div>
    </div>
  );
}
