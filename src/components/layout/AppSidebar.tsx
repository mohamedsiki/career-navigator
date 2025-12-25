import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Users, BarChart3, LogOut, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState, useEffect } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';

const menuItems = [
  { title: 'Dashboard', url: '/', icon: BarChart3 },
    { title: 'liste visit', url: '/visit', icon: Users },
  { title: 'Liste des Candidats', url: '/candidats', icon: Users },
  { title: 'Nouveau Candidat', url: '/nouveau', icon: Users },
];

const handleLogout = () => {
  localStorage.clear();
  window.location.href = 'http://192.168.1.89:8081/';
};

function SidebarContent({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/profile');
    onNavigate?.();
  };

  return (
    <>
      <div className="p-4 border-b border-primary-foreground/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
            <span className="text-secondary-foreground font-bold text-lg">YP</span>
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-primary-foreground font-bold text-lg truncate">Youth Platform</h1>
              <p className="text-primary-foreground/60 text-xs truncate">Gestion des jeunes</p>
            </div>
          )}
        </div>
      </div>

      <div
        onClick={handleProfileClick}
        className={cn(
          'p-4 border-b border-primary-foreground/10 cursor-pointer hover:bg-primary-foreground/10 transition-colors',
          collapsed ? 'flex justify-center' : ''
        )}
      >
        <div className={cn('flex items-center gap-3', collapsed && 'flex-col')}>
          <Avatar className="h-10 w-10 border-2 border-secondary">
            <AvatarImage src="data:image/jpeg;base64,..." alt="User" />
            <AvatarFallback className="bg-secondary text-secondary-foreground">AD</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-primary-foreground font-medium text-sm truncate">Admin User</p>
              <p className="text-primary-foreground/60 text-xs truncate">admin@youthplatform.ma</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.url;
          return (
            <NavLink
              key={item.url}
              to={item.url}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                'hover:bg-primary-foreground/10',
                isActive ? 'bg-secondary text-secondary-foreground font-medium' : 'text-primary-foreground/80',
                collapsed && 'justify-center px-2'
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-primary-foreground/10 space-y-2">
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 w-full',
            'text-destructive hover:bg-destructive/10',
            collapsed && 'justify-center px-2'
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </>
  );
}

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(true)}
          className="fixed top-4 left-4 z-50 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="p-0 w-full max-w-[300px] bg-gradient-to-b from-primary via-primary to-accent transition-all border-none">
            <SidebarContent collapsed={false} onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <aside className={cn('h-screen sticky top-0 flex flex-col bg-gradient-to-b from-primary via-primary to-accent transition-all duration-300', collapsed ? 'w-20' : 'w-64')}>
      <SidebarContent collapsed={collapsed} />
    </aside>
  );
}
