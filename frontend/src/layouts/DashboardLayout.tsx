import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/shared/Sidebar';
import { Navbar } from '@/components/shared/Navbar';

export default function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50/50">
      {/* Sidebar - Pinned and non-scrolling */}
      <Sidebar />

      {/* Main Content Area - Scrollable but contained */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
          <div className="p-4 lg:p-6 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
