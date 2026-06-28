import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Plus, Search, Edit2, Trash2, X, Save, Loader2, ShoppingBag, ArrowUp, ArrowDown
} from 'lucide-react';
import { apiService } from '../services/api';
import { useToast } from '../hooks/useToast';

export const ManageProducts = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);

  // 1. Fetch products list
  const { data: products, isLoading } = useQuery({
    queryKey: ['adminProducts'],
    queryFn: apiService.getAdminProducts,
  });

  // 2. Setup Validation Schema using Zod
  const schema = z.object({
    nama: z.string().min(2, { message: 'Nama produk minimal 2 karakter.' }).max(255),
    harga: z.coerce.number().int().min(0, { message: 'Harga harus angka positif.' }),
    satuan: z.enum(['Kg', 'Unit'], { errorMap: () => ({ message: 'Pilih satuan Kg atau Unit.' }) }),
    kategori: z.enum(['Plastik', 'Besi', 'Elektronik', 'Kertas', 'Logam'], {
      errorMap: () => ({ message: 'Kategori tidak valid.' }),
    }),
    perubahan_harga: z.string().nullable().or(z.literal('')),
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  // Watch fields for live preview in the modal
  const watchNama = watch('nama');
  const watchHarga = watch('harga');
  const watchSatuan = watch('satuan');
  const watchKategori = watch('kategori');
  const watchPerubahan = watch('perubahan_harga');

  // Add Product Mutation
  const addMutation = useMutation({
    mutationFn: apiService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      queryClient.invalidateQueries({ queryKey: ['publicProducts'] });
      addToast('Produk berhasil ditambahkan!', 'success');
      closeModal();
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Gagal menambahkan produk.', 'error');
    },
    onSettled: () => setSaving(false),
  });

  // Edit Product Mutation
  const editMutation = useMutation({
    mutationFn: ({ id, data }) => apiService.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      queryClient.invalidateQueries({ queryKey: ['publicProducts'] });
      addToast('Produk berhasil diperbarui!', 'success');
      closeModal();
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Gagal memperbarui produk.', 'error');
    },
    onSettled: () => setSaving(false),
  });

  // Delete Product Mutation
  const deleteMutation = useMutation({
    mutationFn: apiService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      queryClient.invalidateQueries({ queryKey: ['publicProducts'] });
      addToast('Produk berhasil dihapus!', 'success');
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Gagal menghapus produk.', 'error');
    },
  });

  const openAddModal = () => {
    setEditingProduct(null);
    reset({
      nama: '',
      harga: 0,
      satuan: 'Kg',
      kategori: 'Plastik',
      perubahan_harga: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    reset({
      nama: product.nama,
      harga: product.harga,
      satuan: product.satuan,
      kategori: product.kategori,
      perubahan_harga: product.perubahan_harga || '',
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
    reset();
  };

  const onSubmit = (formData) => {
    setSaving(true);
    if (editingProduct) {
      editMutation.mutate({ id: editingProduct.id, data: formData });
    } else {
      addMutation.mutate(formData);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      deleteMutation.mutate(id);
    }
  };

  // Filter products list based on search and category
  const filteredProducts = (products || []).filter((prod) => {
    const matchesSearch = prod.nama.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'Semua' || prod.kategori === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Helper for category badge styling in table/preview
  const getBadgeStyle = (category) => {
    switch (category) {
      case 'Plastik':
        return 'bg-secondary/15 text-neutral-900 border-secondary/30';
      case 'Besi':
        return 'bg-neutral-200/60 text-neutral-700 border-neutral-300';
      case 'Elektronik':
        return 'bg-orange-500/10 text-orange-700 border-orange-500/20';
      case 'Kertas':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20';
      case 'Logam':
        return 'bg-primary/20 text-neutral-900 border-primary/30';
      default:
        return 'bg-neutral-100 text-neutral-600 border-neutral-200';
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left font-body">
      
      {/* Search & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-3.5 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Cari nama produk rongsok..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-secondary transition-all"
          />
        </div>

        {/* Filters and Button */}
        <div className="flex items-center gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none cursor-pointer"
          >
            <option value="Semua">Semua Kategori</option>
            <option value="Plastik">Plastik</option>
            <option value="Besi">Besi</option>
            <option value="Elektronik">Elektronik</option>
            <option value="Kertas">Kertas</option>
            <option value="Logam">Logam</option>
          </select>

          <button
            onClick={openAddModal}
            className="px-5 py-2.5 bg-primary text-neutral-900 text-sm font-bold rounded-lg shadow-soft flex items-center gap-2 hover:bg-primary-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah Produk
          </button>
        </div>
      </div>

      {/* Table List Card */}
      <div className="bg-white border border-neutral-200 rounded-modal shadow-soft overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="text-sm text-neutral-500">Memuat data produk...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h4 className="font-heading text-base font-bold text-neutral-700">Produk tidak ditemukan</h4>
            <p className="text-xs text-neutral-400 mt-1">Periksa kembali pencarian atau kategori Anda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-neutral-100 border-b border-neutral-200">
                  <th className="px-6 py-4 font-heading text-xs font-bold text-neutral-900 text-left uppercase tracking-wider">Nama Produk</th>
                  <th className="px-6 py-4 font-heading text-xs font-bold text-neutral-900 text-left uppercase tracking-wider">Kategori</th>
                  <th className="px-6 py-4 font-heading text-xs font-bold text-neutral-900 text-left uppercase tracking-wider">Harga Beli</th>
                  <th className="px-6 py-4 font-heading text-xs font-bold text-neutral-900 text-left uppercase tracking-wider">Perubahan Harga</th>
                  <th className="px-6 py-4 font-heading text-xs font-bold text-neutral-900 text-center uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((prod) => {
                  const isUp = typeof prod.perubahan_harga === 'string' && prod.perubahan_harga.includes('+');
                  const isDown = typeof prod.perubahan_harga === 'string' && prod.perubahan_harga.includes('-');

                  return (
                    <tr key={prod.id} className="border-b border-neutral-200 hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-neutral-900">{prod.nama}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider ${getBadgeStyle(prod.kategori)}`}>
                          {prod.kategori}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-neutral-900">
                        Rp {prod.harga.toLocaleString('id-ID')} <span className="text-neutral-400 font-normal">/ {prod.satuan}</span>
                      </td>
                      <td className="px-6 py-4">
                        {prod.perubahan_harga ? (
                          <span className={`inline-flex items-center gap-1 text-xs font-extrabold px-2 py-0.5 rounded ${
                            isUp ? 'bg-success/15 text-success' : isDown ? 'bg-error/15 text-error' : 'bg-neutral-100 text-neutral-500'
                          }`}>
                            {isUp ? <ArrowUp className="w-3 h-3" /> : isDown ? <ArrowDown className="w-3 h-3" /> : null}
                            {prod.perubahan_harga}
                          </span>
                        ) : (
                          <span className="text-neutral-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 flex items-center justify-center gap-3">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors border border-neutral-200 bg-white"
                          aria-label="Edit produk"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id)}
                          className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors border border-error/20 bg-white"
                          aria-label="Hapus produk"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CRUD MODAL DIALOG WITH SIDE PREVIEW */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div onClick={closeModal} className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" />
          
          <div className="relative w-full max-w-2xl bg-white rounded-modal shadow-xl border border-neutral-200 overflow-hidden z-10 animate-modal-in flex flex-col md:flex-row">
            
            {/* Left: Input Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="w-full md:w-7/12 p-6 flex flex-col gap-4 border-r border-neutral-100">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2 mb-1">
                <h3 className="font-heading text-base font-bold text-neutral-900">
                  {editingProduct ? 'Ubah / Edit Produk' : 'Tambah Produk Baru'}
                </h3>
              </div>

              {/* Nama */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-bold text-neutral-900">Nama Produk</label>
                <input
                  type="text"
                  placeholder="Contoh: Botol PET Bersih"
                  {...register('nama')}
                  className={`px-4 py-2 bg-white border rounded-lg text-sm focus:outline-none transition-all ${
                    errors.nama ? 'border-error' : 'border-neutral-200 focus:border-secondary'
                  }`}
                />
                {errors.nama && <span className="text-[10px] text-error font-semibold">{errors.nama.message}</span>}
              </div>

              {/* Kategori & Satuan */}
              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-neutral-900">Kategori</label>
                  <select
                    {...register('kategori')}
                    className="px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-secondary cursor-pointer"
                  >
                    <option value="Plastik">Plastik</option>
                    <option value="Besi">Besi</option>
                    <option value="Elektronik">Elektronik</option>
                    <option value="Kertas">Kertas</option>
                    <option value="Logam">Logam</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-neutral-900">Satuan Beli</label>
                  <select
                    {...register('satuan')}
                    className="px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-secondary cursor-pointer"
                  >
                    <option value="Kg">Per Kg (/Kg)</option>
                    <option value="Unit">Per Unit (/Unit)</option>
                  </select>
                </div>
              </div>

              {/* Harga */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-bold text-neutral-900">Harga Beli (Rp)</label>
                <input
                  type="number"
                  placeholder="Contoh: 4500"
                  {...register('harga')}
                  className={`px-4 py-2 bg-white border rounded-lg text-sm focus:outline-none transition-all ${
                    errors.harga ? 'border-error' : 'border-neutral-200 focus:border-secondary'
                  }`}
                />
                {errors.harga && <span className="text-[10px] text-error font-semibold">{errors.harga.message}</span>}
              </div>

              {/* Perubahan Harga */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-bold text-neutral-900">Keterangan Perubahan Harga (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: +Rp 300 atau -Rp 500"
                  {...register('perubahan_harga')}
                  className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-secondary"
                />
                <span className="text-[9px] text-neutral-400">Gunakan tanda + untuk kenaikan harga, - untuk penurunan.</span>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 mt-4 border-t border-neutral-100 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-neutral-200 rounded-lg text-neutral-700 text-xs font-semibold hover:bg-neutral-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-200 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Simpan Produk
                </button>
              </div>
            </form>

            {/* Right: Live Mock Card Preview */}
            <div className="w-full md:w-5/12 bg-neutral-50 p-6 flex flex-col justify-center items-center relative">
              <button 
                type="button"
                onClick={closeModal} 
                className="absolute top-2 right-2 text-neutral-400 hover:text-neutral-700 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-6">
                Live Card Catalog Preview
              </span>

              {/* Live Preview Card */}
              <div className="w-full max-w-[240px] p-6 bg-white border border-neutral-200 rounded-card shadow-soft text-left flex flex-col justify-between h-48">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider ${getBadgeStyle(watchKategori || 'Plastik')}`}>
                      {watchKategori || 'Plastik'}
                    </span>
                    
                    {/* Price shift symbol */}
                    {watchPerubahan && (
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded flex items-center gap-0.5 ${
                        watchPerubahan.includes('+') ? 'bg-success/15 text-success' : watchPerubahan.includes('-') ? 'bg-error/15 text-error' : 'bg-neutral-100 text-neutral-500'
                      }`}>
                        {watchPerubahan.includes('+') ? <ArrowUp className="w-3 h-3" /> : watchPerubahan.includes('-') ? <ArrowDown className="w-3 h-3" /> : null}
                        {watchPerubahan}
                      </span>
                    )}
                  </div>
                  <h4 className="font-heading text-sm font-bold text-neutral-900 leading-tight">
                    {watchNama || 'Nama Produk Rongsok'}
                  </h4>
                </div>

                <div className="border-t border-neutral-100 pt-3 flex items-end justify-between">
                  <div className="flex flex-col text-left">
                    <span className="text-[8px] text-neutral-400 uppercase tracking-widest font-bold">Harga Beli</span>
                    <span className="font-heading text-base font-bold text-neutral-900 mt-0.5">
                      Rp {parseInt(watchHarga || 0).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <span className="font-body text-[10px] text-neutral-500">/ {watchSatuan || 'Kg'}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
export default ManageProducts;
