import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Printer,
  History,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Coffee
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Printer, label: 'Print Queue', href: '/queue' },
  { icon: History, label: 'History', href: '/history' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r bg-card transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center px-4 border-b">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
            <Coffee className="w-5 h-5" />
          </div>
          {!isCollapsed && <span className="tracking-tight">QuickPrint</span>}
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 space-y-1 p-2 mt-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                isCollapsed && "justify-center px-0"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-2 border-t">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10",
            isCollapsed && "justify-center px-0"
          )}
          onClick={() => dispatch(logout())}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-card border rounded-full flex items-center justify-center shadow-sm hover:bg-accent"
      >
        {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </aside>
  );
}
