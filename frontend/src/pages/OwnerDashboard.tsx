import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Printer,
  Clock,
  CheckCircle2,
  Users,
  Search,
  RefreshCw,
  QrCode,
  Eye,
  Trash2,
  FileText,
  AlertCircle
} from 'lucide-react';

import type { RootState } from '@/redux/store';
import {
  fetchJobsStart,
  fetchJobsSuccess,
  fetchJobsFailure,
  addJob,
  updateJobStatusLocal,
  removeJobLocal,
} from '@/redux/slices/jobSlice';
import { toast } from 'react-hot-toast';
import api from '@/services/api';
import { socket, connectSocket, disconnectSocket } from '@/services/socket';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';

import { cn } from '@/lib/utils';

import { QRModal } from '@/components/dashboard/QRModal';
import { FilePreviewModal } from '@/components/dashboard/FilePreviewModal';

export default function OwnerDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { jobs } = useSelector((state: RootState) => state.jobs);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [previewJob, setPreviewJob] = useState<any>(null);

  const shopUrl = `${window.location.origin}/upload/${user?._id}`;

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchJobs = async (silent = false) => {
    if (!silent) dispatch(fetchJobsStart());
    else setRefreshing(true);
    try {
      const { data } = await api.get('/print');
      dispatch(fetchJobsSuccess(data));
    } catch (error: any) {
      dispatch(fetchJobsFailure(error.response?.data?.message || 'Failed to fetch jobs'));
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    if (user?._id) connectSocket(user._id);

    socket.on('new_job', (job) => dispatch(addJob(job)));
    socket.on('job_updated', (updated) => {
      dispatch(updateJobStatusLocal({ id: updated._id, status: updated.status }));
    });

    return () => {
      socket.off('new_job');
      socket.off('job_updated');
      disconnectSocket();
    };
  }, [user?._id]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/print/${deleteId}`);
      dispatch(removeJobLocal(deleteId));
      toast.success('Job Deleted');
      setDeleteId(null);
    } catch (error: any) {
      toast.error('Failed to delete');
    }
  };



  const filteredJobs = jobs.filter(job =>
    job.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: jobs.length,
    pending: jobs.filter(j => j.status === 'Pending').length,
    printing: jobs.filter(j => j.status === 'Printing').length,
    completed: jobs.filter(j => j.status === 'Completed').length,
    customers: new Set(jobs.map(j => j.customerName)).size
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500 pb-4">
      <QRModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} shopUrl={shopUrl} shopName={user?.shopName || 'Shop'} />
      <FilePreviewModal isOpen={!!previewJob} onClose={() => setPreviewJob(null)} fileUrl={previewJob?.fileUrl} fileName={previewJob?.fileName} />

      {/* Stats - Compact Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatMiniCard icon={<Clock className="w-4 h-4" />} label="Pending" value={stats.pending} color="amber" />
        <StatMiniCard icon={<Printer className="w-4 h-4" />} label="In Progress" value={stats.printing} color="blue" />
        <StatMiniCard icon={<CheckCircle2 className="w-4 h-4" />} label="Done Today" value={stats.completed} color="emerald" />
        <StatMiniCard icon={<Users className="w-4 h-4" />} label="Customers" value={stats.customers} color="purple" />
      </div>

      {/* Main Table Area */}
      <div className="bg-white rounded-xl border border-slate-200/60 shadow-lg shadow-slate-200/10 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-black text-slate-900 tracking-tight whitespace-nowrap">Live Queue</h2>
              <Badge className={cn(
                "text-[9px] px-2 py-0 h-4 border-none shadow-sm font-black uppercase tracking-widest",
                user?.plan === 'Pro' ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600"
              )}>
                {user?.plan === 'Pro' ? 'PRO PLAN' : 'FREE PLAN'}
              </Badge>
            </div>
            <div className="relative w-full max-w-xs group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-8 bg-slate-50 border-transparent focus:bg-white text-xs rounded-lg transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg text-slate-400 hover:text-primary transition-colors"
              onClick={() => fetchJobs(true)}
              disabled={refreshing}
            >
              <RefreshCw className={cn("w-3.5 h-3.5", refreshing && "animate-spin")} />
            </Button>
            <Button
              onClick={() => setIsQRModalOpen(true)}
              className="h-8 bg-slate-900 text-white hover:bg-slate-800 font-black text-[10px] gap-2 px-4 rounded-lg shadow-lg shadow-slate-900/10"
            >
              <QrCode className="w-3.5 h-3.5 text-white" />
              QR CODE
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="text-xs uppercase font-black tracking-widest text-slate-500 py-3 pl-6">Customer</TableHead>
                <TableHead className="text-xs uppercase font-black tracking-widest text-slate-500 py-3">Document</TableHead>
                <TableHead className="text-xs uppercase font-black tracking-widest text-slate-500 py-3 text-center">Status</TableHead>
                <TableHead className="text-right text-xs uppercase font-black tracking-widest text-slate-500 py-3 pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <motion.tr
                      key={job._id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="group border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                    >
                      <TableCell className="py-4 pl-6">
                        <span className="font-black text-slate-900 text-base tracking-tight uppercase">{job.customerName}</span>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <div className="flex flex-col leading-tight">
                            <span className="text-sm font-black text-slate-700 truncate max-w-[250px]">{job.fileName}</span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs font-black text-primary uppercase">{job.copies} Copies</span>
                              <span className="text-xs font-black text-slate-400 uppercase">• {job.printType}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex justify-center">
                          <Badge className={cn(
                            "text-xs font-black uppercase px-3 py-1 h-6 border-none flex items-center gap-2 shadow-sm",
                            job.status === 'Pending' ? "bg-amber-50 text-amber-600" :
                              job.status === 'Printing' ? "bg-sky-50 text-sky-600 animate-pulse" :
                                "bg-emerald-50 text-emerald-600"
                          )}>
                            <div className={cn("w-2 h-2 rounded-full",
                              job.status === 'Pending' ? "bg-amber-500" :
                                job.status === 'Printing' ? "bg-sky-500" : "bg-emerald-500"
                            )} />
                            {job.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6 py-2.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-primary" onClick={() => setPreviewJob(job)}>
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-destructive" onClick={() => setDeleteId(job._id)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="py-20 text-center opacity-30">
                      <p className="text-xs font-bold uppercase tracking-widest">No active jobs</p>
                    </TableCell>
                  </TableRow>
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      </div>
      {/* Premium Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-100 flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Delete Job?</h3>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                This action cannot be undone. The document will be permanently removed from your queue.
              </p>
              <div className="flex gap-3 w-full">
                <Button 
                  variant="outline" 
                  className="flex-1 h-12 rounded-2xl border-slate-200 text-slate-600 font-bold"
                  onClick={() => setDeleteId(null)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 h-12 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg shadow-red-500/20"
                  onClick={handleDelete}
                >
                  Confirm
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatMiniCard({ icon, label, value, color }: any) {
  const colors: any = {
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    blue: "bg-sky-50 text-sky-600 border-sky-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
  };

  return (
    <div className={cn("p-3 rounded-xl border flex items-center justify-between bg-white shadow-sm", colors[color] || colors.blue)}>
      <div className="flex flex-col">
        <span className="text-[9px] font-black uppercase tracking-wider opacity-70">{label}</span>
        <span className="text-lg font-black text-slate-900 mt-0.5">{value}</span>
      </div>
      <div className="p-2 bg-white/80 rounded-lg shadow-sm">{icon}</div>
    </div>
  );
}
