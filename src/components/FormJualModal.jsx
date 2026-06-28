import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, MessageSquare, Loader2, User, Package, Hash, MapPin, Send } from 'lucide-react';
import { apiService } from '../services/api';

const fallbackFields = {
  nama: { label: 'Nama Penjual', placeholder: 'Masukkan nama lengkap Anda', helper_text: 'Gunakan nama asli Anda.' },
  barang: { label: 'Barang yang Dijual', placeholder: 'Contoh: Botol plastik, kardus, dll', helper_text: 'Sebutkan jenis barang bekas.' },
  jumlah: { label: 'Estimasi Jumlah / Berat', placeholder: 'Contoh: 15 Kg, 3 Unit', helper_text: 'Jumlah barang menentukan kurir penjemput.' },
  alamat: { label: 'Alamat Penjemputan', placeholder: 'Masukkan alamat lengkap penjemputan', helper_text: 'Tulis alamat lengkap Anda.' },
};

export const FormJualModal = ({ isOpen, onClose, whatsappNumber }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['formFields'],
    queryFn: apiService.getFormFields,
    enabled: isOpen,
  });

  const fields = data?.fields || fallbackFields;

  const [addressMode, setAddressMode] = useState('manual');

  const schema = z.object({
    nama: z.string().min(2, { message: 'Nama harus diisi minimal 2 karakter.' }),
    barang: z.string().min(3, { message: 'Nama barang harus diisi minimal 3 karakter.' }),
    jumlah: z.string().refine((val) => /\d/.test(val), {
      message: 'Jumlah harus mengandung angka (contoh: 10 Kg atau 3 Unit).',
    }),
    alamat: z.string().optional(),
  }).superRefine((val, ctx) => {
    if (addressMode === 'manual' && (!val.alamat || val.alamat.trim().length < 10)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['alamat'],
        message: 'Alamat harus diisi lengkap minimal 10 karakter.',
      });
    }
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const onSubmit = (formData) => {
    const alamatString = addressMode === 'gps'
      ? '_[Saya akan membagikan lokasi penjemputan via fitur Share Location WhatsApp setelah ini]_'
      : formData.alamat;

    const message = `Halo RUV! Saya ingin menjual barang bekas.\n\n*Nama*: ${formData.nama}\n*Barang*: ${formData.barang}\n*Jumlah*: ${formData.jumlah}\n*Alamat*: ${alamatString}\n\nMohon direspon segera. Terima kasih!`;
    const waUrl = `https://api.whatsapp.com/send/?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 font-body">
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm transition-opacity duration-300"
      />

      <div className="relative w-full max-w-lg bg-white rounded-modal shadow-xl border border-neutral-200 overflow-hidden z-10 animate-modal-in">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-100">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-secondary" />
            <h3 className="font-heading text-base font-bold text-neutral-900">
              Form Jual Barang Bekas
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1.5 hover:bg-neutral-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="w-8 h-8 text-secondary animate-spin" />
            <span className="text-sm text-neutral-400">Memuat formulir...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
            
            {/* Nama Field (with Icon) */}
            <div className="flex flex-col gap-1 text-left">
              <label htmlFor="nama" className="text-xs font-bold text-neutral-900 mb-1">
                {fields.nama?.label || 'Nama Penjual'}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 w-4 h-4 text-neutral-400" />
                <input
                  id="nama"
                  type="text"
                  placeholder={fields.nama?.placeholder || 'Masukkan nama Anda'}
                  {...register('nama')}
                  className={`w-full pl-9 pr-4 py-2.5 bg-white border rounded-lg text-sm focus:outline-none transition-all ${
                    errors.nama 
                      ? 'border-error focus:ring-2 focus:ring-error/20' 
                      : 'border-neutral-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20'
                  }`}
                />
              </div>
              {errors.nama ? (
                <span className="text-[10px] text-error font-semibold mt-1">{errors.nama.message}</span>
              ) : fields.nama?.helper_text ? (
                <span className="text-[10px] text-neutral-400 mt-1">{fields.nama.helper_text}</span>
              ) : null}
            </div>

            {/* Barang Field (with Icon) */}
            <div className="flex flex-col gap-1 text-left">
              <label htmlFor="barang" className="text-xs font-bold text-neutral-900 mb-1">
                {fields.barang?.label || 'Barang yang Dijual'}
              </label>
              <div className="relative">
                <Package className="absolute left-3 top-3.5 w-4 h-4 text-neutral-400" />
                <input
                  id="barang"
                  type="text"
                  placeholder={fields.barang?.placeholder || 'Contoh: Botol plastik, koran'}
                  {...register('barang')}
                  className={`w-full pl-9 pr-4 py-2.5 bg-white border rounded-lg text-sm focus:outline-none transition-all ${
                    errors.barang 
                      ? 'border-error focus:ring-2 focus:ring-error/20' 
                      : 'border-neutral-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20'
                  }`}
                />
              </div>
              {errors.barang ? (
                <span className="text-[10px] text-error font-semibold mt-1">{errors.barang.message}</span>
              ) : fields.barang?.helper_text ? (
                <span className="text-[10px] text-neutral-400 mt-1">{fields.barang.helper_text}</span>
              ) : null}
            </div>

            {/* Jumlah Field (with Icon) */}
            <div className="flex flex-col gap-1 text-left">
              <label htmlFor="jumlah" className="text-xs font-bold text-neutral-900 mb-1">
                {fields.jumlah?.label || 'Estimasi Jumlah / Berat'}
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-3.5 w-4 h-4 text-neutral-400" />
                <input
                  id="jumlah"
                  type="text"
                  placeholder={fields.jumlah?.placeholder || 'Contoh: 10 Kg, 3 Unit'}
                  {...register('jumlah')}
                  className={`w-full pl-9 pr-4 py-2.5 bg-white border rounded-lg text-sm focus:outline-none transition-all ${
                    errors.jumlah 
                      ? 'border-error focus:ring-2 focus:ring-error/20' 
                      : 'border-neutral-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20'
                  }`}
                />
              </div>
              {errors.jumlah ? (
                <span className="text-[10px] text-error font-semibold mt-1">{errors.jumlah.message}</span>
              ) : fields.jumlah?.helper_text ? (
                <span className="text-[10px] text-neutral-400 mt-1">{fields.jumlah.helper_text}</span>
              ) : null}
            </div>

            {/* Opsi Alamat Penjemputan */}
            <div className="flex flex-col gap-2 text-left">
              <span className="text-xs font-bold text-neutral-900">Metode Alamat Penjemputan</span>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mt-1">
                <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 cursor-pointer">
                  <input
                    type="radio"
                    name="addressMode"
                    value="manual"
                    checked={addressMode === 'manual'}
                    onChange={() => setAddressMode('manual')}
                    className="w-4 h-4 text-primary border-neutral-300 focus:ring-primary"
                  />
                  Input Alamat Manual
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 cursor-pointer">
                  <input
                    type="radio"
                    name="addressMode"
                    value="gps"
                    checked={addressMode === 'gps'}
                    onChange={() => setAddressMode('gps')}
                    className="w-4 h-4 text-primary border-neutral-300 focus:ring-primary"
                  />
                  Share Location via WhatsApp
                </label>
              </div>
            </div>

            {/* Alamat Field (with Icon) */}
            {addressMode === 'manual' ? (
              <div className="flex flex-col gap-1 text-left">
                <label htmlFor="alamat" className="text-xs font-bold text-neutral-900 mb-1">
                  {fields.alamat?.label || 'Alamat Penjemputan'}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-neutral-400" />
                  <textarea
                    id="alamat"
                    rows="3"
                    placeholder={fields.alamat?.placeholder || 'Masukkan alamat lengkap'}
                    {...register('alamat')}
                    className={`w-full pl-9 pr-4 py-2 bg-white border rounded-lg text-sm focus:outline-none transition-all resize-none ${
                      errors.alamat 
                        ? 'border-error focus:ring-2 focus:ring-error/20' 
                        : 'border-neutral-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20'
                    }`}
                  />
                </div>
                {errors.alamat ? (
                  <span className="text-[10px] text-error font-semibold mt-1">{errors.alamat.message}</span>
                ) : fields.alamat?.helper_text ? (
                  <span className="text-[10px] text-neutral-400 mt-1">{fields.alamat.helper_text}</span>
                ) : null}
              </div>
            ) : (
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg text-left text-neutral-800 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-neutral-900 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-neutral-900">Share Location Aktif</span>
                  <span className="text-[11px] leading-relaxed text-neutral-600">
                    Anda tidak perlu mengetik alamat. Setelah mengklik tombol kirim di bawah, Anda akan diarahkan ke WhatsApp untuk mengirim pesan awal, lalu silakan kirimkan koordinat GPS Anda menggunakan fitur **Share Location** WhatsApp.
                  </span>
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="mt-3 w-full py-3.5 bg-[#EFC075] hover:bg-[#e7b25e] text-neutral-900 border-0 font-heading text-sm font-black rounded-lg shadow-md shadow-[#EFC075]/25 hover:shadow-lg hover:shadow-[#EFC075]/45 active:scale-[0.97] transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
            >
              <Send className="w-4 h-4" />
              Kirim Sekarang!
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
export default FormJualModal;
