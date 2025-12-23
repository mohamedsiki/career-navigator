import { useState } from 'react';
import { Eye, Edit, Trash2, Download, Search, Filter } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CandidateTableProps {
  candidates: Candidate[];
  onView: (candidate: Candidate) => void;
  onEdit: (candidate: Candidate) => void;
  onDelete: (id: string) => void;
  onExport: (candidates: Candidate[], format: string) => void;
}

const typeBadgeStyles: Record<string, string> = {
  'Jeune diplômé actif': 'bg-success/10 text-success border-success/20',
  'Jeune diplômé en chômage': 'bg-warning/10 text-warning border-warning/20',
  'NEET': 'bg-destructive/10 text-destructive border-destructive/20',
};

const objectifBadgeStyles: Record<string, string> = {
  'Entrepreneuriat': 'bg-primary/10 text-primary border-primary/20',
  'ESS': 'bg-info/10 text-info border-info/20',
  'Formation': 'bg-success/10 text-success border-success/20',
  'Employabilité': 'bg-warning/10 text-warning border-warning/20',
};

export function CandidateTable({ 
  candidates, 
  onView, 
  onEdit, 
  onDelete,
  onExport 
}: CandidateTableProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [objectifFilter, setObjectifFilter] = useState<string>('all');

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = 
      candidate.nom.toLowerCase().includes(search.toLowerCase()) ||
      candidate.prenom.toLowerCase().includes(search.toLowerCase()) ||
      candidate.cin.toLowerCase().includes(search.toLowerCase()) ||
      candidate.email.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = typeFilter === 'all' || candidate.typeCandidat === typeFilter;
    const matchesObjectif = objectifFilter === 'all' || candidate.objectif === objectifFilter;
    
    return matchesSearch && matchesType && matchesObjectif;
  });

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-card p-4 rounded-xl border shadow-card">
        <div className="flex flex-wrap gap-3 items-center flex-1">
          <div className="relative flex-1 min-w-[200px] max-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un candidat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[200px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Type de candidat" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="Jeune diplômé actif">Jeune diplômé actif</SelectItem>
              <SelectItem value="Jeune diplômé en chômage">Jeune diplômé en chômage</SelectItem>
              <SelectItem value="NEET">NEET</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={objectifFilter} onValueChange={setObjectifFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Objectif" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les objectifs</SelectItem>
              <SelectItem value="Entrepreneuriat">Entrepreneuriat</SelectItem>
              <SelectItem value="ESS">ESS</SelectItem>
              <SelectItem value="Formation">Formation</SelectItem>
              <SelectItem value="Employabilité">Employabilité</SelectItem>
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
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Candidat</TableHead>
              <TableHead className="font-semibold">CIN</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Objectif</TableHead>
              <TableHead className="font-semibold">Formation</TableHead>
              <TableHead className="font-semibold">Contact</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCandidates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  Aucun candidat trouvé
                </TableCell>
              </TableRow>
            ) : (
              filteredCandidates.map((candidate) => (
                <TableRow 
                  key={candidate.id} 
                  className="hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => onView(candidate)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                        {candidate.prenom[0]}{candidate.nom[0]}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{candidate.prenom} {candidate.nom}</p>
                        <p className="text-xs text-muted-foreground">{candidate.arrondissement}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{candidate.cin}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("text-xs", typeBadgeStyles[candidate.typeCandidat])}>
                      {candidate.typeCandidat}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("text-xs", objectifBadgeStyles[candidate.objectif])}>
                      {candidate.objectif}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{candidate.formationChoisie}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{candidate.telephone}</p>
                      <p className="text-muted-foreground text-xs">{candidate.email}</p>
                    </div>
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

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        {filteredCandidates.length} candidat(s) trouvé(s) sur {candidates.length}
      </p>
    </div>
  );
}
