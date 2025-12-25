import { useState, useMemo } from 'react';
import { CandidatTable } from '@/components/CandidatTable';
import { CandidatModal } from '@/components/CandidatModal';
import { SearchFilters } from '@/components/SearchFilters';
import { RegistrationStats } from '@/components/RegistrationStats';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Plus, Download, FileSpreadsheet, FileText, Trash2, Users, Target, BookOpen } from 'lucide-react';
import { Candidat, CandidatFormData, OBJECTIVES } from '@/types/candidat';
import { generateMockCandidats } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const [candidats, setCandidats] = useState<Candidat[]>(() => {
    const initial = generateMockCandidats(50);
    const newCandidatData = sessionStorage.getItem('newCandidat');
    if (newCandidatData) {
      sessionStorage.removeItem('newCandidat');
      const data = JSON.parse(newCandidatData) as CandidatFormData;
      const maxNumero = Math.max(0, ...initial.map(c => c.numero));
      const newCandidat: Candidat = {
        id: `c-${Date.now()}`,
        numero: maxNumero + 1,
        ...data, // Déplacer ceci APRÈS id et numero pour ne pas écraser les données
      };
      return [newCandidat, ...initial];
    }
    return initial;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCandidat, setEditingCandidat] = useState<Candidat | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    objectif: '',
    formation: '',
  });
  const { toast } = useToast();

  const filteredCandidats = useMemo(() => {
    return candidats.filter((c) => {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = !filters.search || 
        c.nom.toLowerCase().includes(searchLower) ||
        c.prenom.toLowerCase().includes(searchLower) ||
        c.cin.toLowerCase().includes(searchLower);
      
      const matchesObjectif = !filters.objectif || filters.objectif === 'all' || c.objectif === filters.objectif;
      const matchesFormation = !filters.formation || filters.formation === 'all' || c.formation === filters.formation;

      return matchesSearch && matchesObjectif && matchesFormation;
    });
  }, [candidats, filters]);

  const stats = useMemo(() => {
    const total = candidats.length;
    const objectifCounts = OBJECTIVES.reduce((acc, obj) => {
      acc[obj] = candidats.filter(c => c.objectif === obj).length;
      return acc;
    }, {} as Record<string, number>);
    
    return { total, objectifCounts };
  }, [candidats]);

  const handleAdd = () => {
    setEditingCandidat(null);
    setIsModalOpen(true);
  };

  const handleEdit = (candidat: Candidat) => {
    setEditingCandidat(candidat);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingId) {
      setCandidats(prev => prev.filter(c => c.id !== deletingId));
      setSelectedIds(prev => prev.filter(id => id !== deletingId));
      toast({
        title: 'Candidat supprimé',
        description: 'Le candidat a été supprimé avec succès.',
      });
    }
    setDeleteDialogOpen(false);
    setDeletingId(null);
  };

  const handleBulkDelete = () => {
    setCandidats(prev => prev.filter(c => !selectedIds.includes(c.id)));
    toast({
      title: 'Candidats supprimés',
      description: `${selectedIds.length} candidat(s) supprimé(s) avec succès.`,
    });
    setSelectedIds([]);
  };

  const handleSave = (data: CandidatFormData) => {
    if (editingCandidat) {
      setCandidats(prev => prev.map(c => 
        c.id === editingCandidat.id 
          ? { ...c, ...data }
          : c
      ));
      toast({
        title: 'Candidat mis à jour',
        description: 'Les informations ont été mises à jour avec succès.',
      });
    } else {
      const maxNumero = Math.max(0, ...candidats.map(c => c.numero));
      const newCandidat: Candidat = {
        id: `c-${Date.now()}`,
        numero: maxNumero + 1,
        ...data, // Utiliser toutes les données du formulaire
      };
      setCandidats(prev => [newCandidat, ...prev]);
      toast({
        title: 'Candidat créé',
        description: 'Le nouveau candidat a été ajouté avec succès.',
      });
    }
  };

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    const dataToExport = selectedIds.length > 0 
      ? candidats.filter(c => selectedIds.includes(c.id))
      : filteredCandidats;


    toast({
      title: 'Export réussi',
      description: `${dataToExport.length} candidat(s) exporté(s) en ${format.toUpperCase()}.`,
    });
  };

  return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">listes des visites</h1>
            <p className="text-muted-foreground mt-1"> suivez tous les visites </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {/* <Button variant="default" onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter Candidat
            </Button> */}
            {/* {selectedIds.length > 0 && (
              // <Button variant="destructive" onClick={handleBulkDelete}>
              //   <Trash2 className="h-4 w-4 mr-2" />
              //   Supprimer ({selectedIds.length})
              // </Button>
            )} */}
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover border border-border shadow-elevated">
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('excel')}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
          </div>
        </div>

        {/* Stats */}
        {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Candidats" value={stats.total} icon={Users} iconClassName="bg-primary" />
          <StatCard title="Entrepreneuriat" value={stats.objectifCounts['Entrepreneuriat'] || 0} icon={Target} iconClassName="bg-success" />
          <StatCard title="Formation" value={stats.objectifCounts['Formation'] || 0} icon={BookOpen} iconClassName="bg-accent" />
          <StatCard title="Employabilité" value={stats.objectifCounts['Employabilité'] || 0} icon={Users} iconClassName="bg-muted" />
        </div> */}

        {/* Registration Stats */}
        {/* <RegistrationStats candidats={candidats} /> */}

        {/* Filters */}
        <SearchFilters filters={filters} onFiltersChange={setFilters} />

        {/* Table */}
        <CandidatTable
          candidats={filteredCandidats}
          onEdit={handleEdit}
          onDelete={handleDelete}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />

        {/* Modal */}
        <CandidatModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          candidat={editingCandidat}
        />

        {/* Delete Dialog */}
        {/* <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="bg-card">
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer ce candidat? Cette action est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog> */}
      </div>
  );
}