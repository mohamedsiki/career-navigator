import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, Trash2, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { Candidat } from '@/types/candidat';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CandidatTableProps {
  candidats: Candidat[];
  onEdit: (candidat: Candidat) => void;
  onDelete: (id: string) => void;
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

const ITEMS_PER_PAGE = 10;

export function CandidatTable({
  candidats,
  onEdit,
  onDelete,
  selectedIds,
  onSelectionChange,
}: CandidatTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(candidats.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCandidats = candidats.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const isAllSelected = paginatedCandidats.length > 0 && 
    paginatedCandidats.every(c => selectedIds.includes(c.id));

  const handleSelectAll = () => {
    if (isAllSelected) {
      onSelectionChange(selectedIds.filter(id => !paginatedCandidats.find(c => c.id === id)));
    } else {
      const newIds = paginatedCandidats.map(c => c.id);
      onSelectionChange([...new Set([...selectedIds, ...newIds])]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd/MM/yyyy', { locale: fr });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card shadow-card overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="w-16">N°</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Date de naissance</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Prénom</TableHead>
              <TableHead>CIN</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Adresse</TableHead>
              <TableHead>Arrondissement</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead>Objectif</TableHead>
              <TableHead>Formation</TableHead>
              <TableHead>Orienté vers</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead className="hidden md:table-cell">Observation</TableHead>

            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCandidats.map((candidat) => (
              <TableRow 
                key={candidat.id}
                className={cn(
                  "transition-colors",
                  selectedIds.includes(candidat.id) && "bg-primary/5"
                )}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(candidat.id)}
                    onCheckedChange={() => handleSelectOne(candidat.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{candidat.numero}</TableCell>
                <TableCell className="text-muted-foreground">{formatDate(candidat.date)}</TableCell>
                <TableCell className="text-muted-foreground">{formatDate(candidat.date_nessance)}</TableCell>
                <TableCell className="font-medium">{candidat.nom}</TableCell>
                <TableCell className="font-medium">{candidat.prenom}</TableCell>
                <TableCell className="font-mono text-sm">{candidat.cin}</TableCell>
                <TableCell>{candidat.telephone}</TableCell>
                <TableCell>{candidat.email}</TableCell>
                <TableCell>{candidat.adress}</TableCell>
                <TableCell>{candidat.arrondissement}</TableCell>
                <TableCell>{candidat.source}</TableCell>
                <TableCell>{candidat.genre}</TableCell>
                <TableCell>{candidat.objectif}</TableCell>
                <TableCell>{candidat.objectif === 'Formation' ? candidat.formation : '-'}</TableCell>
                <TableCell>{candidat.oriente_vers}</TableCell>
                <TableCell>{candidat.oriente_vers === 'extern' ? candidat.destination : '-'}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {candidat.observation || '-'}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      {/* <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button> */}
                    </DropdownMenuTrigger>
                    {/* <DropdownMenuContent align="end" className="bg-popover border border-border shadow-elevated">
                      <DropdownMenuItem onClick={() => onEdit(candidat)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDelete(candidat.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent> */}
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Affichage {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, candidats.length)} sur {candidats.length} candidats
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            Page {currentPage} / {totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
