import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Candidat } from '@/types/candidat';
import { CalendarDays, TrendingUp, Users } from 'lucide-react';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval, format, subWeeks, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';

interface RegistrationStatsProps {
  candidats: Candidat[];
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--success))', 'hsl(var(--warning))'];

export function RegistrationStats({ candidats }: RegistrationStatsProps) {
  const stats = useMemo(() => {
    const now = new Date();
    
    // Weekly stats (last 4 weeks)
    const weeklyData = Array.from({ length: 4 }, (_, i) => {
      const weekStart = startOfWeek(subWeeks(now, 3 - i), { weekStartsOn: 1 });
      const weekEnd = endOfWeek(subWeeks(now, 3 - i), { weekStartsOn: 1 });
      const count = candidats.filter(c => {
        const regDate = new Date(c.date);
        return isWithinInterval(regDate, { start: weekStart, end: weekEnd });
      }).length;
      return {
        name: `S${format(weekStart, 'w')}`,
        inscriptions: count,
        label: `${format(weekStart, 'dd MMM', { locale: fr })} - ${format(weekEnd, 'dd MMM', { locale: fr })}`
      };
    });

    // Monthly stats (last 6 months)
    const monthlyData = Array.from({ length: 6 }, (_, i) => {
      const monthStart = startOfMonth(subMonths(now, 5 - i));
      const monthEnd = endOfMonth(subMonths(now, 5 - i));
      const count = candidats.filter(c => {
        const regDate = new Date(c.date);
        return isWithinInterval(regDate, { start: monthStart, end: monthEnd });
      }).length;
      return {
        name: format(monthStart, 'MMM', { locale: fr }),
        inscriptions: count,
        label: format(monthStart, 'MMMM yyyy', { locale: fr })
      };
    });

    // Yearly stats (current year)
    const yearStart = startOfYear(now);
    const yearEnd = endOfYear(now);
    const yearlyCount = candidats.filter(c => {
      const regDate = new Date(c.date);
      return isWithinInterval(regDate, { start: yearStart, end: yearEnd });
    }).length;

    // Current period counts
    const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 });
    const thisWeekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);

    const thisWeekCount = candidats.filter(c => {
      const regDate = new Date(c.date);
      return isWithinInterval(regDate, { start: thisWeekStart, end: thisWeekEnd });
    }).length;

    const thisMonthCount = candidats.filter(c => {
      const regDate = new Date(c.date);
      return isWithinInterval(regDate, { start: thisMonthStart, end: thisMonthEnd });
    }).length;

    // Distribution by objective
    const objectiveData = candidats.reduce((acc, c) => {
      acc[c.objectif] = (acc[c.objectif] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const objectiveChartData = Object.entries(objectiveData).map(([name, value]) => ({
      name,
      value,
    }));

    return {
      weeklyData,
      monthlyData,
      yearlyCount,
      thisWeekCount,
      thisMonthCount,
      objectiveChartData,
    };
  }, [candidats]);

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Statistiques d'Inscription
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-primary/10 rounded-lg p-4 text-center">
            <CalendarDays className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-primary">{stats.thisWeekCount}</p>
            <p className="text-xs text-muted-foreground">Cette semaine</p>
          </div>
          <div className="bg-accent/10 rounded-lg p-4 text-center">
            <CalendarDays className="h-6 w-6 text-accent mx-auto mb-2" />
            <p className="text-2xl font-bold text-accent">{stats.thisMonthCount}</p>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </div>
          <div className="bg-success/10 rounded-lg p-4 text-center">
            <Users className="h-6 w-6 text-success mx-auto mb-2" />
            <p className="text-2xl font-bold text-success">{stats.yearlyCount}</p>
            <p className="text-xs text-muted-foreground">Cette année</p>
          </div>
        </div>

        <Tabs defaultValue="weekly" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="weekly">Semaine</TabsTrigger>
            <TabsTrigger value="monthly">Mois</TabsTrigger>
            <TabsTrigger value="yearly">Objectifs</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly" className="mt-0">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    labelFormatter={(_, payload) => payload[0]?.payload?.label || ''}
                  />
                  <Bar dataKey="inscriptions" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="monthly" className="mt-0">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    labelFormatter={(_, payload) => payload[0]?.payload?.label || ''}
                  />
                  <Bar dataKey="inscriptions" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="yearly" className="mt-0">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.objectiveChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {stats.objectiveChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
