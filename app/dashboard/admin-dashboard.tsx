import { useEffect, useState } from 'react';
import { listAllUsers, listAllSessions } from '@/lib/data-service';
import Link from 'next/link';
import { Users, FileText, Settings, UserCheck, ShieldCheck, Activity, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function AdminDashboard() {
  const { userData } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingUsers: 0,
    totalSessions: 0,
    completedSessions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [users, sessions] = await Promise.all([
          listAllUsers(),
          listAllSessions()
        ]);
        
        setStats({
          totalUsers: (users as any[]).length,
          pendingUsers: (users as any[]).filter(u => u.accountStatus === 'pending').length,
          totalSessions: (sessions as any[]).length,
          completedSessions: (sessions as any[]).filter(s => ['completed', 'analyzing', 'pending_analysis'].includes(s.status)).length
        });
      } catch (error) {
        console.error("Failed to load admin stats:", error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900">
          Dashboard Administrator
        </h1>
        <p className="text-slate-500 mt-1">Ringkasan aktivitas platform dan manajemen pengguna.</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-blue-100 text-blue-600">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Pengguna</p>
                <p className="text-3xl font-bold text-slate-900">{stats.totalUsers}</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-amber-100 text-amber-600">
                <UserCheck className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Menunggu Verifikasi</p>
                <p className="text-3xl font-bold text-slate-900">{stats.pendingUsers}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-indigo-100 text-indigo-600">
                <Activity className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Sesi Latihan</p>
                <p className="text-3xl font-bold text-slate-900">{stats.totalSessions}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-emerald-100 text-emerald-600">
                <FileText className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Sesi Selesai</p>
                <p className="text-3xl font-bold text-slate-900">{stats.completedSessions}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <h2 className="text-lg font-bold text-slate-900 mb-4">Akses Cepat</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/admin/users" className="group bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-all block">
              <ShieldCheck className="w-8 h-8 text-indigo-600 mb-4" />
              <h3 className="font-bold text-slate-900 mb-1">Verifikasi Pengguna</h3>
              <p className="text-sm text-slate-500 mb-4">Kelola akses dan periksa mahasiswa yang baru mendaftar.</p>
              <span className="text-sm font-semibold text-indigo-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                Kelola Pengguna <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            <Link href="/admin/settings" className="group bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-all block">
              <Settings className="w-8 h-8 text-indigo-600 mb-4" />
              <h3 className="font-bold text-slate-900 mb-1">Pengaturan Sistem</h3>
              <p className="text-sm text-slate-500 mb-4">Ubah data Tanda Tangan, QR Code, dan konfigurasi laporan.</p>
              <span className="text-sm font-semibold text-indigo-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                Buka Pengaturan <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            <Link href="/reports" className="group bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-all block">
              <FileText className="w-8 h-8 text-indigo-600 mb-4" />
              <h3 className="font-bold text-slate-900 mb-1">Laporan Akademik</h3>
              <p className="text-sm text-slate-500 mb-4">Akses 8 jenis laporan analitik mahasiswa dan modul.</p>
              <span className="text-sm font-semibold text-indigo-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                Lihat Laporan <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
