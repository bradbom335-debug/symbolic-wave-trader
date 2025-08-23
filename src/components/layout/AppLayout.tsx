import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { AuthModal } from '@/components/auth/AuthModal';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { 
  Brain, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Settings, 
  User, 
  LogOut,
  Activity,
  Zap,
  Target
} from 'lucide-react';

const AppLayout = () => {
  const { user, signOut } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Portfolio', href: '/portfolio', icon: PieChart },
    { name: 'Analysis', href: '/analysis', icon: TrendingUp },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActiveRoute = (href: string) => location.pathname === href;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <NavLink to="/" className="flex items-center space-x-2">
              <div className="relative">
                <Brain className="h-8 w-8 text-primary animate-neural-pulse" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-resonance rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-neural bg-clip-text text-transparent">
                  MarketForge AI
                </h1>
                <p className="text-xs text-muted-foreground">Neural Trading Platform</p>
              </div>
            </NavLink>

            {/* Navigation */}
            {user && (
              <nav className="flex items-center space-x-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActiveRoute(item.href)
                          ? 'bg-primary/20 text-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}
              </nav>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Status indicators */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-2 py-1 bg-secondary/50 rounded-lg border border-border/50">
                <Activity className="h-3 w-3 text-resonance" />
                <span className="text-xs font-medium">Neural Sync</span>
                <div className="w-1.5 h-1.5 bg-resonance rounded-full animate-pulse" />
              </div>
              
              <div className="flex items-center space-x-2 px-2 py-1 bg-secondary/50 rounded-lg border border-border/50">
                <Zap className="h-3 w-3 text-temporal" />
                <span className="text-xs font-medium">Quantum Active</span>
              </div>

              <div className="flex items-center space-x-2 px-2 py-1 bg-secondary/50 rounded-lg border border-border/50">
                <Target className="h-3 w-3 text-primary" />
                <span className="text-xs font-medium">AI Score: 94.7</span>
              </div>
            </div>

            {/* User menu or auth button */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.email}</p>
                      <p className="text-xs text-muted-foreground">Premium Account</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <NavLink to="/settings" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <NavLink to="/settings" className="flex items-center cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => setAuthModalOpen(true)}
                className="bg-gradient-neural hover:bg-gradient-neural/90"
              >
                Access Neural Interface
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto p-6">
        <Outlet />
      </main>

      {/* Auth Modal */}
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
};

export default AppLayout;