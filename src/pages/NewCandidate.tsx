import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { CandidateForm } from '@/components/candidates/CandidateForm';
import { CandidateFormData } from '@/types/candidate';
import { addCandidate } from '@/lib/database';
import { useToast } from '@/hooks/use-toast';

export default function NewCandidate() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (data: CandidateFormData) => {
    const newCandidate = addCandidate(data);
    
    toast({
      title: "Candidat enregistré",
      description: `${data.prenom} ${data.nom} a été ajouté avec succès.`,
    });

    navigate('/candidats');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Nouveau candidat" 
        subtitle="Remplissez le formulaire d'inscription"
      />
      
      <div className="p-8">
        <div className="max-w-5xl mx-auto bg-card rounded-xl border shadow-card p-8">
          <CandidateForm 
            onSubmit={handleSubmit}
            onCancel={() => navigate('/candidats')}
          />
        </div>
      </div>
    </div>
  );
}
