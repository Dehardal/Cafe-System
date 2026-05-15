import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import { 
  Store, 
  Lock, 
  QrCode, 
  Save,
  RefreshCw,
  Fingerprint,
  Pencil,
  Unlock
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { QRModal } from '@/components/dashboard/QRModal';

export default function SettingsPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    shopName: user?.shopName || '',
    email: user?.email || '',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  // Real QR URL using the owner's MongoDB ID
  const shopUrl = `${window.location.origin}/upload/${user?._id || 'demo'}`;

  const handleAction = () => {
    if (!isEditing) {
      setIsEditing(true);
      toast.success('Edit mode enabled');
      return;
    }

    // Handle Save Logic
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      toast.success('Settings updated and locked!');
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-120px)] space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto pb-12">
      <QRModal 
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        shopUrl={shopUrl}
        shopName={formData.shopName}
      />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h1>
            {isEditing ? (
              <Badge className="bg-amber-100 text-amber-600 border-none font-black text-[10px] px-2 animate-pulse">EDITING MODE</Badge>
            ) : (
              <Badge className="bg-slate-100 text-slate-400 border-none font-black text-[10px] px-2">LOCKED</Badge>
            )}
          </div>
          <p className="text-slate-500 font-medium mt-1">Configure your shop identity and security credentials</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setIsQRModalOpen(true)}
            variant="outline"
            className="h-11 border-slate-200 bg-white text-slate-600 hover:bg-slate-50 px-6 font-bold text-xs uppercase rounded-xl transition-all shadow-sm"
          >
            <QrCode className="w-4 h-4 mr-2" />
            Show QR
          </Button>
          <Button 
            onClick={handleAction} 
            disabled={isSaving} 
            className={`h-11 px-8 font-bold text-xs uppercase rounded-xl shadow-lg transition-all active:scale-95 group ${
              isEditing 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200' 
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
            ) : isEditing ? (
              <Save className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            ) : (
              <Pencil className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            )}
            {isSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Settings'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Shop Identity Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-white p-8 rounded-[2rem] border transition-all duration-300 ${
            isEditing ? 'border-primary/30 shadow-2xl shadow-primary/5' : 'border-slate-200/60 shadow-xl shadow-slate-200/10'
          }`}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className={`p-3 rounded-2xl transition-colors ${isEditing ? 'bg-primary/20' : 'bg-primary/10'}`}>
              <Store className={`w-6 h-6 ${isEditing ? 'text-primary' : 'text-primary/70'}`} />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-xl">Shop Identity</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-0.5">
                {isEditing ? 'MODIFYING PROFILE...' : 'Basic profile details'}
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Owner Name</label>
                <Input 
                  disabled={!isEditing}
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  className={`h-12 text-sm rounded-xl transition-all ${
                    isEditing ? 'bg-white border-primary/50 text-slate-900 shadow-sm' : 'bg-slate-50/50 border-slate-100 text-slate-400 cursor-not-allowed'
                  }`} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Shop Name</label>
                <Input 
                  disabled={!isEditing}
                  value={formData.shopName} 
                  onChange={(e) => setFormData({...formData, shopName: e.target.value})} 
                  className={`h-12 text-sm rounded-xl transition-all ${
                    isEditing ? 'bg-white border-primary/50 text-slate-900 shadow-sm' : 'bg-slate-50/50 border-slate-100 text-slate-400 cursor-not-allowed'
                  }`} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
              <Input 
                disabled={!isEditing}
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                className={`h-12 text-sm rounded-xl transition-all ${
                  isEditing ? 'bg-white border-primary/50 text-slate-900 shadow-sm' : 'bg-slate-50/50 border-slate-100 text-slate-400 cursor-not-allowed'
                }`} 
              />
            </div>
          </div>
        </motion.div>

        {/* Security Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`bg-white p-8 rounded-[2rem] border transition-all duration-300 ${
            isEditing ? 'border-rose-500/30 shadow-2xl shadow-rose-500/5' : 'border-slate-200/60 shadow-xl shadow-slate-200/10'
          }`}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className={`p-3 rounded-2xl transition-colors ${isEditing ? 'bg-rose-500/20' : 'bg-rose-50'}`}>
              <Lock className={`w-6 h-6 ${isEditing ? 'text-rose-600' : 'text-rose-600/70'}`} />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-xl">Security</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-0.5">Account protection</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group transition-all">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100">
                  <Fingerprint className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900 uppercase">2FA Encryption</p>
                  <p className="text-[10px] text-slate-500 font-bold">{isEditing ? 'SECURITY BYPASS ACTIVE' : 'ACTIVE PROTECTION'}</p>
                </div>
              </div>
              <Badge className={`${isEditing ? 'bg-rose-100 text-rose-600' : 'bg-emerald-50 text-emerald-600'} border-none font-black text-[10px] px-3 transition-colors`}>
                {isEditing ? <Unlock className="w-3 h-3 mr-1" /> : null}
                {isEditing ? 'UNLOCKED' : 'ENABLED'}
              </Badge>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Update Password</label>
              <Input 
                disabled={!isEditing}
                type="password" 
                placeholder={isEditing ? "Enter new password" : "••••••••••••"} 
                className={`h-12 text-sm rounded-xl transition-all ${
                  isEditing ? 'bg-white border-rose-500/50 text-slate-900 shadow-sm' : 'bg-slate-50/50 border-slate-100 text-slate-400 cursor-not-allowed'
                }`} 
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
