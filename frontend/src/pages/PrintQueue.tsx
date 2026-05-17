import { useSelector } from 'react-redux';
import { useState } from 'react';
import type { RootState } from '@/redux/store';
import { 
  Search, 
  Filter, 
  Eye, 
  Trash2, 
  FileText,
} from 'lucide-react';
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
import { Avatar, AvatarFallback } from '@/components/ui/Avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { FilePreviewModal } from '@/components/dashboard/FilePreviewModal';
import { cn } from '@/lib/utils';

export default function PrintQueue() {
  const { jobs } = useSelector((state: RootState) => state.jobs);
  const [searchQuery, setSearchQuery] = useState('');
  const [previewJob, setPreviewJob] = useState<any>(null);

  // Only show Pending and Printing jobs
  const activeJobs = jobs.filter(job => 
    job.status !== 'Completed' && 
    (job.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
     job.fileName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Header - Compact */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Active Queue</h1>
          <p className="text-xs text-slate-500 font-medium">Real-time job tracking</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <Input
              placeholder="Search..."
              className="pl-9 h-8 bg-white border-slate-200 text-xs rounded-lg w-48"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="h-8 rounded-lg gap-2 text-[10px] font-bold">
            <Filter className="w-3.5 h-3.5" /> Filter
          </Button>
        </div>
      </div>

      {/* Queue Stats - Ultra Compact Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-primary/5 border border-primary/10 p-3 rounded-xl flex items-center justify-between">
          <span className="text-[10px] font-black text-primary uppercase">Total Active</span>
          <span className="text-lg font-black text-slate-900">{activeJobs.length}</span>
        </div>
        <div className="bg-amber-500/5 border border-amber-500/10 p-3 rounded-xl flex items-center justify-between">
          <span className="text-[10px] font-black text-amber-600 uppercase">Pending</span>
          <span className="text-lg font-black text-slate-900">{activeJobs.filter(j => j.status === 'Pending').length}</span>
        </div>
        <div className="bg-sky-500/5 border border-sky-500/10 p-3 rounded-xl flex items-center justify-between">
          <span className="text-[10px] font-black text-sky-600 uppercase">Printing</span>
          <span className="text-lg font-black text-slate-900">{activeJobs.filter(j => j.status === 'Printing').length}</span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200/60 shadow-lg shadow-slate-200/5 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="text-[10px] uppercase font-black tracking-widest text-slate-400 py-2 pl-6">Customer</TableHead>
              <TableHead className="text-[10px] uppercase font-black tracking-widest text-slate-400 py-2">Document</TableHead>
              <TableHead className="text-[10px] uppercase font-black tracking-widest text-slate-400 py-2">Details</TableHead>
              <TableHead className="text-[10px] uppercase font-black tracking-widest text-slate-400 py-2">Status</TableHead>
              <TableHead className="text-right text-[10px] uppercase font-black tracking-widest text-slate-400 pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {activeJobs.length > 0 ? (
                activeJobs.map((job) => (
                  <motion.tr
                    key={job._id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="group border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                  >
                    <TableCell className="py-2.5 pl-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-black">
                            {job.customerName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 text-xs">{job.customerName}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-2.5">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[11px] font-bold text-slate-700 truncate max-w-[150px]">{job.fileName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2.5">
                      <div className="flex items-center gap-1.5">
                        <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-none font-bold text-[9px] py-0 px-1.5">
                          {job.copies}x
                        </Badge>
                        <Badge variant={job.printType === 'Color' ? 'info' : 'outline'} className="font-bold text-[9px] py-0 px-1.5">
                          {job.printType}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="py-2.5">
                      <Badge className={cn(
                        "rounded-full px-2 py-0 font-black text-[9px] h-4 flex items-center gap-1 border-none",
                        job.status === 'Printing' ? "bg-sky-50 text-sky-600 animate-pulse" : "bg-amber-50 text-amber-600"
                      )}>
                        <div className={`w-1 h-1 rounded-full ${job.status === 'Printing' ? 'bg-sky-500' : 'bg-amber-500'}`} />
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6 py-2.5">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setPreviewJob(job)}>
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                        </Button>
                        <div className="w-px h-3 bg-slate-100 mx-0.5" />
                        <Button className="h-7 bg-slate-900 text-white font-black text-[9px] px-2.5 rounded-lg">
                          PROCESS
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="py-16 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Queue is empty
                  </TableCell>
                </TableRow>
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      <FilePreviewModal
        isOpen={!!previewJob}
        onClose={() => setPreviewJob(null)}
        fileUrl={previewJob?.fileUrl}
        fileName={previewJob?.fileName}
      />
    </div>
  );
}


