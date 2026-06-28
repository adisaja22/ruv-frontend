import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Save, MessageSquare, User, Package, Hash, MapPin, Send } from 'lucide-react';
import { apiService } from '../services/api';
import { useToast } from '../hooks/useToast';

export const EditFormFields = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [saving, setSaving] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['adminFormFields'],
    queryFn: apiService.getFormFields,
  });

  const fieldSchema = z.object({
    label: z.string().min(2, { message: 'Label minimal 2 karakter.' }).max(255),
    placeholder: z.string().min(2, { message: 'Placeholder minimal 2 karakter.' }).max(255),
    helper_text: z.string().max(255).nullable().or(z.literal('')),
  });

  const schema = z.object({
    nama: fieldSchema,
    barang: fieldSchema,
    jumlah: fieldSchema,
    alamat: fieldSchema,
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
      nama: { label: '', placeholder: '', helper_text: '' },
      barang: { label: '', placeholder: '', helper_text: '' },
      jumlah: { label: '', placeholder: '', helper_text: '' },
      alamat: { label: '', placeholder: '', helper_text: '' },
    }
  });

  // Watch values for live preview
  const watchNama = watch('nama');
  const watchBarang = watch('barang');
  const watchJumlah = watch('jumlah');
  const watchAlamat = watch('alamat');

  useEffect(() => {
    if (data?.fields) {
      const f = data.fields;
      setValue('nama.label', f.nama?.label || '');
      setValue('nama.placeholder', f.nama?.placeholder || '');
      setValue('nama.helper_text', f.nama?.helper_text || '');

      setValue('barang.label', f.barang?.label || '');
      setValue('barang.placeholder', f.barang?.placeholder || '');
      setValue('barang.helper_text', f.barang?.helper_text || '');

      setValue('jumlah.label', f.jumlah?.label || '');
      setValue('jumlah.placeholder', f.jumlah?.placeholder || '');
      setValue('jumlah.helper_text', f.jumlah?.helper_text || '');

      setValue('alamat.label', f.alamat?.label || '');
      setValue('alamat.placeholder', f.alamat?.placeholder || '');
      setValue('alamat.helper_text', f.alamat?.helper_text || '');
    }
  }, [data, setValue]);

  const mutation = useMutation({
    mutationFn: apiService.updateFormFields,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminFormFields'] });
      queryClient.invalidateQueries({ queryKey: ['formFields'] });
      addToast('Pengaturan Form berhasil disimpan!', 'success');
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Gagal menyimpan pengaturan.', 'error');
    },
    onSettled: () => setSaving(false),
  });

  const onSubmit = (formData) => {
    setSaving(true);
    const payload = {
      fields: [
        { field_key: 'nama', ...formData.nama },
        { field_key: 'barang', ...formData.barang },
        { field_key: 'jumlah', ...formData.jumlah },
        { field_key: 'alamat', ...formData.alamat },
      ]
    };
    mutation.mutate(payload);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <span className="font-body text-sm text-neutral-500">Memuat bidang formulir...</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left items-start font-body">

      {/* Editor Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="lg:col-span-7 bg-white border border-neutral-200 rounded-modal shadow-soft p-6 flex flex-col gap-6"
      >
        <h3 className="font-heading text-base font-bold text-neutral-900 border-b border-neutral-100 pb-2">
          Kelola Struktur Label Form Penjualan
        </h3>

        {/* NAMA FIELD SETTINGS */}
        <div className="flex flex-col gap-4 p-4 bg-neutral-50 border border-neutral-200 rounded-card">
          <span className="font-heading text-xs font-bold text-neutral-900 uppercase tracking-wider">Pengaturan Bidang: Nama Penjual</span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-neutral-500">Label</label>
              <input type="text" {...register('nama.label')} className="px-3 py-1.5 bg-white border border-neutral-200 rounded text-xs focus:outline-none" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-neutral-500">Placeholder</label>
              <input type="text" {...register('nama.placeholder')} className="px-3 py-1.5 bg-white border border-neutral-200 rounded text-xs focus:outline-none" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-neutral-500">Helper Text</label>
              <input type="text" {...register('nama.helper_text')} className="px-3 py-1.5 bg-white border border-neutral-200 rounded text-xs focus:outline-none" />
            </div>
          </div>
        </div>

        {/* BARANG FIELD SETTINGS */}
        <div className="flex flex-col gap-4 p-4 bg-neutral-50 border border-neutral-200 rounded-card">
          <span className="font-heading text-xs font-bold text-neutral-900 uppercase tracking-wider">Pengaturan Bidang: Jenis Barang</span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-neutral-500">Label</label>
              <input type="text" {...register('barang.label')} className="px-3 py-1.5 bg-white border border-neutral-200 rounded text-xs focus:outline-none" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-neutral-500">Placeholder</label>
              <input type="text" {...register('barang.placeholder')} className="px-3 py-1.5 bg-white border border-neutral-200 rounded text-xs focus:outline-none" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-neutral-500">Helper Text</label>
              <input type="text" {...register('barang.helper_text')} className="px-3 py-1.5 bg-white border border-neutral-200 rounded text-xs focus:outline-none" />
            </div>
          </div>
        </div>

        {/* JUMLAH FIELD SETTINGS */}
        <div className="flex flex-col gap-4 p-4 bg-neutral-50 border border-neutral-200 rounded-card">
          <span className="font-heading text-xs font-bold text-neutral-900 uppercase tracking-wider">Pengaturan Bidang: Estimasi Jumlah</span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-neutral-500">Label</label>
              <input type="text" {...register('jumlah.label')} className="px-3 py-1.5 bg-white border border-neutral-200 rounded text-xs focus:outline-none" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-neutral-500">Placeholder</label>
              <input type="text" {...register('jumlah.placeholder')} className="px-3 py-1.5 bg-white border border-neutral-200 rounded text-xs focus:outline-none" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-neutral-500">Helper Text</label>
              <input type="text" {...register('jumlah.helper_text')} className="px-3 py-1.5 bg-white border border-neutral-200 rounded text-xs focus:outline-none" />
            </div>
          </div>
        </div>

        {/* ALAMAT FIELD SETTINGS */}
        <div className="flex flex-col gap-4 p-4 bg-neutral-50 border border-neutral-200 rounded-card">
          <span className="font-heading text-xs font-bold text-neutral-900 uppercase tracking-wider">Pengaturan Bidang: Alamat Lengkap</span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-neutral-500">Label</label>
              <input type="text" {...register('alamat.label')} className="px-3 py-1.5 bg-white border border-neutral-200 rounded text-xs focus:outline-none" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-neutral-500">Placeholder</label>
              <input type="text" {...register('alamat.placeholder')} className="px-3 py-1.5 bg-white border border-neutral-200 rounded text-xs focus:outline-none" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-neutral-500">Helper Text</label>
              <input type="text" {...register('alamat.helper_text')} className="px-3 py-1.5 bg-white border border-neutral-200 rounded text-xs focus:outline-none" />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="self-start px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-200 text-white font-body text-xs font-bold rounded-lg shadow-soft transition-all flex items-center gap-2"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Simpan Bidang Form
        </button>
      </form>

      {/* Live Preview Column */}
      <div className="lg:col-span-5 flex flex-col gap-4 sticky top-6">
        <h3 className="font-heading text-base font-bold text-neutral-900 border-b border-neutral-200 pb-2">
          Pratinjau Visual Form Modal
        </h3>

        {/* Modal Visual Card Mockup */}
        <div className="bg-white rounded-modal shadow-lg border border-neutral-200 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-neutral-200 bg-neutral-100">
            <MessageSquare className="w-4 h-4 text-secondary animate-pulse" />
            <span className="font-heading text-xs font-bold text-neutral-900">
              Form Jual Barang Bekas (Pratinjau)
            </span>
          </div>

          {/* Form fields mockup */}
          <div className="p-5 flex flex-col gap-3.5 text-left">
            {/* Nama */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-neutral-900">{watchNama?.label || 'Nama Penjual'}</span>
              <div className="relative">
                <User className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-neutral-400" />
                <input
                  type="text"
                  disabled
                  placeholder={watchNama?.placeholder || 'Masukkan nama Anda'}
                  className="w-full pl-8 pr-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded text-xs opacity-75"
                />
              </div>
              <span className="text-[9px] text-neutral-400 italic">{watchNama?.helper_text || ''}</span>
            </div>

            {/* Barang */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-neutral-900">{watchBarang?.label || 'Barang yang Dijual'}</span>
              <div className="relative">
                <Package className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-neutral-400" />
                <input
                  type="text"
                  disabled
                  placeholder={watchBarang?.placeholder || 'Contoh: Botol plastik'}
                  className="w-full pl-8 pr-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded text-xs opacity-75"
                />
              </div>
              <span className="text-[9px] text-neutral-400 italic">{watchBarang?.helper_text || ''}</span>
            </div>

            {/* Jumlah */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-neutral-900">{watchJumlah?.label || 'Estimasi Jumlah / Berat'}</span>
              <div className="relative">
                <Hash className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-neutral-400" />
                <input
                  type="text"
                  disabled
                  placeholder={watchJumlah?.placeholder || 'Contoh: 15 Kg'}
                  className="w-full pl-8 pr-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded text-xs opacity-75"
                />
              </div>
              <span className="text-[9px] text-neutral-400 italic">{watchJumlah?.helper_text || ''}</span>
            </div>

            {/* Alamat */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-neutral-900">{watchAlamat?.label || 'Alamat Penjemputan'}</span>
              <div className="relative">
                <MapPin className="absolute left-2.5 top-2 w-3.5 h-3.5 text-neutral-400" />
                <textarea
                  rows="2"
                  disabled
                  placeholder={watchAlamat?.placeholder || 'Masukkan alamat penjemputan'}
                  className="w-full pl-8 pr-3 py-1 bg-neutral-50 border border-neutral-200 rounded text-xs opacity-75 resize-none"
                />
              </div>
              <span className="text-[9px] text-neutral-400 italic">{watchAlamat?.helper_text || ''}</span>
            </div>

            {/* Submit Mock */}
            <button
              disabled
              className="w-full py-2 bg-secondary text-neutral-900 border border-neutral-950 font-heading text-xs font-black rounded flex items-center justify-center gap-1.5 opacity-80"
            >
              <Send className="w-3 h-3" />
              Kirim Sekarang!
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
export default EditFormFields;
