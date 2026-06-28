import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Save, BarChart3 } from 'lucide-react';
import { apiService } from '../services/api';
import { useToast } from '../hooks/useToast';

export const EditStatistics = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [saving, setSaving] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['adminStatistics'],
    queryFn: apiService.getHomepage, // Statistics are nested in homepage response
  });

  const schema = z.object({
    mitra: z.coerce.number().int().min(0, { message: 'Mitra tidak boleh negatif.' }),
    kg_barang: z.coerce.number().min(0, { message: 'Berat barang tidak boleh negatif.' }),
    transaksi_harian: z.coerce.number().int().min(0, { message: 'Transaksi tidak boleh negatif.' }),
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
      mitra: 0,
      kg_barang: 0,
      transaksi_harian: 0,
    }
  });

  // Watch statistics values for live preview
  const watchMitra = watch('mitra');
  const watchKg = watch('kg_barang');
  const watchTransaksi = watch('transaksi_harian');

  useEffect(() => {
    if (data?.statistics) {
      setValue('mitra', data.statistics.mitra);
      setValue('kg_barang', data.statistics.kg_barang);
      setValue('transaksi_harian', data.statistics.transaksi_harian);
    }
  }, [data, setValue]);

  const mutation = useMutation({
    mutationFn: apiService.updateStatistics,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminStatistics'] });
      queryClient.invalidateQueries({ queryKey: ['publicHomepage'] });
      addToast('Data Statistik berhasil diperbarui!', 'success');
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Gagal memperbarui data statistik.', 'error');
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
        <span className="font-body text-sm text-neutral-500">Memuat data statistik...</span>
      </div>
    );
  }

  // Formatting calculations for preview
  const tonValue = (parseFloat(watchKg || 0) / 1000).toFixed(1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left items-start font-body">

      {/* Editor Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="lg:col-span-6 bg-white border border-neutral-200 rounded-modal shadow-soft p-6 flex flex-col gap-5"
      >
        <h3 className="font-heading text-base font-bold text-neutral-900 border-b border-neutral-100 pb-2">
          Ubah Counter Statistik Publik
        </h3>

        {/* Jumlah Mitra */}
        <div className="flex flex-col gap-1">
          <label htmlFor="mitra" className="text-xs font-bold text-neutral-900">
            Total Mitra Bisnis (Gudang/Pabrik)
          </label>
          <input
            id="mitra"
            type="number"
            {...register('mitra')}
            className={`px-4 py-2 bg-white border rounded-lg text-sm focus:outline-none transition-all ${errors.mitra ? 'border-error' : 'border-neutral-200 focus:border-secondary'
              }`}
          />
          {errors.mitra && (
            <span className="text-[10px] text-error font-semibold">{errors.mitra.message}</span>
          )}
        </div>

        {/* Berat Barang (Kg) */}
        <div className="flex flex-col gap-1">
          <label htmlFor="kg_barang" className="text-xs font-bold text-neutral-900">
            Total Barang Bekas (dalam satuan Kilogram / Kg)
          </label>
          <input
            id="kg_barang"
            type="number"
            step="any"
            {...register('kg_barang')}
            className={`px-4 py-2 bg-white border rounded-lg text-sm focus:outline-none transition-all ${errors.kg_barang ? 'border-error' : 'border-neutral-200 focus:border-secondary'
              }`}
          />
          <span className="text-[10px] text-neutral-400 mt-1">
            Sistem otomatis membagi angka ini dengan 1.000 untuk tampilan Ton di landing page.
          </span>
          {errors.kg_barang && (
            <span className="text-[10px] text-error font-semibold">{errors.kg_barang.message}</span>
          )}
        </div>

        {/* Transaksi Harian */}
        <div className="flex flex-col gap-1">
          <label htmlFor="transaksi_harian" className="text-xs font-bold text-neutral-900">
            Total Transaksi Penjemputan Harian
          </label>
          <input
            id="transaksi_harian"
            type="number"
            {...register('transaksi_harian')}
            className={`px-4 py-2 bg-white border rounded-lg text-sm focus:outline-none transition-all ${errors.transaksi_harian ? 'border-error' : 'border-neutral-200 focus:border-secondary'
              }`}
          />
          {errors.transaksi_harian && (
            <span className="text-[10px] text-error font-semibold">{errors.transaksi_harian.message}</span>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className="self-start px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-200 text-white font-body text-xs font-bold rounded-lg shadow-soft transition-all flex items-center gap-2"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Simpan Statistik
        </button>
      </form>

      {/* Live Preview Column */}
      <div className="lg:col-span-6 flex flex-col gap-4">
        <h3 className="font-heading text-base font-bold text-neutral-900 border-b border-neutral-200 pb-2">
          Pratinjau Statistik Publik
        </h3>

        {/* Mockup card of statistics row */}
        <div className="border border-neutral-200 rounded-modal bg-white shadow-soft p-8 text-center flex flex-col gap-6">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-3 text-left">
            <BarChart3 className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-bold text-neutral-900 uppercase tracking-widest">
              Live Landing Statistics Preview
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stat 1 */}
            <div className="flex flex-col items-center gap-0.5">
              <span className="font-heading text-3xl font-extrabold text-neutral-900">
                {watchMitra || 0}+
              </span>
              <span className="text-[10px] font-bold text-neutral-600">Mitra Bisnis</span>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col items-center gap-0.5 border-t md:border-t-0 md:border-x border-neutral-200 pt-4 md:pt-0">
              <span className="font-heading text-3xl font-extrabold text-neutral-900">
                {tonValue} Kg+
              </span>
              <span className="text-[10px] font-bold text-neutral-600">Barang Bekas</span>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col items-center gap-0.5 border-t md:border-t-0 pt-4 md:pt-0">
              <span className="font-heading text-3xl font-extrabold text-neutral-900">
                {watchTransaksi || 0}+
              </span>
              <span className="text-[10px] font-bold text-neutral-600">Transaksi Harian</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
export default EditStatistics;
