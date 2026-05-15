import { useSelector } from 'react-redux';
import { useState } from 'react';
import type { RootState } from '@/redux/store';
import { 
  Search, 
  Calendar,
  Eye,
  FileText,
  ChevronLeft,
  ChevronRight,
  Download
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

export default function HistoryPage() {
  const { jobs = [] } = useSelector((state: RootState) => state.jobs) || {};
  const [searchQuery, setSearchQuery] = useState('');
  const [previewJob, setPreviewJob] = useState<any>(null);

  // Filter history to show only completed and search-matched jobs
  const filteredHistory = jobs.filter(job => 
    job.status === 'Completed' && 
    (job.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
     job.fileName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <FilePreviewModal
        isOpen={!!previewJob}
        onClose={() => setPreviewJob(null)}
        fileUrl={previewJob?.fileUrl}
        fileName={previewJob?.fileName}
      />

      {/* Header - Fixed & Compact */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Print History</h1>
          <p className="text-xs text-slate-500 font-medium">Archive of all completed jobs</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <Input
              placeholder="Search archive..."
              className="pl-9 h-8 bg-white border-slate-200 text-xs rounded-lg w-56"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="h-8 rounded-lg gap-2 text-[10px] font-bold">
            <Calendar className="w-3.5 h-3.5" /> Date Range
          </Button>
          <Button variant="outline" size="sm" className="h-8 rounded-lg text-[10px] font-bold px-3">
            <Download className="w-3.5 h-3.5 mr-1.5" /> Export
          </Button>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="bg-white rounded-xl border border-slate-200/60 shadow-lg shadow-slate-200/5 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="text-[10px] uppercase font-black tracking-widest text-slate-400 py-2.5 pl-6">Completed</TableHead>
                <TableHead className="text-[10px] uppercase font-black tracking-widest text-slate-400 py-2.5">Customer</TableHead>
                <TableHead className="text-[10px] uppercase font-black tracking-widest text-slate-400 py-2.5">Document</TableHead>
                <TableHead className="text-[10px] uppercase font-black tracking-widest text-slate-400 py-2.5">Type</TableHead>
                <TableHead className="text-right text-[10px] uppercase font-black tracking-widest text-slate-400 py-2.5 pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((job) => (
                    <motion.tr
                      key={job._id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="group border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                    >
                      <TableCell className="py-2 pl-6">
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-slate-900">{new Date(job.updatedAt).toLocaleDateString()}</span>
                          <span className="text-[9px] text-slate-400 font-bold uppercase">{new Date(job.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6 ring-1 ring-slate-100">
                            <AvatarFallback className="text-[9px] bg-slate-100 text-slate-500 font-black">
                              {job.customerName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-700 text-xs">{job.customerName}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-2">
                        <div className="flex items-center gap-2">
                          <FileText className="w-3 h-3 text-slate-400" />
                          <span className="text-[10px] font-bold text-slate-600 truncate max-w-[150px]">{job.fileName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2">
                        <Badge variant="secondary" className="bg-slate-50 text-slate-500 border-none font-bold text-[8px] py-0 px-1.5 h-4">
                          {job.printType} • {job.copies}x
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6 py-2">
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-primary transition-colors" onClick={() => setPreviewJob(job)}>
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="py-16 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      No history found
                    </TableCell>
                  </TableRow>
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>

        {/* Pagination - Compact */}
        <div className="p-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
            Showing {filteredHistory.length} records
          </p>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg border border-slate-200 bg-white" disabled>
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg border border-slate-200 bg-white" disabled>
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
