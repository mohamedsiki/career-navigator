import { useEffect, useState } from 'react';
import { Users, UserCheck, UserX, Target, TrendingUp, GraduationCap, Briefcase, Building2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { StatCard } from '@/components/dashboard/StatCard';
import { getStatistics, seedDatabase } from '@/lib/database';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    parType: { actif: 0, chomage: 0, neet: 0 },
    parObjectif: { entrepreneuriat: 0, ess: 0, formation: 0, employabilite: 0 },
    parGenre: { homme: 0, femme: 0 },
  });

  useEffect(() => {
    seedDatabase();
    setStats(getStatistics());
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Tableau de bord" 
        subtitle="Vue d'ensemble de la gestion des candidats"
      />
      
      <div className="p-8 space-y-8">
        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Candidats" 
            value={stats.total} 
            icon={Users}
            variant="primary"
            trend={{ value: 12, label: 'ce mois' }}
          />
          <StatCard 
            title="Diplômés Actifs" 
            value={stats.parType.actif} 
            icon={UserCheck}
            variant="success"
          />
          <StatCard 
            title="En Recherche" 
            value={stats.parType.chomage} 
            icon={UserX}
            variant="warning"
          />
          <StatCard 
            title="NEET" 
            value={stats.parType.neet} 
            icon={Target}
            variant="info"
          />
        </div>

        {/* Objectifs */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Répartition par objectif</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Entrepreneuriat" 
              value={stats.parObjectif.entrepreneuriat} 
              icon={TrendingUp}
              variant="primary"
            />
            <StatCard 
              title="ESS" 
              value={stats.parObjectif.ess} 
              icon={Building2}
              variant="info"
            />
            <StatCard 
              title="Formation" 
              value={stats.parObjectif.formation} 
              icon={GraduationCap}
              variant="success"
            />
            <StatCard 
              title="Employabilité" 
              value={stats.parObjectif.employabilite} 
              icon={Briefcase}
              variant="warning"
            />
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-card rounded-xl border shadow-card p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a 
              href="/nouveau" 
              className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 transition-all duration-300 border border-primary/20"
            >
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Nouveau candidat</p>
                <p className="text-sm text-muted-foreground">Ajouter un candidat</p>
              </div>
            </a>
            <a 
              href="/candidats" 
              className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-info/10 to-info/5 hover:from-info/20 hover:to-info/10 transition-all duration-300 border border-info/20"
            >
              <div className="w-12 h-12 rounded-xl bg-info flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-info-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Liste des candidats</p>
                <p className="text-sm text-muted-foreground">Voir tous les candidats</p>
              </div>
            </a>
            <a 
              href="/candidats" 
              className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-success/10 to-success/5 hover:from-success/20 hover:to-success/10 transition-all duration-300 border border-success/20"
            >
              <div className="w-12 h-12 rounded-xl bg-success flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Exporter les données</p>
                <p className="text-sm text-muted-foreground">PDF, Excel, CSV, JSON</p>
              </div>
            </a>
          </div>
        </div>

        {/* Genre distribution */}
        <div className="bg-card rounded-xl border shadow-card p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Répartition par genre</h2>
          <div className="flex gap-8">
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 rounded-full bg-primary"></div>
              <span className="text-foreground">Hommes: {stats.parGenre.homme}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 rounded-full bg-info"></div>
              <span className="text-foreground">Femmes: {stats.parGenre.femme}</span>
            </div>
          </div>
          <div className="mt-4 h-4 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-info transition-all duration-500"
              style={{ 
                width: stats.total > 0 
                  ? `${(stats.parGenre.homme / stats.total) * 100}%` 
                  : '50%' 
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
