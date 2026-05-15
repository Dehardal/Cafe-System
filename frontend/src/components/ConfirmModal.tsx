import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  type?: 'danger' | 'info';
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  type = 'danger',
}: ConfirmModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="relative glass rounded-2xl border border-white/[0.1] w-full max-w-sm p-6 overflow-hidden"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                type === 'danger' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
              }`}>
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{message}</p>
              </div>
              <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 font-semibold rounded-xl border border-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex-1 px-4 py-2.5 font-bold rounded-xl shadow-lg transition-all active:scale-95 ${
                  type === 'danger' ? 'bg-red-500 hover:bg-red-400 text-white shadow-red-500/20' : 'bg-sky-500 hover:bg-sky-400 text-white shadow-sky-500/20'
                }`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
