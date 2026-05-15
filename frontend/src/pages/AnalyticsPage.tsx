import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import { 
  TrendingUp, 
  Users, 
  Printer, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Calendar,
  Layers
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { motion } from 'framer-motion';

export default function AnalyticsPage() {
  const { jobs = [] } = useSelector((state: RootState) => state.jobs) || {};
  
  if (!jobs) return null;

  // 1. Core Stats Logic
  const totalJobs = jobs.length || 0;
  const completedJobs = jobs.filter(j => j.status === 'Completed').length;
  const colorJobs = jobs.filter(j => j.printType === 'Color').length;
  const bwJobs = jobs.filter(j => j.printType === 'B/W').length;
  const totalPages = jobs.reduce((acc, job) => acc + (Number(job.copies) || 1), 0);

  // 2. Real Customer Count
  const uniqueUsers = new Set(jobs.map(j => j.phone || j.customerName)).size;
  
  // 3. Estimated Revenue (₹2 for B/W, ₹5 for Color)
  const estimatedRevenue = jobs.reduce((acc, job) => {
    const price = job.printType === 'Color' ? 5 : 2;
    return acc + (price * (Number(job.copies) || 1));
  }, 0);

  // 4. Peak Hour Detection Logic
  const hourBuckets = new Array(24).fill(0);
  jobs.forEach(job => {
    const hour = new Date(job.createdAt).getHours();
    hourBuckets[hour]++;
  });
  
  const peakHour = hourBuckets.indexOf(Math.max(...hourBuckets));
  const peakTimeStr = `${peakHour % 12 || 12}:00 ${peakHour >= 12 ? 'PM' : 'AM'}`;
  
  // 5. Activity Chart Data (Last 12 hours)
  const currentHour = new Date().getHours();
  const last12Hours = Array.from({ length: 12 }, (_, i) => {
    const h = (currentHour - 11 + i + 24) % 24;
    return {
      hour: `${h % 12 || 12}${h >= 12 ? 'pm' : 'am'}`,
      count: hourBuckets[h]
    };
  });
  const maxCount = Math.max(...last12Hours.map(h => h.count), 1);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Analytics Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Shop Analytics</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Real-time performance insights</p>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Revenue" 
          value={`₹${estimatedRevenue}`} 
          trend="+100%" 
          up={true} 
          icon={<DollarSign className="w-5 h-5 text-emerald-600" />} 
          color="emerald" 
        />
        <StatCard 
          title="Print Volume" 
          value={totalPages} 
          trend="Live" 
          up={true} 
          icon={<Printer className="w-5 h-5 text-primary" />} 
          color="blue" 
        />
        <StatCard 
          title="Unique Customers" 
          value={uniqueUsers} 
          trend="Live" 
          up={true} 
          icon={<Users className="w-5 h-5 text-purple-600" />} 
          color="purple" 
        />
        <StatCard 
          title="Completion Rate" 
          value={`${totalJobs ? Math.round((completedJobs / totalJobs) * 100) : 0}%`} 
          trend="Real" 
          up={true} 
          icon={<Zap className="w-5 h-5 text-amber-600" />} 
          color="amber" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Distribution Card */}
        <motion.div variants={item} className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/20">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-black text-slate-900 flex items-center gap-2 text-sm">
              <Layers className="w-4 h-4 text-primary" />
              Print Type
            </h3>
          </div>
          <div className="space-y-5">
            <ProgressBar label="Color Prints" value={colorJobs} total={totalJobs} color="bg-primary" />
            <ProgressBar label="B/W Prints" value={bwJobs} total={totalJobs} color="bg-slate-700" />
          </div>
          <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Premium Rate</p>
              <p className="text-lg font-black text-slate-900 mt-0.5">
                {totalJobs ? Math.round((colorJobs / totalJobs) * 100) : 0}%
              </p>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Standard Rate</p>
              <p className="text-lg font-black text-slate-900 mt-0.5">
                {totalJobs ? Math.round((bwJobs / totalJobs) * 100) : 0}%
              </p>
            </div>
          </div>
        </motion.div>

        {/* Traffic Chart Card */}
        <motion.div variants={item} className="lg:col-span-2 bg-slate-900 p-6 rounded-3xl shadow-2xl shadow-slate-900/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <TrendingUp className="w-48 h-48 text-white" />
          </div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <Badge className="bg-primary/20 text-primary border-primary/20 font-black tracking-widest text-[9px]">LIVE DATA FEED</Badge>
                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold">
                  <Calendar className="w-3.5 h-3.5" />
                  Last 24 Hours
                </div>
              </div>
              <h3 className="text-2xl font-black text-white leading-tight">
                Peak activity at <br />
                around <span className="text-primary">{peakTimeStr}</span>
              </h3>
            </div>
            <div className="mt-6 flex items-end gap-2 h-24">
              {last12Hours.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${(h.count / maxCount) * 100}%` }}
                  transition={{ delay: 0.5 + (i * 0.05), type: 'spring' }}
                  className="flex-1 bg-white/10 rounded-t-md hover:bg-primary transition-colors cursor-pointer group/bar relative"
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-20">
                    {h.count} jobs
                  </div>
                  <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[7px] font-bold text-slate-500 uppercase tracking-tighter">
                    {h.hour}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function StatCard({ title, value, trend, up, icon, color }: any) {
  const colorMap: any = {
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-primary/5 text-primary",
    purple: "bg-purple-50 text-purple-600",
    amber: "bg-amber-50 text-amber-600"
  };

  return (
    <motion.div 
      variants={{ hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1 } }}
      className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/20 group hover:border-primary/20 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-2xl ${colorMap[color] || colorMap.blue} transition-transform group-hover:scale-110 duration-500`}>
          {icon}
        </div>
        <Badge className={`border-none font-black text-[10px] flex items-center gap-1 ${up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </Badge>
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
        <p className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{value}</p>
      </div>
    </motion.div>
  );
}

function ProgressBar({ label, value, total, color }: any) {
  const percentage = total ? Math.round((value / total) * 100) : 0;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-slate-500">
        <span>{label}</span>
        <span className="text-slate-900">{percentage}%</span>
      </div>
      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full ${color} rounded-full`}
        />
      </div>
    </div>
  );
}
