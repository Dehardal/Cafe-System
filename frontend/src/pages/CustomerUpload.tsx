import { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  CloudUpload,
  FileText,
  CheckCircle,
  Loader2,
  Send,
  X,
  Printer,
  Minus,
  Plus,
  AlertCircle
} from 'lucide-react';
import api from '@/services/api';
import { cn } from '@/lib/utils';


import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

export default function CustomerUpload() {
  const { ownerId } = useParams();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    copies: 1,
    printType: 'B/W',
    notes: '',
  });

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    if (file.type.startsWith('image/')) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    setPreview(null);
  }, [file]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
    if (selectedFile && allowed.includes(selectedFile.type)) {
      setFile(selectedFile);
    } else {
      toast.error('Invalid file type. Please upload PDF, DOCX, or images.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { toast.error('Please select a file'); return; }
    setUploading(true);

    const data = new FormData();
    data.append('file', file);
    data.append('ownerId', ownerId!);
    data.append('customerName', formData.customerName);
    data.append('phone', formData.phone);
    data.append('copies', formData.copies.toString());
    data.append('printType', formData.printType);
    data.append('notes', formData.notes);

    try {
      await api.post('/print/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploaded(true);
      toast.success('File uploaded successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (uploaded) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Job Submitted!</h2>
          <p className="text-muted-foreground mb-8">
            Your document has been sent to the printer queue.
            <br />
            Please wait for the shop attendant to process it.
          </p>
          <Button onClick={() => { setUploaded(false); setFile(null); }}>
            Upload Another File
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-4 text-primary">
          <Printer className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Remote Printing</h1>
        <p className="text-muted-foreground">Upload your documents and get them printed instantly at the shop.</p>
      </div>

      <Card className="border-none shadow-2xl shadow-primary/5">
        <form onSubmit={handleSubmit}>
          <CardContent className="p-8 space-y-8">
            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={cn(
                "group relative border-2 border-dashed rounded-2xl transition-all duration-200 cursor-pointer overflow-hidden",
                isDragActive ? "border-primary bg-primary/5 ring-4 ring-primary/10" : "border-muted-foreground/20 hover:border-primary/50"
              )}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <AnimatePresence mode="wait">
                  {file ? (
                    <motion.div
                      key="file"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="flex flex-col items-center gap-4"
                    >
                      {preview ? (
                        <img src={preview} alt="Preview" className="w-24 h-24 object-cover rounded-lg shadow-lg border-2 border-background" />
                      ) : (
                        <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                          <FileText className="w-8 h-8 text-primary" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold truncate max-w-[250px]">{file.name}</p>
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mt-1">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 text-destructive hover:bg-destructive/10"
                        onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Remove File
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="flex flex-col items-center gap-4"
                    >
                      <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-200">
                        <CloudUpload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Click or drag & drop to upload</p>
                        <p className="text-xs text-muted-foreground mt-1">PDF, Image or Word (Max 10MB)</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Your Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+91 98765 43210"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Number of Copies</Label>
                <div className="flex items-center h-10 border rounded-md overflow-hidden bg-muted/20">
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, copies: Math.max(1, p.copies - 1) }))}
                    className="h-full px-4 hover:bg-muted transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="flex-1 text-center font-bold">{formData.copies}</span>
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, copies: p.copies + 1 }))}
                    className="h-full px-4 hover:bg-muted transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Print Quality</Label>
                <div className="flex h-10 p-1 bg-muted/20 border rounded-md">
                  {['B/W', 'Color'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, printType: type })}
                      className={cn(
                        "flex-1 rounded text-xs font-bold transition-all",
                        formData.printType === type ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {type === 'B/W' ? 'Black & White' : 'Full Color'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Special Instructions (Optional)</Label>
              <textarea
                id="notes"
                placeholder="e.g. Page 1-5 only, double-sided..."
                className="w-full min-h-[100px] bg-transparent border rounded-md p-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </CardContent>
          <CardFooter className="px-8 pb-8 pt-0">
            <Button
              type="submit"
              className="w-full h-12 text-base font-bold shadow-xl shadow-primary/20"
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Uploading Document...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Submit Print Job
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
        <AlertCircle className="w-3 h-3" />
        Encrypted & Secure File Transmission
      </div>
    </div>
  );
}
