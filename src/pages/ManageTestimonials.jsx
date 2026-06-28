import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Plus, Edit2, Trash2, X, Save, Loader2, Star, Upload 
} from 'lucide-react';
import { apiService, getStorageUrl } from '../services/api';
import { useToast } from '../hooks/useToast';

export const ManageTestimonials = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(null);
  const [textLength, setTextLength] = useState(0);
  const fileInputRef = useRef(null);

  // 1. Fetch testimonials
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['adminTestimonials'],
    queryFn: apiService.getAdminTestimonials,
  });

  const schema = z.object({
    nama: z.string().min(2, { message: 'Nama minimal 2 karakter.' }).max(255),
    jabatan: z.string().min(2, { message: 'Jabatan/asal minimal 2 karakter.' }).max(255).nullable().or(z.literal('')),
    rating: z.coerce.number().int().min(1).max(5),
    isi: z.string().min(10, { message: 'Isi testimoni minimal 10 karakter.' }).max(300, {
      message: 'Maksimal testimoni adalah 300 karakter.',
    }),
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

  // Add Mutation
  const addMutation = useMutation({
    mutationFn: apiService.createTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTestimonials'] });
      queryClient.invalidateQueries({ queryKey: ['publicTestimonials'] });
      addToast('Testimoni berhasil ditambahkan!', 'success');
      closeModal();
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Gagal menambahkan testimoni.', 'error');
    },
    onSettled: () => setSaving(false),
  });

  // Edit Mutation
  const editMutation = useMutation({
    mutationFn: ({ id, formData }) => apiService.updateTestimonial(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTestimonials'] });
      queryClient.invalidateQueries({ queryKey: ['publicTestimonials'] });
      addToast('Testimoni berhasil diperbarui!', 'success');
      closeModal();
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Gagal memperbarui testimoni.', 'error');
    },
    onSettled: () => setSaving(false),
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: apiService.deleteTestimonial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTestimonials'] });
      queryClient.invalidateQueries({ queryKey: ['publicTestimonials'] });
      addToast('Testimoni berhasil dihapus!', 'success');
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Gagal menghapus testimoni.', 'error');
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        addToast('Ukuran foto profil maksimal 2MB.', 'error');
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
    setEditingTestimonial(null);
    setPreview(null);
    setTextLength(0);
    reset({
      nama: '',
      jabatan: '',
      rating: 5,
      isi: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingTestimonial(item);
    setTextLength(item.isi.length);
    if (item.foto_path) {
      setPreview(getStorageUrl(item.foto_path));
    } else {
      setPreview(null);
    }
    reset({
      nama: item.nama,
      jabatan: item.jabatan || '',
      rating: item.rating,
      isi: item.isi,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTestimonial(null);
    setPreview(null);
    setTextLength(0);
    reset();
  };

  const onSubmit = (formData) => {
    setSaving(true);
    
    const dataPayload = new FormData();
    dataPayload.append('nama', formData.nama);
    dataPayload.append('jabatan', formData.jabatan || '');
    dataPayload.append('rating', formData.rating);
    dataPayload.append('isi', formData.isi);
    
    const file = fileInputRef.current?.files[0];
    if (file) {
      dataPayload.append('foto', file);
    }

    if (editingTestimonial) {
      editMutation.mutate({ id: editingTestimonial.id, formData: dataPayload });
    } else {
      addMutation.mutate(dataPayload);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus testimoni ini?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex justify-between items-center">
        <h3 className="font-heading text-lg font-bold text-neutral-900">Kelola Testimoni</h3>
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-primary text-neutral-900 font-body text-sm font-bold rounded-lg shadow-soft flex items-center gap-2 hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah Testimoni
        </button>
      </div>

      {/* Grid of Testimonials */}
      <div className="bg-white border border-neutral-200 rounded-modal shadow-soft p-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="font-body text-sm text-neutral-500">Memuat data testimoni...</span>
          </div>
        ) : (testimonials || []).length === 0 ? (
          <div className="text-center py-20">
            <Star className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h4 className="font-heading text-base font-bold text-neutral-700">Belum ada testimoni</h4>
            <p className="font-body text-xs text-neutral-400 mt-1">Gunakan tombol tambah untuk menginput testimoni pertama.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(testimonials || []).map((item) => {
              const imageURL = item.foto_path
                ? getStorageUrl(item.foto_path)
                : null;

              return (
                <div
                  key={item.id}
                  className="p-6 bg-neutral-50 rounded-card border border-neutral-200 shadow-soft flex flex-col justify-between gap-4"
                >
                  <div>
                    {/* Stars */}
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < item.rating ? 'text-warning fill-warning' : 'text-neutral-200'}`} />
                      ))}
                    </div>
                    <p className="font-body text-sm text-neutral-700 leading-relaxed italic">"{item.isi}"</p>
                  </div>

                  {/* Profile info & action */}
                  <div className="flex items-center justify-between border-t border-neutral-200 pt-4 mt-2">
                    <div className="flex items-center gap-3">
                      {imageURL ? (
                        <img src={imageURL} alt={item.nama} className="w-10 h-10 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center font-heading font-bold text-neutral-600 text-sm shrink-0 uppercase">
                          {item.nama.substring(0, 2)}
                        </div>
                      )}
                      <div className="flex flex-col text-left">
                        <span className="font-heading text-sm font-bold text-neutral-900">{item.nama}</span>
                        <span className="font-body text-[10px] text-neutral-400 font-semibold">{item.jabatan || 'Pelanggan RUV'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 text-neutral-600 hover:bg-neutral-200 rounded-lg transition-colors border border-neutral-200 bg-white"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors border border-error/20 bg-white"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
                {editingTestimonial ? 'Ubah Testimoni' : 'Tambah Testimoni'}
              </h3>
              <button onClick={closeModal} className="text-neutral-400 hover:text-neutral-700 p-1 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-4">
              
              {/* Nama */}
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-xs font-semibold text-neutral-900">Nama Pelanggan</label>
                <input
                  type="text"
                  placeholder="Contoh: Ibu Siti"
                  {...register('nama')}
                  className={`px-4 py-2 bg-white border rounded-lg font-body text-sm focus:outline-none transition-all ${
                    errors.nama ? 'border-error' : 'border-neutral-200 focus:border-secondary'
                  }`}
                />
                {errors.nama && <span className="text-xs text-error font-medium">{errors.nama.message}</span>}
              </div>

              {/* Jabatan / Asal */}
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-xs font-semibold text-neutral-900">Jabatan / Asal (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: Ibu Rumah Tangga, Cilincing"
                  {...register('jabatan')}
                  className="px-4 py-2 bg-white border border-neutral-200 rounded-lg font-body text-sm focus:outline-none focus:border-secondary"
                />
              </div>

              {/* Rating */}
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-xs font-semibold text-neutral-900">Rating Bintang (1 - 5)</label>
                <select
                  {...register('rating')}
                  className="px-4 py-2 bg-white border border-neutral-200 rounded-lg font-body text-sm focus:outline-none focus:border-secondary"
                >
                  <option value="5">Bintang 5 ⭐⭐⭐⭐⭐</option>
                  <option value="4">Bintang 4 ⭐⭐⭐⭐</option>
                  <option value="3">Bintang 3 ⭐⭐⭐</option>
                  <option value="2">Bintang 2 ⭐⭐</option>
                  <option value="1">Bintang 1 ⭐</option>
                </select>
              </div>

              {/* Isi Testimoni */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-body text-xs font-semibold text-neutral-900">Isi Testimoni</label>
                  <span className={`text-[10px] font-bold ${textLength > 300 ? 'text-error' : 'text-neutral-400'}`}>
                    {textLength} / 300
                  </span>
                </div>
                <textarea
                  rows="4"
                  placeholder="Cerita kepuasan pelanggan..."
                  {...register('isi')}
                  onChange={(e) => {
                    setValue('isi', e.target.value);
                    setTextLength(e.target.value.length);
                  }}
                  className={`px-4 py-2 bg-white border rounded-lg font-body text-sm focus:outline-none transition-all resize-none ${
                    errors.isi ? 'border-error' : 'border-neutral-200 focus:border-secondary'
                  }`}
                />
                {errors.isi && <span className="text-xs text-error font-medium">{errors.isi.message}</span>}
              </div>

              {/* Avatar Upload */}
              <div className="flex flex-col gap-2 mt-2">
                <label className="font-body text-xs font-semibold text-neutral-900">Foto Profil Pelanggan (Opsional)</label>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-neutral-50 rounded-full border-2 border-dashed border-neutral-300 flex items-center justify-center overflow-hidden shrink-0">
                    {preview ? (
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="w-4 h-4 text-neutral-400" />
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-1 items-start">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded text-neutral-700 text-xs font-semibold transition-colors"
                    >
                      Pilih Foto
                    </button>
                    <span className="text-[10px] text-neutral-400">Rasio 1:1 (kotak), maks 2MB.</span>
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/jpg,image/webp"
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
                  disabled={saving || textLength > 300}
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
                      Simpan Testimoni
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
export default ManageTestimonials;
