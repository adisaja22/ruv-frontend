import React, { useEffect, useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Loader2, Save, Upload, Trash2 } from 'lucide-react';
import { apiService, getStorageUrl } from '../services/api';
import { useToast } from '../hooks/useToast';

export const EditAbout = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  // 1. Fetch current about content
  const { data, isLoading } = useQuery({
    queryKey: ['adminAbout'],
    queryFn: apiService.getAbout,
  });

  const { register, handleSubmit, setValue } = useForm();

  // Populate form with current values
  useEffect(() => {
    if (data?.about) {
      setValue('konten_teks', data.about.konten_teks);
      if (data.about.foto_path) {
        const imageURL = getStorageUrl(data.about.foto_path);
        setPreview(imageURL);
      }
    }
  }, [data, setValue]);

  // Handle image selection preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        addToast('Ukuran file foto maksimal 2MB.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 2. Save mutation
  const mutation = useMutation({
    mutationFn: apiService.updateAbout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAbout'] });
      queryClient.invalidateQueries({ queryKey: ['publicAbout'] });
      addToast('Konten Tentang Kami berhasil diperbarui!', 'success');
      if (fileInputRef.current) fileInputRef.current.value = ''; // Reset file input
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Gagal menyimpan konten Tentang Kami.', 'error');
    },
    onSettled: () => setSaving(false),
  });

  const onSubmit = (formData) => {
    setSaving(true);

    // Use FormData for file upload support
    const dataPayload = new FormData();
    dataPayload.append('konten_teks', formData.konten_teks);
    
    const file = fileInputRef.current?.files[0];
    if (file) {
      dataPayload.append('foto', file);
    }

    mutation.mutate(dataPayload);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <span className="font-body text-sm text-neutral-500">Memuat konten tentang kami...</span>
      </div>
    );
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-modal shadow-soft p-8 max-w-3xl text-left">
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Narrative Form */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="konten_teks" className="font-body text-sm font-semibold text-neutral-900">
              Narasi Sejarah & Kisah Brand
            </label>
            <textarea
              id="konten_teks"
              rows="12"
              required
              {...register('konten_teks')}
              className="px-4 py-2.5 bg-white border border-neutral-200 rounded-lg font-body text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all resize-none"
            />
            <span className="font-body text-xs text-neutral-400">TIPS: Gunakan enter 2x untuk memisahkan antar paragraf agar tampil rapi di halaman depan.</span>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="self-start px-6 py-3 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed text-white font-body text-sm font-bold rounded-lg shadow-soft active:scale-[0.98] transition-all flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Simpan Tentang Kami
              </>
            )}
          </button>
        </div>

        {/* Photo Upload Card */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <span className="font-body text-sm font-semibold text-neutral-900">Foto Utama Tentang Kami</span>
          
          {/* Upload Dropzone / Preview */}
          <div className="w-full aspect-[4/3] rounded-card border-2 border-dashed border-neutral-300 bg-neutral-50 flex flex-col items-center justify-center relative overflow-hidden group">
            {preview ? (
              <>
                <img src={preview} alt="Tentang RUV" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-neutral-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 bg-white text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors shadow-soft"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="p-2 bg-white text-error rounded-full hover:bg-neutral-100 transition-colors shadow-soft"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center gap-2 text-neutral-400 cursor-pointer hover:text-neutral-600 transition-colors"
              >
                <Upload className="w-10 h-10" />
                <span className="font-body text-xs font-semibold">Upload Foto Baru</span>
                <span className="text-[10px]">JPG, PNG, WebP (Maks 2MB)</span>
              </div>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/jpg,image/webp"
            className="hidden"
          />
        </div>

      </form>
    </div>
  );
};
export default EditAbout;
