import { X, Printer, Download, ZoomIn, ZoomOut, RotateCw, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';

interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName: string;
}

export function FilePreviewModal({ isOpen, onClose, fileUrl, fileName }: FilePreviewModalProps) {
  const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(fileName);
  const isPdf = /\.pdf$/i.test(fileName);
  const isText = /\.(txt|log|csv|md)$/i.test(fileName);

  const [textContent, setTextContent] = useState<string | null>(null);
  const [localUrl, setLocalUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (isOpen) {
      prepareContent();
    }
    return () => {
      if (localUrl) {
        URL.revokeObjectURL(localUrl);
      }
    };
  }, [isOpen, fileUrl]);

  const prepareContent = async () => {
    try {
      setLoading(true);
      setLocalUrl(null);
      setTextContent(null);

      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error('Fetch failed');
      const blob = await response.blob();

      if (isText) {
        const text = await blob.text();
        setTextContent(text);
      } else {
        // Correctly set PDF type for reliability
        const finalBlob = isPdf ? new Blob([blob], { type: 'application/pdf' }) : blob;
        const url = URL.createObjectURL(finalBlob);
        setLocalUrl(url);
      }
    } catch (error) {
      console.error('Content prep failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (isImage || isText) {
      window.print();
    } else if (isPdf && localUrl) {
      // Create a hidden iframe for PDF printing using the local blob URL
      const printIframe = document.createElement('iframe');
      printIframe.style.position = 'fixed';
      printIframe.style.right = '0';
      printIframe.style.bottom = '0';
      printIframe.style.width = '0';
      printIframe.style.height = '0';
      printIframe.style.border = 'none';
      printIframe.src = localUrl;
      
      document.body.appendChild(printIframe);
      
      printIframe.onload = () => {
        setTimeout(() => {
          printIframe.contentWindow?.focus();
          printIframe.contentWindow?.print();
          setTimeout(() => document.body.removeChild(printIframe), 2000);
        }, 500);
      };
    } else {
      const printWindow = window.open(fileUrl, '_blank');
      if (printWindow) {
        setTimeout(() => printWindow.print(), 1000);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[90vw] h-[85vh] p-0 overflow-hidden bg-slate-950 border-white/10 shadow-2xl rounded-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Printer className="w-4 h-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-md">
                {fileName}
              </h3>
              <p className="text-[10px] text-slate-500 font-medium">Universal Document Preview</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handlePrint}
              className="h-9 w-9 text-slate-300 hover:text-white hover:bg-white/10"
              title="Print Now"
            >
              <Printer className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => window.open(fileUrl, '_blank')}
              className="h-9 w-9 text-slate-300 hover:text-white hover:bg-white/10"
              title="Download Original"
            >
              <Download className="w-4 h-4" />
            </Button>
            <div className="w-px h-4 bg-white/10 mx-1" />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="h-9 w-9 text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 relative bg-slate-900 overflow-auto flex items-center justify-center min-h-0">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Preparing Document...</p>
              </motion.div>
            ) : isImage ? (
              <motion.div
                key="image"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative p-8"
                style={{ 
                  transform: `scale(${scale}) rotate(${rotation}deg)`,
                  transition: 'transform 0.2s ease-out'
                }}
              >
                <img 
                  id="printable-document"
                  src={localUrl || ''} 
                  alt={fileName} 
                  className="max-w-full max-h-full rounded shadow-2xl object-contain"
                />
              </motion.div>
            ) : isPdf ? (
              <object
                key="pdf"
                id="pdf-object"
                data={`${localUrl}#toolbar=0&navpanes=0&view=FitH`} 
                type="application/pdf"
                className="w-full h-full border-none bg-white"
              >
                <div className="flex flex-col items-center justify-center h-full p-12 text-center bg-slate-900">
                  <p className="text-white font-bold mb-4">Cannot display PDF directly</p>
                  <Button onClick={handlePrint}>Open in Print Viewer</Button>
                </div>
              </object>
            ) : isText ? (
              <motion.div key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full p-8 bg-white overflow-auto">
                <pre className="text-slate-800 font-mono text-sm whitespace-pre-wrap">
                  {textContent}
                </pre>
              </motion.div>
            ) : (
              <motion.div key="other" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-6 p-12 text-center">
                <div className="p-6 bg-white/5 rounded-full ring-1 ring-white/10">
                  <FileText className="w-16 h-16 text-slate-500" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-white font-bold text-lg">No Preview Available</h4>
                  <p className="text-sm text-slate-400 max-w-sm">
                    This file type ({fileName?.split('.').pop()?.toUpperCase() || 'UNKNOWN'}) cannot be previewed directly in the browser. 
                    Please use the buttons below to open or print it.
                  </p>
                </div>
                <Button 
                  onClick={handlePrint}
                  className="bg-primary hover:bg-blue-600 text-white font-bold px-8 h-12 rounded-2xl"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print via System
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Floating Controls for Images */}
          {isImage && !loading && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 bg-slate-800/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl print:hidden">
              <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-white/10" onClick={() => setScale(s => Math.max(0.5, s - 0.2))}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-[10px] font-bold text-slate-400 min-w-[40px] text-center">
                {Math.round(scale * 100)}%
              </span>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-white/10" onClick={() => setScale(s => Math.min(3, s + 0.2))}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <div className="w-px h-4 bg-white/10 mx-1" />
              <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-white/10" onClick={() => setRotation(r => r + 90)}>
                <RotateCw className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/5 bg-slate-900/80 flex items-center justify-between print:hidden">
          <p className="text-[10px] text-slate-500 hidden sm:block">
            QuickPrint Direct Cloud Preview Engine v2.0
          </p>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1 sm:flex-none border-white/10 text-white hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePrint}
              className="flex-1 sm:flex-none bg-primary hover:bg-blue-600 text-white font-bold px-8 shadow-lg shadow-primary/20"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Document
            </Button>
          </div>
        </div>
      </DialogContent>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { margin: 0; size: auto; }
          body { margin: 0; padding: 0; background: white; }
          .fixed, .absolute, .sticky { position: static !important; }
          [role="dialog"] { 
            position: absolute !important; 
            top: 0 !important; 
            left: 0 !important; 
            width: 100% !important; 
            height: auto !important; 
            margin: 0 !important; 
            padding: 0 !important; 
            background: white !important;
            border: none !important;
            box-shadow: none !important;
          }
          #printable-document, #pdf-iframe { 
            width: 100% !important; 
            height: 100vh !important; 
            max-height: none !important;
            object-fit: contain !important;
            border: none !important;
          }
          pre {
            white-space: pre-wrap !important;
            word-wrap: break-word !important;
            font-size: 12pt !important;
            color: black !important;
          }
        }
      `}} />
    </Dialog>
  );
}
