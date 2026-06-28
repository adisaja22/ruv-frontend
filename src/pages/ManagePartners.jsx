import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Plus, Edit2, Trash2, X, Save, Loader2, ArrowUp, ArrowDown, Upload, Link as LinkIcon, ArrowLeftRight 
} from 'lucide-react';
import { apiService, getStorageUrl } from '../services/api';
import { useToast } from '../hooks/useToast';

export const ManagePartners = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  // 1. Fetch partners
  const { data: partners, isLoading } = useQuery({
    queryKey: ['adminPartners'],
    queryFn: apiService.getAdminPartners,
  });

  const schema = z.object({
    nama: z.string().min(2, { message: 'Nama mitra minimal 2 karakter.' }).max(255),
    link: z.string().url({ message: 'Format URL web tidak valid (contoh: https://example.com).' }).nullable().or(z.literal('')),
    kategori: z.string().min(2, { message: 'Kategori minimal 2 karakter.' }).max(100).nullable().or(z.literal('')),
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  // Add Partner Mutation
  const addMutation = useMutation({
    mutationFn: apiService.createPartner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPartners'] });
      queryClient.invalidateQueries({ queryKey: ['publicPartners'] });
      addToast('Mitra bisnis berhasil ditambahkan!', 'success');
      closeModal();
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Gagal menambahkan mitra.', 'error');
    },
    onSettled: () => setSaving(false),
  });

  // Edit Partner Mutation
  const editMutation = useMutation({
    mutationFn: ({ id, formData }) => apiService.updatePartner(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPartners'] });
      queryClient.invalidateQueries({ queryKey: ['publicPartners'] });
      addToast('Mitra bisnis berhasil diperbarui!', 'success');
      closeModal();
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Gagal memperbarui mitra.', 'error');
    },
    onSettled: () => setSaving(false),
  });

  // Delete Partner Mutation
  const deleteMutation = useMutation({
    mutationFn: apiService.deletePartner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPartners'] });
      queryClient.invalidateQueries({ queryKey: ['publicPartners'] });
      addToast('Mitra bisnis berhasil dihapus!', 'success');
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Gagal menghapus mitra.', 'error');
    },
  });

  // Reorder Mutation
  const reorderMutation = useMutation({
    mutationFn: apiService.reorderPartners,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPartners'] });
      queryClient.invalidateQueries({ queryKey: ['publicPartners'] });
      addToast('Urutan mitra berhasil diperbarui!', 'success');
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        addToast('Ukuran file logo maksimal 2MB.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openAddModal = () => {
    setEditingPartner(null);
    setPreview(null);
    reset({
      nama: '',
      link: '',
      kategori: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (partner) => {
    setEditingPartner(partner);
    if (partner.logo_path) {
      setPreview(getStorageUrl(partner.logo_path));
    } else {
      setPreview(null);
    }
    reset({
      nama: partner.nama,
      link: partner.link || '',
      kategori: partner.kategori || '',
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingPartner(null);
    setPreview(null);
    reset();
  };

  const onSubmit = (formData) => {
    const file = fileInputRef.current?.files[0];
    
    if (!editingPartner && !file) {
      addToast('Silakan pilih file logo mitra.', 'error');
      return;
    }

    setSaving(true);
    const dataPayload = new FormData();
    dataPayload.append('nama', formData.nama);
    dataPayload.append('link', formData.link || '');
    dataPayload.append('kategori', formData.kategori || '');
    
    if (file) {
      dataPayload.append('logo', file);
    }

    if (editingPartner) {
      editMutation.mutate({ id: editingPartner.id, formData: dataPayload });
    } else {
      addMutation.mutate(dataPayload);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus mitra ini?')) {
      deleteMutation.mutate(id);
    }
  };

  // Reorder up/down helper
  const handleMove = (index, direction) => {
    if (!partners) return;
    const newPartners = [...partners];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newPartners.length) return;

    // Swap
    const temp = newPartners[index];
    newPartners[index] = newPartners[targetIndex];
    newPartners[targetIndex] = temp;

    const ids = newPartners.map(p => p.id);
    reorderMutation.mutate(ids);
  };

  const doublePartners = [...(partners || []), ...(partners || []), ...(partners || [])];

  return (
    <div className="flex flex-col gap-6 text-left font-body">
      <div className="flex justify-between items-center">
        <h3 className="font-heading text-lg font-bold text-neutral-900">Daftar Mitra RUV</h3>
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-primary text-neutral-900 text-sm font-bold rounded-lg shadow-soft flex items-center gap-2 hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah Mitra
        </button>
      </div>

      {/* Live Preview Marquee */}
      {partners && partners.length > 0 && (
        <div className="bg-white border border-neutral-200 rounded-modal shadow-soft p-6 flex flex-col gap-4">
          <h4 className="font-heading text-sm font-bold text-neutral-900 border-b border-neutral-100 pb-2">
            Pratinjau Live Carousel Mitra (Scrolling Kanan)
          </h4>
          <div className="relative w-full overflow-hidden bg-neutral-50 py-4 border border-neutral-200 rounded-card">
            <div className="animate-marquee-right flex gap-6">
              {doublePartners.map((partner, index) => {
                const imageURL = getStorageUrl(partner.logo_path);

                return (
                  <div 
                    key={`${partner.id}-preview-${index}`}
                    className="flex items-center gap-3 px-6 py-2 bg-white border border-neutral-200 rounded-lg shadow-soft w-64 shrink-0"
                  >
                    <div className="w-10 h-8 bg-neutral-50 rounded border border-neutral-200 overflow-hidden flex items-center justify-center shrink-0">
                      <img src={imageURL} alt="" className="max-w-full max-h-full object-contain p-0.5" />
                    </div>
                    <div className="flex flex-col overflow-hidden text-left">
                      <span className="font-heading text-xs font-bold text-neutral-900 truncate">{partner.nama}</span>
                      <span className="text-[9px] text-primary font-bold uppercase tracking-wider truncate">{partner.kategori || 'Mitra'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Grid of Partners List */}
      <div className="bg-white border border-neutral-200 rounded-modal shadow-soft p-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="text-sm text-neutral-500">Memuat data mitra...</span>
          </div>
        ) : (partners || []).length === 0 ? (
          <div className="text-center py-20">
            <ArrowLeftRight className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h4 className="font-heading text-base font-bold text-neutral-700">Belum ada mitra terdaftar</h4>
            <p className="text-xs text-neutral-400 mt-1">Gunakan tombol tambah untuk mendaftarkan mitra bisnis pertama.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {(partners || []).map((partner, index) => {
              const imageURL = getStorageUrl(partner.logo_path);

              return (
                <div
                  key={partner.id}
                  className="flex items-center justify-between p-4 bg-neutral-50 rounded-card border border-neutral-200 shadow-soft hover:bg-neutral-100/50 transition-all"
                >
                  {/* Left: Info & Logo */}
                  <div className="flex items-center gap-4">
                    {/* Logo Box */}
                    <div className="w-16 h-12 bg-white rounded border border-neutral-200 overflow-hidden flex items-center justify-center">
                      <img src={imageURL} alt={partner.nama} className="max-w-full max-h-full object-contain p-1" />
                    </div>

                    <div className="flex flex-col text-left">
                      <span className="font-heading text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                        {partner.nama}
                        {partner.link && (
                          <a href={partner.link} target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-neutral-700">
                            <LinkIcon className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </span>
                      <span className="font-body text-xs text-neutral-500">{partner.kategori || 'Kategori Umum'}</span>
                    </div>
                  </div>

                  {/* Right: Actions & Sorting */}
                  <div className="flex items-center gap-3">
                    {/* Sorting Buttons */}
                    <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => handleMove(index, 'up')}
                        disabled={index === 0}
                        className="p-2 hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent text-neutral-600 transition-colors"
                        aria-label="Pindahkan ke atas"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMove(index, 'down')}
                        disabled={index === (partners || []).length - 1}
                        className="p-2 border-l border-neutral-200 hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent text-neutral-600 transition-colors"
                        aria-label="Pindahkan ke bawah"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Edit & Delete */}
                    <button
                      onClick={() => openEditModal(partner)}
                      className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors border border-neutral-200 bg-white"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(partner.id)}
                      className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors border border-error/20 bg-white"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CRUD MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div onClick={closeModal} className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" />
          
          <div className="relative w-full max-w-md bg-white rounded-modal shadow-xl border border-neutral-200 overflow-hidden z-10 animate-modal-in">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-100">
              <h3 className="font-heading text-base font-bold text-neutral-900">
                {editingPartner ? 'Ubah Mitra Bisnis' : 'Tambah Mitra Bisnis'}
              </h3>
              <button onClick={closeModal} className="text-neutral-400 hover:text-neutral-700 p-1 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-4">
              
              {/* Nama */}
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-xs font-semibold text-neutral-900">Nama Mitra Bisnis</label>
                <input
                  type="text"
                  placeholder="Contoh: PT Bumi Daur Ulang"
                  {...register('nama')}
                  className={`px-4 py-2 bg-white border rounded-lg font-body text-sm focus:outline-none transition-all ${
                    errors.nama ? 'border-error' : 'border-neutral-200 focus:border-secondary'
                  }`}
                />
                {errors.nama && <span className="text-xs text-error font-medium">{errors.nama.message}</span>}
              </div>

              {/* Kategori */}
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-xs font-semibold text-neutral-900">Kategori Mitra (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: Industri Daur Ulang"
                  {...register('kategori')}
                  className={`px-4 py-2 bg-white border rounded-lg font-body text-sm focus:outline-none transition-all ${
                    errors.kategori ? 'border-error' : 'border-neutral-200 focus:border-secondary'
                  }`}
                />
                {errors.kategori && <span className="text-xs text-error font-medium">{errors.kategori.message}</span>}
              </div>

              {/* Link Website */}
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-xs font-semibold text-neutral-900">Link Web Mitra (Opsional)</label>
                <input
                  type="text"
                  placeholder="https://example.com"
                  {...register('link')}
                  className={`px-4 py-2 bg-white border rounded-lg font-body text-sm focus:outline-none transition-all ${
                    errors.link ? 'border-error' : 'border-neutral-200 focus:border-secondary'
                  }`}
                />
                {errors.link && <span className="text-xs text-error font-medium">{errors.link.message}</span>}
              </div>

              {/* Logo Upload */}
              <div className="flex flex-col gap-2 mt-2">
                <label className="font-body text-xs font-semibold text-neutral-900">Logo Mitra</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-16 bg-neutral-50 rounded-lg border-2 border-dashed border-neutral-300 flex items-center justify-center overflow-hidden shrink-0">
                    {preview ? (
                      <img src={preview} alt="Preview" className="w-full h-full object-contain p-1" />
                    ) : (
                      <Upload className="w-5 h-5 text-neutral-400" />
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-1 items-start">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded text-neutral-700 text-xs font-semibold transition-colors"
                    >
                      Pilih Gambar Logo
                    </button>
                    <span className="text-[10px] text-neutral-400">Rekomendasi rasio 4:3, maks 2MB.</span>
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/jpg,image/svg+xml,image/webp"
                  className="hidden"
                />
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
                  className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-400 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Simpan Mitra
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default ManagePartners;
