import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Bell, Sprout } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export function Header() {
  const { user, logout } = useAuth();
  const { alerts } = useApp();
  const unresolvedAlerts = alerts.filter(a => !a.isResolved).length;

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
            <Sprout className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground">CropCura Banking Dashboard</span>
            <span className="text-xs text-muted-foreground">Agricultural Credit Intelligence</span>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-2 ml-4 px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-xs font-medium text-accent">Demo Mode</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-sm font-medium text-foreground">{user?.bankName}</span>
          <span className="text-xs text-muted-foreground">Loan Officer: {user?.loanOfficer}</span>
        </div>
        
        <div className="relative">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            {unresolvedAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-medium">
                {unresolvedAlerts}
              </span>
            )}
          </Button>
        </div>

        <Button 
          variant="ghost" 
          size="sm" 
          onClick={logout}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}
