import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Save } from 'lucide-react';
import { apiService } from '../services/api';
import { useToast } from '../hooks/useToast';

export const EditContact = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [saving, setSaving] = useState(false);

  // 1. Fetch current contact data
  const { data, isLoading } = useQuery({
    queryKey: ['adminContact'],
    queryFn: apiService.getContact,
  });

  const schema = z.object({
    alamat: z.string().min(10, { message: 'Alamat minimal 10 karakter.' }),
    email: z.string().min(1, { message: 'Email wajib diisi.' }).email({ message: 'Format email tidak valid.' }),
    instagram: z.string().nullable().or(z.literal('')),
    tiktok: z.string().nullable().or(z.literal('')),
    whatsapp: z.string().regex(/^62\d{9,15}$/, {
      message: 'Nomor WhatsApp wajib diawali 62 (contoh: 628123456789) tanpa spasi atau tanda +.',
    }),
    maps_embed_url: z.string().nullable().or(z.literal('')),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  // Populate form with current values
  useEffect(() => {
    if (data?.contact) {
      const c = data.contact;
      setValue('alamat', c.alamat || '');
      setValue('email', c.email || '');
      setValue('instagram', c.instagram || '');
      setValue('tiktok', c.tiktok || '');
      setValue('whatsapp', c.whatsapp || '');
      setValue('maps_embed_url', c.maps_embed_url || '');
    }
  }, [data, setValue]);

  // 2. Save mutation
  const mutation = useMutation({
    mutationFn: apiService.updateContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminContact'] });
      queryClient.invalidateQueries({ queryKey: ['publicContact'] });
      addToast('Informasi Kontak berhasil disimpan!', 'success');
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Gagal menyimpan kontak.', 'error');
    },
    onSettled: () => setSaving(false),
  });

  const onSubmit = (formData) => {
    setSaving(true);
    let embedUrl = formData.maps_embed_url || '';
    if (embedUrl.includes('<iframe')) {
      const srcMatch = embedUrl.match(/src="([^"]+)"/);
      if (srcMatch && srcMatch[1]) {
        embedUrl = srcMatch[1];
      }
    }
    mutation.mutate({
      ...formData,
      maps_embed_url: embedUrl
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <span className="font-body text-sm text-neutral-500">Memuat data kontak...</span>
      </div>
    );
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-modal shadow-soft p-8 max-w-2xl text-left">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        
        {/* Alamat */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="alamat" className="font-body text-sm font-semibold text-neutral-900">
            Alamat Kantor & Gudang Fisik
          </label>
          <textarea
            id="alamat"
            rows="3"
            {...register('alamat')}
            className={`px-4 py-2.5 bg-white border rounded-lg font-body text-sm focus:outline-none transition-all resize-none ${
              errors.alamat 
                ? 'border-error focus:ring-2 focus:ring-error/20' 
                : 'border-neutral-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20'
            }`}
          />
          {errors.alamat && (
            <span className="font-body text-xs text-error font-medium">{errors.alamat.message}</span>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="font-body text-sm font-semibold text-neutral-900">
            Email Resmi Perusahaan
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className={`px-4 py-2.5 bg-white border rounded-lg font-body text-sm focus:outline-none transition-all ${
              errors.email 
                ? 'border-error focus:ring-2 focus:ring-error/20' 
                : 'border-neutral-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20'
            }`}
          />
          {errors.email && (
            <span className="font-body text-xs text-error font-medium">{errors.email.message}</span>
          )}
        </div>

        {/* WhatsApp */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="whatsapp" className="font-body text-sm font-semibold text-neutral-900">
            Nomor WhatsApp Informasi
          </label>
          <input
            id="whatsapp"
            type="text"
            placeholder="Contoh: 628123456789"
            {...register('whatsapp')}
            className={`px-4 py-2.5 bg-white border rounded-lg font-body text-sm focus:outline-none transition-all ${
              errors.whatsapp 
                ? 'border-error focus:ring-2 focus:ring-error/20' 
                : 'border-neutral-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20'
            }`}
          />
          {errors.whatsapp ? (
            <span className="font-body text-xs text-error font-medium">{errors.whatsapp.message}</span>
          ) : (
            <span className="font-body text-xs text-neutral-400">Nomor kontak utama di footer (Wajib berformat 62 di awal).</span>
          )}
        </div>

        {/* Instagram */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="instagram" className="font-body text-sm font-semibold text-neutral-900">
            Username Instagram (Tanpa @)
          </label>
          <input
            id="instagram"
            type="text"
            placeholder="Contoh: ruv.indonesia"
            {...register('instagram')}
            className="px-4 py-2.5 bg-white border border-neutral-200 rounded-lg font-body text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
          />
        </div>

        {/* TikTok */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="tiktok" className="font-body text-sm font-semibold text-neutral-900">
            Username TikTok (Tanpa @)
          </label>
          <input
            id="tiktok"
            type="text"
            placeholder="Contoh: ruv.indonesia"
            {...register('tiktok')}
            className="px-4 py-2.5 bg-white border border-neutral-200 rounded-lg font-body text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
          />
        </div>

        {/* Google Maps URL */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="maps_embed_url" className="font-body text-sm font-semibold text-neutral-900">
            Google Maps Embed Iframe URL (src)
          </label>
          <textarea
            id="maps_embed_url"
            rows="3"
            placeholder="https://www.google.com/maps/embed?pb=..."
            {...register('maps_embed_url')}
            className="px-4 py-2.5 bg-white border border-neutral-200 rounded-lg font-body text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all resize-none"
          />
          <span className="font-body text-xs text-neutral-400">Ambil link ini dari fitur Google Maps &rarr; Share &rarr; Embed a map &rarr; salin isi atribut <code>src</code>-nya saja.</span>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className="mt-4 self-start px-6 py-3 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed text-white font-body text-sm font-bold rounded-lg shadow-soft active:scale-[0.98] transition-all flex items-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Simpan Kontak
            </>
          )}
        </button>

      </form>
    </div>
  );
};
export default EditContact;
