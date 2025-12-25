import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X, Filter } from 'lucide-react';
import { OBJECTIVES, TRAININGS } from '@/types/candidat';

interface Filters {
  search: string;
  objectif: string;
  formation: string;
}

interface SearchFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export function SearchFilters({ filters, onFiltersChange }: SearchFiltersProps) {
  const updateFilter = (key: keyof Filters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      objectif: '',
      formation: '',
    });
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return (
    <div className="space-y-4 p-4 bg-card rounded-xl border border-border shadow-card">
      <div className="flex items-center gap-2">
        <Filter className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-medium">Filtres</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="ml-auto">
            <X className="h-4 w-4 mr-1" />
            Effacer
          </Button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher par nom ou CIN..."
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Select value={filters.objectif} onValueChange={(v) => updateFilter('objectif', v)}>
          <SelectTrigger>
            <SelectValue placeholder="Objectif" />
          </SelectTrigger>
          <SelectContent className="bg-popover border border-border">
            <SelectItem value="all">Tous les objectifs</SelectItem>
            {OBJECTIVES.map((obj) => (
              <SelectItem key={obj} value={obj}>{obj}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.formation} onValueChange={(v) => updateFilter('formation', v)}>
          <SelectTrigger>
            <SelectValue placeholder="Formation" />
          </SelectTrigger>
          <SelectContent className="bg-popover border border-border">
            <SelectItem value="all">Toutes les formations</SelectItem>
            {TRAININGS.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
