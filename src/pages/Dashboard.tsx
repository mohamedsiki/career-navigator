import { useMemo, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { Users, GraduationCap, Target, TrendingUp } from 'lucide-react';

// ---------- TYPES ----------
interface Candidat {
  id: string;
  nom: string;
  prenom: string;
  cin: string;
  date: string; // date d'inscription
  dateNaissance: string;
  objectif: string;
  formation: string;
  genre: string;
}

// ---------- COMPONENT STATCARD ----------
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  iconClassName?: string;
  trend?: { value: number; isPositive: boolean };
}

function StatCard({ title, value, icon: Icon, iconClassName, trend }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-card rounded-xl border shadow-card">
      <div className={`p-3 rounded-full ${iconClassName || 'bg-muted'}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="flex flex-col">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        {trend && (
          <span className={`text-sm ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}%
          </span>
        )}
      </div>
    </div>
  );
}

// ---------- MOCK DATA ----------
const OBJECTIFS = ['Entrepreneuriat', 'Formation', 'Employabilité', 'ESS'];
const FORMATIONS = ['Développement Web', 'Marketing', 'Design', 'Finance'];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateMockCandidats(count: number): Candidat[] {
  const candidats: Candidat[] = [];
  for (let i = 0; i < count; i++) {
    const year = 1995 + Math.floor(Math.random() * 10);
    const month = 1 + Math.floor(Math.random() * 12);
    const day = 1 + Math.floor(Math.random() * 28);
    candidats.push({
      id: `c-${i + 1}`,
      nom: `Nom${i + 1}`,
      prenom: `Prenom${i + 1}`,
      cin: `CIN${1000 + i}`,
      date: `2025-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
      dateNaissance: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
      objectif: randomItem(OBJECTIFS),
      formation: randomItem(FORMATIONS),
      genre: i % 2 === 0 ? 'Homme' : 'Femme',
    });
  }
  return candidats;
}

// ---------- COLORS ----------
const COLORS = ['#3a215e', '#FFD76B', '#22c55e', '#0051ad', '#8b5cf6', '#06b6d4', '#f59e0b', '#ec4899'];

// ---------- DASHBOARD COMPONENT ----------
export default function Dashboard() {
  const [candidats] = useState<Candidat[]>(() => generateMockCandidats(50));

  // Total stats
  const stats = useMemo(() => {
    const total = candidats.length;
    const countsByObjectif: Record<string, number> = {};
    OBJECTIFS.forEach(obj => {
      countsByObjectif[obj] = candidats.filter(c => c.objectif === obj).length;
    });
    return { total, countsByObjectif };
  }, [candidats]);

  // Pie chart data: objectif
  const objectiveData = useMemo(() => {
    return OBJECTIFS.map(obj => ({
      name: obj,
      value: stats.countsByObjectif[obj] || 0,
    }));
  }, [stats]);

  // Bar chart data: formations
  const trainingData = useMemo(() => {
    const counts: Record<string, number> = {};
    candidats.forEach(c => {
      counts[c.formation] = (counts[c.formation] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [candidats]);

  // Monthly trend chart
  const monthlyTrend = useMemo(() => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const counts: Record<string, number> = {};
    candidats.forEach(c => {
      const month = new Date(c.date).getMonth();
      const monthName = months[month];
      counts[monthName] = (counts[monthName] || 0) + 1;
    });
    return months.map(month => ({ month, inscriptions: counts[month] || 0 }));
  }, [candidats]);

  return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tableau de Bord Statistiques</h1>
          <p className="text-muted-foreground mt-1">Analyse complète des données des candidats</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Candidats" value={stats.total} icon={Users} iconClassName="bg-primary" trend={{ value: 12, isPositive: true }} />
          <StatCard title="Entrepreneuriat" value={stats.countsByObjectif['Entrepreneuriat']} icon={Target} iconClassName="bg-accent" />
          <StatCard title="Formation" value={stats.countsByObjectif['Formation']} icon={GraduationCap} iconClassName="bg-success" />
          <StatCard title="Employabilité" value={stats.countsByObjectif['Employabilité']} icon={Users} iconClassName="bg-secondary" />
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Objectives Pie */}
          <Card className="shadow-card">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Target className="h-5 w-5 text-primary"/> Objectifs</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={objectiveData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={60} paddingAngle={5} label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}>
                      {objectiveData.map((_, index) => (<Cell key={index} fill={COLORS[index % COLORS.length]} />))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Formations Bar */}
          <Card className="shadow-card">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><GraduationCap className="h-5 w-5 text-primary"/> Formations Populaires</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trainingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/>
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} stroke="hsl(var(--muted-foreground))" fontSize={11}/>
                    <YAxis stroke="hsl(var(--muted-foreground))"/>
                    <Tooltip contentStyle={{backgroundColor:'hsl(var(--card))', border:'1px solid hsl(var(--border))', borderRadius:'8px'}}/>
                    <Bar dataKey="value" fill="#FFD76B" radius={[4,4,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Trend */}
        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary"/> Inscriptions Mensuelles</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/>
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))"/>
                  <YAxis stroke="hsl(var(--muted-foreground))"/>
                  <Tooltip contentStyle={{backgroundColor:'hsl(var(--card))', border:'1px solid hsl(var(--border))', borderRadius:'8px'}}/>
                  <Legend/>
                  <Line type="monotone" dataKey="inscriptions" stroke="#0051ad" strokeWidth={3} dot={{fill:'#FFD76B', strokeWidth:2}} activeDot={{r:8, fill:'#FFD76B'}}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}
