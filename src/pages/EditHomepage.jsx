import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Save, Recycle } from 'lucide-react';
import { apiService } from '../services/api';
import { useToast } from '../hooks/useToast';
import logoPrimer from '../assets/logo-ruv-brown.png';

export const EditHomepage = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [saving, setSaving] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['adminHomepageSettings'],
    queryFn: apiService.getHomepage,
  });

  const schema = z.object({
    judul_utama: z.string().min(5, { message: 'Judul utama minimal 5 karakter.' }).max(255),
    deskripsi: z.string().min(10, { message: 'Deskripsi minimal 10 karakter.' }),
    nomor_whatsapp: z.string().regex(/^62\d{9,15}$/, {
      message: 'Nomor WhatsApp wajib diawali 62 (contoh: 628123456789) tanpa spasi atau tanda +.',
    }),
    teks_cta: z.string().min(2, { message: 'Label CTA minimal 2 karakter.' }).max(50),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      judul_utama: '',
      deskripsi: '',
      nomor_whatsapp: '',
      teks_cta: '',
    }
  });

  // Watch fields for live preview
  const watchJudul = watch('judul_utama');
  const watchDeskripsi = watch('deskripsi');
  const watchCta = watch('teks_cta');

  useEffect(() => {
    if (data?.settings) {
      setValue('judul_utama', data.settings.judul_utama);
      setValue('deskripsi', data.settings.deskripsi);
      setValue('nomor_whatsapp', data.settings.nomor_whatsapp);
      setValue('teks_cta', data.settings.teks_cta);
    }
  }, [data, setValue]);

  const mutation = useMutation({
    mutationFn: apiService.updateHomepage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminHomepageSettings'] });
      queryClient.invalidateQueries({ queryKey: ['publicHomepage'] });
      addToast('Pengaturan Beranda berhasil disimpan!', 'success');
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Gagal menyimpan pengaturan.', 'error');
    },
    onSettled: () => setSaving(false),
  });

  const onSubmit = (formData) => {
    setSaving(true);
    mutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <span className="font-body text-sm text-neutral-500">Memuat pengaturan beranda...</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left items-start font-body">

      {/* Edit Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="lg:col-span-6 bg-white border border-neutral-200 rounded-modal shadow-soft p-6 flex flex-col gap-5"
      >
        <h3 className="font-heading text-base font-bold text-neutral-900 border-b border-neutral-100 pb-2">
          Form Pengaturan Beranda
        </h3>

        {/* Judul Utama */}
        <div className="flex flex-col gap-1">
          <label htmlFor="judul_utama" className="text-xs font-bold text-neutral-900">
            Judul Utama Hero
          </label>
          <input
            id="judul_utama"
            type="text"
            {...register('judul_utama')}
            className={`px-4 py-2 bg-white border rounded-lg text-sm focus:outline-none transition-all ${errors.judul_utama ? 'border-error' : 'border-neutral-200 focus:border-secondary'
              }`}
          />
          {errors.judul_utama && (
            <span className="text-[10px] text-error font-semibold">{errors.judul_utama.message}</span>
          )}
        </div>

        {/* Deskripsi */}
        <div className="flex flex-col gap-1">
          <label htmlFor="deskripsi" className="text-xs font-bold text-neutral-900">
            Deskripsi Tagline / Paragraf Hero
          </label>
          <textarea
            id="deskripsi"
            rows="5"
            {...register('deskripsi')}
            className={`px-4 py-2 bg-white border rounded-lg text-sm focus:outline-none transition-all resize-none ${errors.deskripsi ? 'border-error' : 'border-neutral-200 focus:border-secondary'
              }`}
          />
          {errors.deskripsi && (
            <span className="text-[10px] text-error font-semibold">{errors.deskripsi.message}</span>
          )}
        </div>

        {/* Nomor WhatsApp */}
        <div className="flex flex-col gap-1">
          <label htmlFor="nomor_whatsapp" className="text-xs font-bold text-neutral-900">
            Nomor WhatsApp Admin
          </label>
          <input
            id="nomor_whatsapp"
            type="text"
            placeholder="628123456789"
            {...register('nomor_whatsapp')}
            className={`px-4 py-2 bg-white border rounded-lg text-sm focus:outline-none transition-all ${errors.nomor_whatsapp ? 'border-error' : 'border-neutral-200 focus:border-secondary'
              }`}
          />
          {errors.nomor_whatsapp && (
            <span className="text-[10px] text-error font-semibold">{errors.nomor_whatsapp.message}</span>
          )}
        </div>

        {/* Teks CTA */}
        <div className="flex flex-col gap-1">
          <label htmlFor="teks_cta" className="text-xs font-bold text-neutral-900">
            Label Tombol CTA
          </label>
          <input
            id="teks_cta"
            type="text"
            {...register('teks_cta')}
            className={`px-4 py-2 bg-white border rounded-lg text-sm focus:outline-none transition-all ${errors.teks_cta ? 'border-error' : 'border-neutral-200 focus:border-secondary'
              }`}
          />
          {errors.teks_cta && (
            <span className="text-[10px] text-error font-semibold">{errors.teks_cta.message}</span>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className="self-start px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-200 text-white font-body text-xs font-bold rounded-lg shadow-soft transition-all flex items-center gap-2"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Simpan Perubahan
        </button>
      </form>

      {/* Live Preview Column */}
      <div className="lg:col-span-6 flex flex-col gap-4">
        <h3 className="font-heading text-base font-bold text-neutral-900 border-b border-neutral-200 pb-2">
          Pratinjau Langsung (Live Preview)
        </h3>

        {/* Mockup Browser Window */}
        <div className="border border-neutral-200 rounded-modal bg-neutral-50 shadow-soft overflow-hidden flex flex-col">
          {/* Browser header */}
          <div className="h-9 bg-neutral-200 px-4 flex items-center gap-1.5 border-b border-neutral-300">
            <span className="w-3 h-3 rounded-full bg-error/80" />
            <span className="w-3 h-3 rounded-full bg-warning/80" />
            <span className="w-3 h-3 rounded-full bg-success/80" />
            <span className="text-[10px] text-neutral-500 font-bold ml-4">Preview: RUV Landing Hero</span>
          </div>

          {/* Hero Content Preview Area */}
          <div className="p-8 bg-neutral-100 flex flex-col gap-4 items-start text-left min-h-[300px] justify-center relative">
            <div className="absolute top-2 right-2 w-16 opacity-30">
              <img src={logoPrimer} alt="Logo" className="w-full object-contain" />
            </div>

            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white border border-primary/45 rounded-full">
              <Recycle className="w-3.5 h-3.5 text-primary" />
              <span className="text-[8px] font-bold text-neutral-900 uppercase">Ekonomi Sirkular</span>
            </div>

            <h1 className="font-heading text-xl md:text-2xl font-bold text-neutral-900 leading-tight">
              {watchJudul || 'Judul Utama Hero Website'}
            </h1>

            <p className="font-body text-xs text-neutral-700 leading-relaxed max-w-sm">
              {watchDeskripsi || 'Paragraf deskripsi ringkasan alur bisnis dan penawaran kemudahan RUV.'}
            </p>

            <button className="px-6 py-2.5 bg-secondary text-neutral-900 border-2 border-neutral-950 font-heading text-xs font-black rounded-lg shadow-soft self-start mt-2">
              {watchCta || 'Jual Sekarang!'}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
export default EditHomepage;
