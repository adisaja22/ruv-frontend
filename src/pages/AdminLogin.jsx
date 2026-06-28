import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Recycle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { apiService } from '../services/api';
import { useToast } from '../hooks/useToast';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if session expired notice is present in URL query
  useEffect(() => {
    if (searchParams.get('expired')) {
      addToast('Sesi Anda telah habis. Silakan masuk kembali.', 'warning');
    }
    
    // Redirect if already logged in
    const token = localStorage.getItem('ruv_admin_token');
    if (token) {
      navigate('/admin/dashboard');
    }
  }, [searchParams, navigate, addToast]);

  const schema = z.object({
    email: z.string().min(1, { message: 'Email wajib diisi.' }).email({ message: 'Format email tidak valid.' }),
    password: z.string().min(1, { message: 'Password wajib diisi.' }),
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await apiService.login(data);
      localStorage.setItem('ruv_admin_token', response.token);
      localStorage.setItem('ruv_admin_user', JSON.stringify(response.user));
      
      addToast('Login berhasil! Selamat datang.', 'success');
      navigate('/admin/dashboard');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        const fieldErrors = err.response.data.errors;
        Object.keys(fieldErrors).forEach((key) => {
          let msg = fieldErrors[key][0];
          if (msg.includes('Kredensial tidak cocok')) {
            msg = 'Email atau password yang Anda masukkan salah.';
          }
          setError(key, { message: msg });
        });
      } else {
        const fallbackMsg = err.response?.data?.message;
        const msgToShow = fallbackMsg && fallbackMsg.includes('Kredensial tidak cocok') 
          ? 'Email atau password yang Anda masukkan salah.' 
          : (fallbackMsg || 'Gagal login. Periksa koneksi internet Anda.');
        addToast(msgToShow, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 px-4 font-body">
      <div className="w-full max-w-md bg-white rounded-modal shadow-lg border border-neutral-200 p-8 flex flex-col gap-6">
        
        {/* Header Branding */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Recycle className="w-6 h-6 text-primary animate-spin-slow" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-neutral-900 mt-2">Masuk ke Portal Admin</h1>
          <p className="font-body text-xs text-neutral-400">Rongsok Utama Vrakasa (RUV)</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 text-left">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="font-body text-xs font-semibold text-neutral-950">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="admin@ruv.co.id"
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

          {/* Password */}
          <div className="flex flex-col gap-1.5 relative">
            <label htmlFor="password" className="font-body text-xs font-semibold text-neutral-950">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                {...register('password')}
                className={`w-full px-4 py-2.5 bg-white border rounded-lg font-body text-sm focus:outline-none transition-all ${
                  errors.password 
                    ? 'border-error focus:ring-2 focus:ring-error/20' 
                    : 'border-neutral-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-neutral-400 hover:text-neutral-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <span className="font-body text-xs text-error font-medium">{errors.password.message}</span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-3 bg-primary hover:bg-primary-dark disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed text-neutral-900 font-body text-sm font-bold rounded-lg shadow-soft active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Memproses masuk...
              </>
            ) : (
              'Masuk / Login'
            )}
          </button>
        </form>

        {/* Back to public link */}
        <div className="border-t border-neutral-100 pt-4 text-center">
          <a href="/" className="font-body text-xs text-neutral-500 hover:text-neutral-900 transition-colors font-medium">
            &larr; Kembali ke Beranda Utama
          </a>
        </div>

      </div>
    </div>
  );
};
export default AdminLogin;
