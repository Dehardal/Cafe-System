import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  ShieldCheck, 
  Search, 
  Crown, 
  MoreVertical,
  Settings,
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { RootState } from '@/redux/store';
import { loginSuccess } from '@/redux/slices/authSlice';
import api from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/Table';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

interface ShopOwner {
  _id: string;
  name: string;
  email: string;
  shopName: string;
  plan: 'Free' | 'Pro';
  subscriptionStatus: string;
  createdAt: string;
}

export default function SuperAdminDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [owners, setOwners] = useState<ShopOwner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalShops: 0,
    totalJobs: 0,
    activePro: 0
  });

  useEffect(() => {
    if (user?.isAdmin) {
      fetchAdminData();
    }
  }, [user]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoggingIn(true);
      const res = await api.post('/users/login', { 
        email: adminEmail.trim(), 
        password: adminPassword.trim() 
      });
      
      if (res.data.isAdmin) {
        dispatch(loginSuccess(res.data));
        toast.success('Admin Authenticated');
      } else {
        toast.error('Access Denied: Not an Administrator');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Authentication Failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [usersRes, statsRes] = await Promise.all([
        api.get('/users/admin/all'),
        api.get('/print/admin/stats')
      ]);
      
      setOwners(usersRes.data);
      setStats({
        totalShops: usersRes.data.length,
        totalJobs: statsRes.data.totalJobs || 0,
        activePro: statsRes.data.proUsers || 0
      });
    } catch (error) {
      console.error('Admin data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePlan = async (ownerId: string, currentPlan: string) => {
    const nextPlan = currentPlan === 'Free' ? 'Pro' : 'Free';
    try {
      await api.put(`/users/admin/update-plan/${ownerId}`, { plan: nextPlan });
      setOwners(prev => prev.map(o => o._id === ownerId ? { ...o, plan: nextPlan as any } : o));
      toast.success(`Plan updated to ${nextPlan}`);
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const filteredOwners = owners.filter(o => 
    o.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- ADMIN LOGIN WALL ---
  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-10 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl -z-10" />
             
             <div className="flex flex-col items-center mb-10 text-center">
                <div className="w-16 h-16 bg-indigo-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 mb-6">
                   <ShieldCheck className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-black text-white tracking-tight uppercase">Admin Portal</h1>
                <p className="text-slate-500 font-bold text-xs mt-2 uppercase tracking-widest">Restricted Access • Level 10</p>
             </div>

             <form onSubmit={handleAdminLogin} className="space-y-5">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Secure ID</label>
                   <Input 
                      type="email"
                      placeholder="Admin Email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-white h-12 rounded-2xl focus:ring-indigo-500"
                      required
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Cipher Key</label>
                   <div className="relative">
                      <Input 
                         type={showPassword ? "text" : "password"}
                         placeholder="••••••••"
                         value={adminPassword}
                         onChange={(e) => setAdminPassword(e.target.value)}
                         className="bg-slate-800/50 border-slate-700 text-white h-12 rounded-2xl focus:ring-indigo-500 pr-12"
                         required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                   </div>
                </div>
                <Button 
                   disabled={isLoggingIn}
                   className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/10 transition-all mt-4"
                >
                   {isLoggingIn ? 'AUTHENTICATING...' : 'UNSEAL PORTAL'}
                </Button>
             </form>
          </div>
          <p className="text-center text-slate-600 text-[10px] font-black mt-8 uppercase tracking-[0.2em]">
             Authorized Personnel Only • IP Logged
          </p>
        </motion.div>
      </div>
    );
  }

  // --- ADMIN DASHBOARD (IF LOGGED IN) ---
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
             <Link to="/dashboard">
                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white shadow-sm border-transparent hover:border-slate-200 border transition-all">
                    <ArrowLeft className="w-4 h-4 text-slate-600" />
                </Button>
             </Link>
             <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    Admin Command Center
                    <Badge className="bg-indigo-600 text-white border-none text-[10px] px-3 py-0.5 h-6 font-black uppercase tracking-widest">
                        GOD MODE
                    </Badge>
                </h1>
                <p className="text-slate-500 font-bold text-sm mt-1">Manage global platform operations and tenants.</p>
             </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="px-4 py-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase leading-none">Security Status</span>
                    <span className="text-xs font-black text-slate-900 mt-1">ENCRYPTED & ACTIVE</span>
                </div>
             </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Total Shop Owners', value: stats.totalShops, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Total Print Volume', value: stats.totalJobs, icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Pro Subscriptions', value: stats.activePro, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-[24px] border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-3 rounded-2xl", stat.bg)}>
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
                </div>
                <MoreVertical className="w-5 h-5 text-slate-300" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Shop Registry */}
        <div className="bg-white rounded-[32px] border border-slate-200/60 shadow-xl shadow-slate-200/10 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white sticky top-0 z-10">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Shop Registry</h2>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by owner, shop name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 bg-slate-50 border-transparent focus:bg-white text-sm rounded-2xl transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-none">
                  <TableHead className="font-black text-slate-400 text-[11px] uppercase tracking-widest pl-8 h-12">Shop & Owner</TableHead>
                  <TableHead className="font-black text-slate-400 text-[11px] uppercase tracking-widest h-12">Plan Status</TableHead>
                  <TableHead className="font-black text-slate-400 text-[11px] uppercase tracking-widest h-12">Joined Date</TableHead>
                  <TableHead className="font-black text-slate-400 text-[11px] uppercase tracking-widest text-right pr-8 h-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {filteredOwners.map((owner) => (
                    <motion.tr
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={owner._id}
                      className="group border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                    >
                      <TableCell className="py-5 pl-8">
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 text-base uppercase tracking-tight">{owner.shopName}</span>
                          <span className="text-slate-400 font-medium text-xs mt-0.5">{owner.name} • {owner.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "text-[10px] font-black uppercase px-3 py-1 h-6 border-none flex items-center gap-2 w-fit shadow-sm",
                          owner.plan === 'Pro' ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-600"
                        )}>
                          <div className={cn("w-1.5 h-1.5 rounded-full",
                            owner.plan === 'Pro' ? "bg-indigo-500" : "bg-slate-400"
                          )} />
                          {owner.plan} Plan
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-slate-500 font-bold text-xs uppercase tracking-tight">
                          {new Date(owner.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex items-center justify-end gap-2">
                           <Button 
                             variant="outline" 
                             size="sm"
                             className="h-9 px-4 rounded-xl font-bold text-xs border-slate-200 hover:bg-white hover:text-indigo-600 transition-all gap-2"
                             onClick={() => togglePlan(owner._id, owner.plan)}
                           >
                             <Crown className={cn("w-3.5 h-3.5", owner.plan === 'Pro' ? "text-amber-500" : "text-slate-300")} />
                             {owner.plan === 'Pro' ? 'Downgrade' : 'Upgrade to Pro'}
                           </Button>
                           <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-300 hover:text-slate-600">
                             <Settings className="w-4 h-4" />
                           </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {filteredOwners.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={4} className="py-20 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mb-4">
                          <Users className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-black text-slate-900 uppercase">No Owners Found</h3>
                        <p className="text-slate-400 text-sm font-medium mt-1">Try searching for a different name or email.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
