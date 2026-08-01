'use client';

import { useEffect, useState } from 'react';
import { listAllUsers, updateUserAccountStatus } from '@/lib/data-service';
import { notifyAccountApproved } from '@/app/actions/email';
import { useAuth } from '@/hooks/use-auth';
import { CheckCircle, XCircle, Clock, Search, AlertCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

type UserData = {
  id: string;
  email: string;
  fullName: string;
  role: string;
  accountStatus: 'pending' | 'approved' | 'rejected';
  createdAt: string;
};

export default function AdminUsersPage() {
  const { userData } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await listAllUsers();
      setUsers(data as UserData[]);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (userId: string, newStatus: 'approved' | 'rejected', userEmail: string, userName: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin mengubah status pengguna ini menjadi ${newStatus.toUpperCase()}?`)) return;

    setActionLoading(userId);
    try {
      await updateUserAccountStatus(userId, newStatus);
      
      // Update local state
      setUsers(users.map(u => u.id === userId ? { ...u, accountStatus: newStatus } : u));

      // Trigger Email Notification if approved
      if (newStatus === 'approved') {
        await notifyAccountApproved(userName, userEmail).catch(e => console.error("Email failed:", e));
      }

    } catch (error) {
      alert('Gagal mengupdate status pengguna.');
    } finally {
      setActionLoading(null);
    }
  };

  if (userData?.role !== 'administrator') {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl flex flex-col items-center max-w-sm text-center">
          <AlertCircle className="w-12 h-12 mb-4" />
          <h2 className="font-bold text-lg mb-2">Akses Ditolak</h2>
          <p className="text-sm">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  const filteredUsers = users.filter(u => {
    const matchesFilter = filter === 'all' || u.accountStatus === filter;
    const matchesSearch = u.fullName.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-6xl mx-auto w-full p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Verifikasi Pengguna</h1>
          <p className="text-slate-500 mt-1">Kelola akses mahasiswa ke platform Intervox.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium rounded-md capitalize transition-colors ${
                filter === f ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {f}
              {f === 'pending' && users.filter(u => u.accountStatus === 'pending').length > 0 && (
                <span className="ml-2 bg-amber-100 text-amber-700 py-0.5 px-2 rounded-full text-xs">
                  {users.filter(u => u.accountStatus === 'pending').length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            Tidak ada pengguna yang ditemukan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-medium">Nama & Email</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Tanggal Daftar</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{user.fullName}</div>
                      <div className="text-slate-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 capitalize text-slate-600">{user.role.replace('_', ' ')}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.accountStatus === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                        user.accountStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {user.accountStatus === 'approved' && <CheckCircle className="w-3 h-3" />}
                        {user.accountStatus === 'rejected' && <XCircle className="w-3 h-3" />}
                        {user.accountStatus === 'pending' && <Clock className="w-3 h-3" />}
                        {user.accountStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {user.accountStatus !== 'rejected' && (
                          <button
                            onClick={() => handleUpdateStatus(user.id, 'rejected', user.email, user.fullName)}
                            disabled={actionLoading === user.id}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Tolak"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        )}
                        {user.accountStatus !== 'approved' && (
                          <button
                            onClick={() => handleUpdateStatus(user.id, 'approved', user.email, user.fullName)}
                            disabled={actionLoading === user.id}
                            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50"
                          >
                            {actionLoading === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                            Terima
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Bar */}
            <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-slate-600">
              <div>
                Menampilkan <span className="font-semibold text-slate-900">{filteredUsers.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> - <span className="font-semibold text-slate-900">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> dari <span className="font-semibold text-slate-900">{filteredUsers.length}</span> pengguna
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white transition-colors"
                  title="Halaman Sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-3 py-1 font-medium bg-indigo-50 text-indigo-700 rounded-lg">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white transition-colors"
                  title="Halaman Berikutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
