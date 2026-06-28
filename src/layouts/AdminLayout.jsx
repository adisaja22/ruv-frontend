import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Home, MessageSquare, BarChart3, ShoppingBag, 
  Users, Mail, FileText, Recycle, LogOut, ArrowLeftRight, Star
} from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { apiService } from '../services/api';

export const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();
  const [user, setUser] = useState(null);

  // Check auth token
  useEffect(() => {
    const token = localStorage.getItem('ruv_admin_token');
    const userData = localStorage.getItem('ruv_admin_user');
    
    if (!token || !userData) {
      addToast('Sesi Anda habis atau belum login.', 'error');
      navigate('/admin/login');
    } else {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        localStorage.removeItem('ruv_admin_token');
        localStorage.removeItem('ruv_admin_user');
        addToast('Sesi tidak valid. Silakan login kembali.', 'error');
        navigate('/admin/login');
      }
    }
  }, [navigate, addToast]);

  const handleLogout = async () => {
    try {
      await apiService.logout();
    } catch (err) {
      // Invalidate locally anyway on failure
    } finally {
      localStorage.removeItem('ruv_admin_token');
      localStorage.removeItem('ruv_admin_user');
      addToast('Anda berhasil keluar dari sistem.', 'success');
      navigate('/admin/login');
    }
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Edit Beranda', path: '/admin/homepage', icon: Home },
    { name: 'Form Penjualan', path: '/admin/form', icon: MessageSquare },
    { name: 'Statistik', path: '/admin/statistics', icon: BarChart3 },
    { name: 'Kelola Produk', path: '/admin/products', icon: ShoppingBag },
    { name: 'Kelola Mitra', path: '/admin/partners', icon: ArrowLeftRight },
    { name: 'Kelola Testimoni', path: '/admin/testimonials', icon: Star },
    { name: 'Edit Kontak', path: '/admin/contact', icon: Mail },
    { name: 'Edit Tentang Kami', path: '/admin/about', icon: FileText },
    { name: 'Kelola User & Admin', path: '/admin/users', icon: Users, role: 'administrator' },
  ];

  const currentPath = location.pathname;

  return (
    <div className="min-h-screen flex bg-neutral-100 font-body">
      {/* Sidebar Persisten */}
      <aside className="w-64 bg-neutral-900 text-white shrink-0 flex flex-col justify-between py-6 border-r border-neutral-800">
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 px-6 group">
            <Recycle className="w-6 h-6 text-primary" />
            <span className="font-heading text-lg font-bold tracking-tight text-white">
              RUV <span className="text-xs font-semibold text-neutral-500">Admin</span>
            </span>
          </Link>

          {/* Menus */}
          <nav className="flex flex-col gap-1 px-4">
            {menuItems.map((item) => {
              // Hide menu if user role is not allowed
              if (item.role && user?.role !== item.role) return null;

              const Icon = item.icon;
              const active = currentPath === item.path;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                    active 
                      ? 'bg-primary text-neutral-900 shadow-soft' 
                      : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar */}
        <div className="flex flex-col gap-3 px-4 pt-4 border-t border-neutral-800">
          <div className="flex flex-col text-left px-4">
            <span className="text-xs text-neutral-400 font-bold leading-none">{user?.name || 'Admin'}</span>
            <span className="text-[10px] text-neutral-500 uppercase mt-1 tracking-wider leading-none font-medium">{user?.role || 'Administrator'}</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold text-error hover:bg-error/10 hover:text-error transition-all"
          >
            <LogOut className="w-4 h-4" />
            Keluar / Logout
          </button>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header Panel */}
        <header className="h-16 bg-white border-b border-neutral-200 px-8 flex items-center justify-between shadow-soft shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-heading text-lg font-bold text-neutral-900 uppercase">
              {menuItems.find(m => m.path === currentPath)?.name || 'Admin Panel'}
            </span>
          </div>
          <Link
            to="/"
            target="_blank"
            className="text-xs text-neutral-600 hover:text-neutral-900 border border-neutral-200 px-3 py-1.5 rounded-lg transition-colors font-medium"
          >
            Lihat Website Publik &rarr;
          </Link>
        </header>

        {/* Content Box */}
        <main className="flex-grow p-8 overflow-y-auto bg-neutral-100">
          {children}
        </main>
      </div>
    </div>
  );
};
export default AdminLayout;
