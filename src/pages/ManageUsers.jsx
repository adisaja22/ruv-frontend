import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Trash2, X, Save, Loader2, Users } from 'lucide-react';
import { apiService } from '../services/api';
import { useToast } from '../hooks/useToast';

export const ManageUsers = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Retrieve current logged in user from localStorage
  useEffect(() => {
    const u = localStorage.getItem('ruv_admin_user');
    if (u) setCurrentUser(JSON.parse(u));
  }, []);

  // 1. Fetch user list
  const { data: users, isLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: apiService.getUsers,
  });

  const schema = z.object({
    name: z.string().min(2, { message: 'Nama minimal 2 karakter.' }).max(255),
    email: z.string().min(1, { message: 'Email wajib diisi.' }).email({ message: 'Format email tidak valid.' }),
    password: z.string().min(6, { message: 'Password minimal 6 karakter.' }),
    role: z.enum(['administrator', 'user'], { errorMap: () => ({ message: 'Role tidak valid.' }) }),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  // Add Mutation
  const addMutation = useMutation({
    mutationFn: apiService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      addToast('User baru berhasil didaftarkan!', 'success');
      closeModal();
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Gagal mendaftarkan user.', 'error');
    },
    onSettled: () => setSaving(false),
  });

  // Update Role Mutation
  const roleMutation = useMutation({
    mutationFn: ({ id, role }) => apiService.updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      addToast('Peran user berhasil diperbarui!', 'success');
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Gagal memperbarui peran.', 'error');
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: apiService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      addToast('Akses user berhasil dicabut!', 'success');
    },
    onError: (err) => {
      addToast(err.response?.data?.message || 'Gagal menghapus user.', 'error');
    },
  });

  const closeModal = () => {
    setModalOpen(false);
    reset();
  };

  const onSubmit = (formData) => {
    setSaving(true);
    addMutation.mutate(formData);
  };

  const handleRoleChange = (id, newRole) => {
    roleMutation.mutate({ id, role: newRole });
  };

  const handleDelete = (id, role) => {
    if (currentUser && currentUser.id === id) {
      addToast('Anda tidak dapat menghapus akun Anda sendiri.', 'error');
      return;
    }

    if (role === 'administrator') {
      const adminsCount = (users || []).filter(u => u.role === 'administrator').length;
      if (adminsCount <= 1) {
        addToast('Tidak dapat menghapus. Harus ada minimal satu administrator di sistem.', 'error');
        return;
      }
    }

    if (window.confirm('Apakah Anda yakin ingin mencabut hak akses user ini?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left font-body">
      <div className="flex justify-between items-center">
        <h3 className="font-heading text-lg font-bold text-neutral-900">Kelola Akses Admin & Staff</h3>
        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 bg-primary text-neutral-900 font-body text-sm font-bold rounded-lg shadow-soft flex items-center gap-2 hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah Akses User
        </button>
      </div>

      {/* Users List Table */}
      <div className="bg-white border border-neutral-200 rounded-modal shadow-soft overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="font-body text-sm text-neutral-500">Memuat data user...</span>
          </div>
        ) : (users || []).length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h4 className="font-heading text-base font-bold text-neutral-700">Belum ada user</h4>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-neutral-100 border-b border-neutral-200">
                  <th className="px-6 py-4 font-heading text-xs font-bold text-neutral-900 text-left uppercase tracking-wider">Nama Lengkap</th>
                  <th className="px-6 py-4 font-heading text-xs font-bold text-neutral-900 text-left uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 font-heading text-xs font-bold text-neutral-900 text-left uppercase tracking-wider">Peran (Role)</th>
                  <th className="px-6 py-4 font-heading text-xs font-bold text-neutral-900 text-left uppercase tracking-wider">Bergabung Pada</th>
                  <th className="px-6 py-4 font-heading text-xs font-bold text-neutral-900 text-center uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {(users || []).map((u) => {
                  const isSelf = currentUser && currentUser.id === u.id;
                  const dateJoined = new Date(u.created_at).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  });

                  return (
                    <tr key={u.id} className="border-b border-neutral-200 hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4 font-body text-sm font-semibold text-neutral-900 flex items-center gap-2">
                        {u.name}
                        {isSelf && (
                          <span className="text-[9px] bg-neutral-900 text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                            Saya
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-body text-sm text-neutral-700">{u.email}</td>
                      <td className="px-6 py-4">
                        <select
                          value={u.role}
                          disabled={isSelf} // Prevent demoting self directly
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="px-3 py-1.5 bg-neutral-100 border border-neutral-200 rounded text-xs font-semibold focus:outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-75"
                        >
                          <option value="administrator">Administrator</option>
                          <option value="user">User Biasa / Staff</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 font-body text-xs text-neutral-400 font-semibold">{dateJoined}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDelete(u.id, u.role)}
                          disabled={isSelf} // Cannot delete self
                          className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors border border-transparent disabled:opacity-30 disabled:hover:bg-transparent"
                          aria-label="Cabut akses"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* ADD USER MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div onClick={closeModal} className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" />
          
          <div className="relative w-full max-w-md bg-white rounded-modal shadow-xl border border-neutral-200 overflow-hidden z-10 animate-modal-in">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-100">
              <h3 className="font-heading text-base font-bold text-neutral-900">Daftarkan User / Admin Baru</h3>
              <button onClick={closeModal} className="text-neutral-400 hover:text-neutral-700 p-1 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-4">
              
              {/* Nama */}
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-xs font-semibold text-neutral-900">Nama Lengkap</label>
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  {...register('name')}
                  className={`px-4 py-2 bg-white border rounded-lg font-body text-sm focus:outline-none transition-all ${
                    errors.name ? 'border-error' : 'border-neutral-200 focus:border-secondary'
                  }`}
                />
                {errors.name && <span className="text-xs text-error font-medium">{errors.name.message}</span>}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-xs font-semibold text-neutral-900">Email Address</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  {...register('email')}
                  className={`px-4 py-2 bg-white border rounded-lg font-body text-sm focus:outline-none transition-all ${
                    errors.email ? 'border-error' : 'border-neutral-200 focus:border-secondary'
                  }`}
                />
                {errors.email && <span className="text-xs text-error font-medium">{errors.email.message}</span>}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-xs font-semibold text-neutral-900">Password</label>
                <input
                  type="password"
                  placeholder="Minimal 6 karakter"
                  {...register('password')}
                  className={`px-4 py-2 bg-white border rounded-lg font-body text-sm focus:outline-none transition-all ${
                    errors.password ? 'border-error' : 'border-neutral-200 focus:border-secondary'
                  }`}
                />
                {errors.password && <span className="text-xs text-error font-medium">{errors.password.message}</span>}
              </div>

              {/* Role */}
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-xs font-semibold text-neutral-900">Peran Hak Akses (Role)</label>
                <select
                  {...register('role')}
                  className="px-4 py-2 bg-white border border-neutral-200 rounded-lg font-body text-sm focus:outline-none focus:border-secondary"
                >
                  <option value="user">User Biasa / Staff</option>
                  <option value="administrator">Administrator (Akses Penuh)</option>
                </select>
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
                      Mendaftarkan...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Daftarkan User
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
export default ManageUsers;
