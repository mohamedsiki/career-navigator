import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  FileText,
  ChevronLeft,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Tableau de bord' },
  { path: '/candidats', icon: Users, label: 'Candidats' },
  { path: '/nouveau', icon: UserPlus, label: 'Nouveau candidat' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside 
      className={cn(
        "sidebar-gradient min-h-screen flex flex-col transition-all duration-300 relative",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-glow">
          <GraduationCap className="w-6 h-6 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <h1 className="text-sidebar-foreground font-semibold text-lg">GestCandidats</h1>
            <p className="text-sidebar-foreground/60 text-xs">Plateforme de gestion</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow" 
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="animate-fade-in">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-lg hover:scale-110 transition-transform"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        {!collapsed && (
          <p className="text-sidebar-foreground/40 text-xs text-center animate-fade-in">
            © 2024 GestCandidats
          </p>
        )}
      </div>
    </aside>
  );
}
