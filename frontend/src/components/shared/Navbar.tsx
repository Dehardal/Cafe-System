import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { RootState } from '@/redux/store';
import { logout } from '@/redux/slices/authSlice';
import { socket } from '@/services/socket';
import { Bell, Search, LogOut, User, Settings as SettingsIcon, FileText, Clock } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { Button } from '@/components/ui/Button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    socket.on('new_job', (job) => {
      setNotifications(prev => [job, ...prev].slice(0, 5));
      setHasUnread(true);
    });

    return () => {
      socket.off('new_job');
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="h-16 border-b bg-card/50 backdrop-blur-md sticky top-0 z-50 px-6 flex items-center justify-between">
      {/* Search */}
      <div className="relative w-full max-w-md hidden sm:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search jobs, customers..."
          className="pl-9 bg-muted/50 border-none focus-visible:ring-1 text-sm"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 ml-auto">
        <DropdownMenu onOpenChange={(open) => open && setHasUnread(false)}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative group">
              <Bell className={cn("w-5 h-5 transition-colors", hasUnread ? "text-primary fill-primary/10" : "text-muted-foreground group-hover:text-foreground")} />
              {hasUnread && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background animate-pulse" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 mt-2 bg-slate-900 border border-white/10 shadow-2xl p-0 overflow-hidden" align="end">
            <div className="p-4 border-b border-white/5 bg-white/5">
              <h3 className="text-sm font-bold text-white">Notifications</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Recent print job activity</p>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notif, i) => (
                  <DropdownMenuItem key={i} className="flex items-start gap-3 p-4 focus:bg-white/5 cursor-pointer border-b border-white/5 last:border-0">
                    <div className="p-2 bg-primary/10 rounded-xl">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-[11px] font-bold text-white">New Job from {notif.customerName}</p>
                      <p className="text-[10px] text-slate-400 truncate max-w-[180px]">{notif.fileName}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-2.5 h-2.5 text-slate-500" />
                        <span className="text-[9px] text-slate-500 uppercase font-black tracking-tighter">JUST NOW</span>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="p-8 text-center">
                  <Bell className="w-8 h-8 text-white/10 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 font-medium">No new notifications</p>
                </div>
              )}
            </div>
            <div className="p-3 bg-white/[0.02] text-center border-t border-white/5">
              <button className="text-[10px] font-bold text-primary hover:text-sky-300 transition-colors uppercase tracking-widest">
                View All Activity
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full focus-visible:ring-0">
              <Avatar className="h-9 w-9 ring-2 ring-background border border-border">
                <AvatarImage src="" alt={user?.name} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="w-64 mt-2 bg-slate-900 border border-white/10 shadow-2xl p-2" 
            align="end" 
            forceMount
          >
            <DropdownMenuLabel className="font-normal px-3 py-2">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-bold leading-none text-white">{user?.name}</p>
                <p className="text-[10px] uppercase font-black tracking-widest text-sky-400">
                  {user?.shopName}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10 mx-2" />
            <DropdownMenuItem className="cursor-pointer gap-3 p-3 text-slate-300 hover:text-white focus:bg-white/5 focus:text-white transition-colors rounded-lg">
              <User className="w-4 h-4" /> 
              <span className="text-sm font-semibold">Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-3 p-3 text-slate-300 hover:text-white focus:bg-white/5 focus:text-white transition-colors rounded-lg">
              <SettingsIcon className="w-4 h-4" /> 
              <span className="text-sm font-semibold">Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10 mx-2" />
            <DropdownMenuItem 
              className="text-red-400 focus:bg-red-400/10 focus:text-red-400 cursor-pointer gap-3 p-3 transition-colors rounded-lg"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" /> 
              <span className="text-sm font-bold">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
