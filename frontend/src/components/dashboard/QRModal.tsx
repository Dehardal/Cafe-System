import { QRCodeSVG } from 'qrcode.react';
import { Download, Share2, Copy, Check, X, Smartphone, Printer, Globe } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

import {
  Dialog,
  DialogContent,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopUrl: string;
  shopName: string;
}

export function QRModal({ isOpen, onClose, shopUrl, shopName }: QRModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'qr' | 'link'>('qr');

  const handleCopy = () => {
    // Modern Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(shopUrl).then(() => {
        setCopied(true);
        toast.success('Link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      }).catch(err => {
        console.error('Clipboard API failed, using fallback:', err);
        fallbackCopyText(shopUrl);
      });
    } else {
      // Fallback for non-HTTPS/local IP
      fallbackCopyText(shopUrl);
    }
  };

  const fallbackCopyText = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Ensure the textarea is not visible
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    document.body.appendChild(textArea);
    
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setCopied(true);
        toast.success('Link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      } else {
        toast.error('Unable to copy link');
      }
    } catch (err) {
      toast.error('Unable to copy link');
    }

    document.body.removeChild(textArea);
  };

  const handleDownload = () => {
    const svg = document.getElementById('shop-qr-code');
    if (!svg) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1200;
    const height = 1600;
    canvas.width = width;
    canvas.height = height;

    // Premium Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Gradient Header
    const grad = ctx.createLinearGradient(0, 0, width, 400);
    grad.addColorStop(0, '#3b82f6');
    grad.addColorStop(1, '#2563eb');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, 400);

    // Header Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 90px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SCAN TO PRINT', width / 2, 180);
    
    ctx.font = '50px sans-serif';
    ctx.globalAlpha = 0.8;
    ctx.fillText(shopName.toUpperCase(), width / 2, 270);
    ctx.globalAlpha = 1.0;

    // Serialize SVG
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    
    img.onload = () => {
      // Draw QR with border
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.roundRect(150, 480, 900, 900, 40);
      ctx.fill();
      ctx.drawImage(img, 200, 530, 800, 800);

      // Footer
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 60px sans-serif';
      ctx.fillText('Print Instantly', width / 2, 1460);
      
      ctx.font = '35px sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('powered by quickprint.qr', width / 2, 1540);

      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `${shopName.replace(/\s+/g, '-').toLowerCase()}-qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden border-none bg-slate-950 shadow-2xl rounded-3xl">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 -right-20 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative">
          {/* Header */}
          <div className="p-6 pb-0 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                <Printer className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">Shop QR</h2>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="h-8 w-8 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="p-8 flex flex-col items-center">
            {/* Interactive Tabs */}
            <div className="flex bg-slate-900/50 p-1 rounded-xl mb-8 w-full border border-white/5">
              <button
                onClick={() => setActiveTab('qr')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all duration-200",
                  activeTab === 'qr' ? "bg-primary text-white shadow-lg" : "text-slate-400 hover:text-slate-200"
                )}
              >
                <Smartphone className="w-3.5 h-3.5" />
                Digital QR
              </button>
              <button
                onClick={() => setActiveTab('link')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all duration-200",
                  activeTab === 'link' ? "bg-primary text-white shadow-lg" : "text-slate-400 hover:text-slate-200"
                )}
              >
                <Globe className="w-3.5 h-3.5" />
                Direct Link
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'qr' ? (
                <motion.div
                  key="qr"
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="flex flex-col items-center w-full"
                >
                  {/* QR Card - Premium Interactive */}
                  <div className="group relative p-6 bg-white rounded-[2rem] shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
                    <div className="absolute -inset-0.5 bg-gradient-to-br from-primary to-blue-600 rounded-[2.1rem] blur opacity-20 group-hover:opacity-40 transition duration-500" />
                    <div className="relative">
                      <QRCodeSVG
                        id="shop-qr-code"
                        value={shopUrl}
                        size={200}
                        level="H"
                        includeMargin={false}
                        className="rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="mt-8 text-center space-y-2">
                    <p className="text-white font-bold text-lg">{shopName}</p>
                    <p className="text-slate-400 text-sm max-w-[240px]">
                      Share this QR with customers to receive documents instantly.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 w-full mt-10">
                    <Button 
                      onClick={handleDownload}
                      className="h-12 bg-white text-slate-950 hover:bg-slate-100 font-bold rounded-2xl shadow-xl transition-all active:scale-95"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({ title: shopName, url: shopUrl });
                        } else {
                          handleCopy();
                        }
                      }}
                      className="h-12 border-white/10 text-white hover:bg-white/5 font-bold rounded-2xl transition-all active:scale-95"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="link"
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="w-full space-y-6"
                >
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Shop Upload URL</label>
                    <div className="relative group cursor-pointer" onClick={handleCopy}>
                      <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
                      <div className="relative flex items-center gap-3 p-5 bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/10 group-hover:border-primary transition-all">
                        <code className="text-[12px] text-white font-mono break-all flex-1 leading-relaxed">
                          {shopUrl}
                        </code>
                        <div className="shrink-0 h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-300 group-hover:text-primary group-hover:bg-primary/10 transition-all">
                          {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                    <div className="flex gap-3">
                      <Globe className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-400 leading-relaxed">
                        This unique link allows customers to upload documents directly to your queue. Perfect for social bios or WhatsApp business.
                      </p>
                    </div>
                  </div>

                  <Button 
                    className={cn(
                      "w-full h-14 font-bold rounded-2xl transition-all duration-300",
                      copied ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "bg-primary hover:bg-blue-600 text-white shadow-lg shadow-primary/20"
                    )}
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <span className="flex items-center gap-2">
                        <Check className="w-5 h-5" /> Copied to Clipboard
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Copy className="w-5 h-5" /> Copy Shop Link
                      </span>
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
