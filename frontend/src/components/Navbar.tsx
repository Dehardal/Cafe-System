import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../redux/slices/authSlice';
import type { RootState } from '../redux/store';
import { Printer, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setMobileOpen(false);
  };

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-sky-500 rounded-xl blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
              <div className="relative bg-gradient-to-br from-sky-400 to-sky-600 p-2 rounded-xl shadow-lg">
                <Printer className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className="text-[1.1rem] font-black tracking-tight text-white hidden sm:block">
              Quick<span className="text-sky-400">Print</span> QR
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive('/dashboard')
                      ? 'bg-sky-500/15 text-sky-400 border border-sky-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>

                <div className="w-px h-6 bg-white/10 mx-2" />

                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-violet-500 flex items-center justify-center text-[11px] font-black text-white shadow-lg">
                      {initials}
                    </div>
                    <div className="hidden lg:flex flex-col">
                      <span className="text-[13px] font-bold text-white leading-none">{user.name}</span>
                      <span className="text-[10px] font-semibold text-sky-400 uppercase tracking-widest leading-none mt-0.5">{user.shopName}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-sky-500/20 hover:shadow-sky-400/30"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="fixed top-16 left-0 right-0 z-40 glass-nav border-t border-white/[0.06] px-5 py-4 space-y-2 md:hidden"
          >
            {user ? (
              <>
                <div className="flex items-center gap-3 p-3 bg-white/[0.04] rounded-xl mb-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-violet-500 flex items-center justify-center text-xs font-black text-white">
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{user.name}</p>
                    <p className="text-[11px] font-semibold text-sky-400 uppercase tracking-widest">{user.shopName}</p>
                  </div>
                </div>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="sidebar-item w-full"
                >
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="sidebar-item w-full text-red-400 hover:text-red-300 hover:bg-red-400/[0.08]"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="sidebar-item w-full">
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary w-full justify-center py-3 rounded-xl"
                >
                  Get Started
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
