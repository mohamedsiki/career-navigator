import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CandidateTable } from '@/components/candidates/CandidateTable';
import { CandidateDetailModal } from '@/components/candidates/CandidateDetailModal';
import { Candidate } from '@/types/candidate';
import { getAllCandidates, deleteCandidate, seedDatabase } from '@/lib/database';
import { exportToJSON, exportToCSV, exportToExcel, exportToPDF } from '@/lib/export';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function CandidatesList() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    seedDatabase();
    setCandidates(getAllCandidates());
  }, []);

  const handleView = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setDetailModalOpen(true);
  };

  const handleEdit = (candidate: Candidate) => {
    navigate(`/modifier/${candidate.id}`);
  };

  const handleDeleteClick = (id: string) => {
    setCandidateToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (candidateToDelete) {
      const success = deleteCandidate(candidateToDelete);
      if (success) {
        setCandidates(getAllCandidates());
        toast({
          title: "Candidat supprimé",
          description: "Le candidat a été supprimé avec succès.",
        });
      }
    }
    setDeleteDialogOpen(false);
    setCandidateToDelete(null);
  };

  const handleExport = (candidatesToExport: Candidate[], format: string) => {
    const filename = `candidats_${new Date().toISOString().split('T')[0]}`;
    
    switch (format) {
      case 'json':
        exportToJSON(candidatesToExport, filename);
        break;
      case 'csv':
        exportToCSV(candidatesToExport, filename);
        break;
      case 'excel':
        exportToExcel(candidatesToExport, filename);
        break;
      case 'pdf':
        exportToPDF(candidatesToExport, filename);
        break;
    }

    toast({
      title: "Export réussi",
      description: `Les données ont été exportées en ${format.toUpperCase()}.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      
      
      <div className="p-8">
        <CandidateTable
          candidates={candidates}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onExport={handleExport}
        />
      </div>

      <CandidateDetailModal
        candidate={selectedCandidate}
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce candidat ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
