import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, ArrowLeftRight, Star, Users, 
  Settings, BookOpen, Recycle, ArrowRight, Loader2 
} from 'lucide-react';
import { apiService } from '../services/api';

export const AdminDashboard = () => {
  // Fetch Stats
  const { data, isLoading, error } = useQuery({
    queryKey: ['adminStats'],
    queryFn: apiService.getDashboardStats,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <span className="font-body text-sm text-neutral-500">Memuat data dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error/10 border border-error/20 p-6 rounded-card text-left">
        <h3 className="font-heading text-lg font-bold text-error">Gagal Memuat Data</h3>
        <p className="font-body text-sm text-neutral-700 mt-1">
          Terjadi kesalahan saat memuat dashboard. Periksa koneksi API Anda.
        </p>
      </div>
    );
  }

  const customStats = data?.custom_stats || { mitra: 0, kg_barang: 0, transaksi_harian: 0 };

  const summaryCards = [
    { name: 'Katalog Produk', count: data?.products_count || 0, icon: ShoppingBag, color: 'bg-primary/20 text-neutral-900 border-primary/30', path: '/admin/products' },
    { name: 'Mitra Bisnis', count: data?.partners_count || 0, icon: ArrowLeftRight, color: 'bg-secondary/20 text-neutral-900 border-secondary/30', path: '/admin/partners' },
    { name: 'Testimoni Pelanggan', count: data?.testimonials_count || 0, icon: Star, color: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20', path: '/admin/testimonials' },
    { name: 'User & Admin', count: data?.users_count || 0, icon: Users, color: 'bg-indigo-500/10 text-indigo-700 border-indigo-500/20', path: '/admin/users' },
  ];

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* Welcome Banner */}
      <div className="p-8 bg-gradient-brand rounded-modal border border-neutral-200 shadow-soft relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute inset-0 bg-white/45 backdrop-blur-[1px] pointer-events-none" />
        <div className="flex flex-col gap-2 relative z-10">
          <h2 className="font-heading text-2xl font-bold text-neutral-900">Halo, Administrator RUV!</h2>
          <p className="font-body text-sm text-neutral-700 max-w-xl">
            Selamat datang di Portal Admin. Di sini Anda dapat mengelola seluruh konten halaman publik mulai dari harga katalog produk, mitra kerja sama, testimoni, hingga statistik penjualan harian.
          </p>
        </div>
        <div className="relative z-10 shrink-0">
          <Link
            to="/admin/homepage"
            className="px-5 py-3 bg-neutral-900 text-white hover:bg-neutral-800 font-body text-xs font-bold rounded-lg shadow-soft transition-colors flex items-center gap-2"
          >
            Edit Konten Beranda
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Summary Widgets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.name}
              to={card.path}
              className="p-6 bg-white border border-neutral-200 rounded-card shadow-soft hover:shadow-hover hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-between"
            >
              <div className="flex flex-col gap-1">
                <span className="font-body text-xs font-semibold text-neutral-400">{card.name}</span>
                <span className="font-heading text-3xl font-extrabold text-neutral-900">{card.count}</span>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick guides & Live statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Live stats section */}
        <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-modal shadow-soft p-6 flex flex-col gap-6">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
            <Recycle className="w-5 h-5 text-primary" />
            <h3 className="font-heading text-base font-bold text-neutral-900">Statistik Halaman Publik</h3>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center py-2.5 border-b border-neutral-50">
              <span className="font-body text-sm font-medium text-neutral-700">Mitra Bisnis Aktif</span>
              <span className="font-heading text-lg font-bold text-neutral-900">{customStats.mitra}</span>
            </div>
            <div className="flex justify-between items-center py-2.5 border-b border-neutral-50">
              <span className="font-body text-sm font-medium text-neutral-700">Berat Barang Terkumpul</span>
              <span className="font-heading text-lg font-bold text-neutral-900">{customStats.kg_barang.toLocaleString('id-ID')} Kg</span>
            </div>
            <div className="flex justify-between items-center py-2.5">
              <span className="font-body text-sm font-medium text-neutral-700">Transaksi Harian</span>
              <span className="font-heading text-lg font-bold text-neutral-900">{customStats.transaksi_harian}</span>
            </div>
          </div>
          
          <Link
            to="/admin/statistics"
            className="w-full text-center py-2.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-700 font-body text-xs font-bold rounded-lg transition-colors block mt-2"
          >
            Ubah Angka Statistik
          </Link>
        </div>

        {/* Quick guide section */}
        <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-modal shadow-soft p-6 flex flex-col gap-6">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
            <BookOpen className="w-5 h-5 text-secondary" />
            <h3 className="font-heading text-base font-bold text-neutral-900">Panduan Cepat Admin</h3>
          </div>

          <div className="flex flex-col gap-4 font-body text-sm text-neutral-700">
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-xs font-bold shrink-0">1</span>
              <p>
                <strong>Mengubah Harga Produk:</strong> Buka menu <Link to="/admin/products" className="text-secondary hover:underline font-semibold">Kelola Produk</Link>, klik edit pada produk yang diinginkan untuk mengubah harga beli /Kg atau /Unit.
              </p>
            </div>
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-xs font-bold shrink-0">2</span>
              <p>
                <strong>Menambahkan Testimoni Baru:</strong> Buka menu <Link to="/admin/testimonials" className="text-secondary hover:underline font-semibold">Kelola Testimoni</Link> untuk menginput kepuasan pelanggan terpilih yang ingin ditampilkan ke publik.
              </p>
            </div>
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-xs font-bold shrink-0">3</span>
              <p>
                <strong>Ubah Alamat / Kontak:</strong> Klik menu <Link to="/admin/contact" className="text-secondary hover:underline font-semibold">Edit Kontak</Link> untuk memperbarui maps url, nomor WA admin tujuan form, alamat fisik, dan sosial media.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
