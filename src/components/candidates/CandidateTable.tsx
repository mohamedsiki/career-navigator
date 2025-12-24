import { useState } from 'react';
import { Eye, Edit, Trash2, Download, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Candidate } from '@/types/candidate';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format, differenceInYears, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CandidateTableProps {
  candidates: Candidate[];
  onView: (candidate: Candidate) => void;
  onEdit: (candidate: Candidate) => void;
  onDelete: (id: string) => void;
  onExport: (candidates: Candidate[], format: string) => void;
}

const ITEMS_PER_PAGE = 10;

const calculateAge = (dateNaissance: string): number => {
  try {
    return differenceInYears(new Date(), parseISO(dateNaissance));
  } catch {
    return 0;
  }
};

const formatDate = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'dd/MM/yyyy', { locale: fr });
  } catch {
    return dateString;
  }
};

export function CandidateTable({ 
  candidates, 
  onView, 
  onEdit, 
  onDelete,
  onExport 
}: CandidateTableProps) {
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [genreFilter, setGenreFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = 
      candidate.nom.toLowerCase().includes(search.toLowerCase()) ||
      candidate.prenom.toLowerCase().includes(search.toLowerCase()) ||
      candidate.cin.toLowerCase().includes(search.toLowerCase()) ||
      candidate.email.toLowerCase().includes(search.toLowerCase()) ||
      candidate.telephone.includes(search);
    
    const matchesSource = sourceFilter === 'all' || candidate.sourceInscription === sourceFilter;
    const matchesGenre = genreFilter === 'all' || candidate.genre === genreFilter;
    
    return matchesSearch && matchesSource && matchesGenre;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCandidates = filteredCandidates.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleSourceFilterChange = (value: string) => {
    setSourceFilter(value);
    setCurrentPage(1);
  };

  const handleGenreFilterChange = (value: string) => {
    setGenreFilter(value);
    setCurrentPage(1);
  };

  const uniqueSources = [...new Set(candidates.map(c => c.sourceInscription))];

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-card p-4 rounded-xl border shadow-card">
        <div className="flex flex-wrap gap-3 items-center flex-1">
          <div className="relative flex-1 min-w-[200px] max-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher (CIN, Nom, Tél, Email)..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={sourceFilter} onValueChange={handleSourceFilterChange}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes sources</SelectItem>
              {uniqueSources.map(source => (
                <SelectItem key={source} value={source}>{source}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={genreFilter} onValueChange={handleGenreFilterChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="Homme">Homme</SelectItem>
              <SelectItem value="Femme">Femme</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Select onValueChange={(format) => onExport(filteredCandidates, format)}>
            <SelectTrigger className="w-[140px]">
              <Download className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Exporter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="excel">Excel</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">CIN</TableHead>
                <TableHead className="font-semibold">Nom & Prénom</TableHead>
                <TableHead className="font-semibold">Date Naissance</TableHead>
                <TableHead className="font-semibold">Age</TableHead>
                <TableHead className="font-semibold">Adresse</TableHead>
                <TableHead className="font-semibold">Arrondissement</TableHead>
                <TableHead className="font-semibold">Tél</TableHead>
                <TableHead className="font-semibold">Mail</TableHead>
                <TableHead className="font-semibold">Source</TableHead>
                <TableHead className="font-semibold">Genre</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCandidates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} className="text-center py-12 text-muted-foreground">
                    Aucun candidat trouvé
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCandidates.map((candidate) => (
                  <TableRow 
                    key={candidate.id} 
                    className="hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => onView(candidate)}
                  >
                    <TableCell className="text-sm whitespace-nowrap">
                      {formatDate(candidate.dateCreation)}
                    </TableCell>
                    <TableCell className="font-mono text-sm whitespace-nowrap">
                      {candidate.cin}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span className="font-medium">{candidate.nom} {candidate.prenom}</span>
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap">
                      {formatDate(candidate.dateNaissance)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {calculateAge(candidate.dateNaissance)} ans
                    </TableCell>
                    <TableCell className="text-sm max-w-[150px] truncate" title={candidate.adresse}>
                      {candidate.adresse}
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap">
                      {candidate.arrondissement}
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap">
                      {candidate.telephone}
                    </TableCell>
                    <TableCell className="text-sm max-w-[150px] truncate" title={candidate.email}>
                      {candidate.email}
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap">
                      {candidate.sourceInscription}
                    </TableCell>
                    <TableCell className="text-sm">
                      {candidate.genre}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" onClick={() => onView(candidate)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onEdit(candidate)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDelete(candidate.id)} className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Affichage {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredCandidates.length)} sur {filteredCandidates.length} candidat(s)
        </p>
        
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Précédent
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Suivant
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
