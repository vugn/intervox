'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { listSessionsByUser } from '@/lib/data-service';
import Link from 'next/link';
import { FileText, Play, Clock, CheckCircle, BarChart2, ArrowRight, Database } from 'lucide-react';
import * as motion from 'motion/react-client';
import AdminDashboard from './admin-dashboard';

export default function Dashboard() {
  const { user, userData, loading: authLoading } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      if (authLoading) return;
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const sessionsData = await listSessionsByUser(user.id);
        setSessions(sessionsData as any[]);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div><p className="mt-4 text-slate-500">{authLoading ? "Authenticating..." : "Loading data..."}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center max-w-md w-full">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Authentication Required</h2>
          <p className="text-slate-600 mb-6">Please log in to view your interview dashboard and reports.</p>
          <Link href="/auth" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors inline-block">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (userData?.role === 'lecturer') {
    if (typeof window !== 'undefined') {
      window.location.replace('/lecturer');
    }
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500">Mengalihkan ke Dashboard Dosen...</p>
      </div>
    );
  }

  if (userData?.role === 'administrator' || userData?.role === 'dean') {
    return <AdminDashboard />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900">Halo, {userData?.displayName || userData?.fullName || user?.user_metadata?.full_name || 'Pengguna'} 👋</h1>
          <p className="text-slate-500 mt-1 text-sm">Pantau progres latihan interview kamu.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/seed" className="border border-slate-200 text-slate-600 px-3 py-2 rounded-xl font-medium hover:bg-slate-50 transition-colors text-sm flex items-center gap-1.5 hidden sm:flex">
            <Database className="w-4 h-4" />
            Data Contoh
          </Link>
          <Link
            href="/interview/setup"
            className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2 text-sm"
          >
            Interview Baru
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-blue-100 text-blue-600">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Interview</p>
            <p className="text-3xl font-bold text-slate-900">{sessions.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-emerald-100 text-emerald-600">
            <CheckCircle className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Selesai</p>
            <p className="text-3xl font-bold text-slate-900">
              {sessions.filter(s => s.status === 'completed' || s.status === 'analyzing' || s.status === 'pending_analysis').length}
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-amber-100 text-amber-600">
            <BarChart2 className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Rata-rata Skor</p>
            <p className="text-3xl font-bold text-slate-900">
              {sessions.filter(s => s.score).length > 0
                ? Math.round(sessions.reduce((acc, s) => acc + (s.score || 0), 0) / sessions.filter(s => s.score).length)
                : '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Interviews Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg md:text-xl font-bold text-slate-900">Riwayat Interview</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-10 md:p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Belum ada interview</h3>
            <p className="text-slate-500 mb-6 text-sm">Mulai simulasi AI interview pertamamu dan dapatkan laporan performa lengkap.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/interview/setup" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors text-sm">
                Mulai Interview Pertama
              </Link>
              <Link href="/admin/seed" className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl font-medium hover:bg-slate-50 transition-colors text-sm">
                Muat Data Contoh
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                    <th className="px-6 py-4 font-medium">Posisi</th>
                    <th className="px-6 py-4 font-medium">Bahasa</th>
                    <th className="px-6 py-4 font-medium">Skor</th>
                    <th className="px-6 py-4 font-medium">Tanggal</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sessions.map((session, i) => (
                    <motion.tr
                      key={session.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-slate-50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{session.jobRole}</div>
                        {session.company && <div className="text-xs text-slate-400">{session.company}</div>}
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-sm">{session.language}</td>
                      <td className="px-6 py-4">
                        {session.score ? (
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-indigo-50 text-indigo-700 border border-indigo-100">
                              {session.score}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-sm italic">Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-sm">
                        {new Date(session.createdAt).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${session.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                            session.status === 'analyzing' ? 'bg-amber-100 text-amber-700' :
                              session.status === 'pending_analysis' ? 'bg-indigo-100 text-indigo-700' :
                              'bg-slate-100 text-slate-700'
                          }`}>
                          {session.status === 'completed' ? 'Completed' : session.status === 'analyzing' ? 'Analyzing' : session.status === 'pending_analysis' ? 'Needs Analysis' : session.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/dashboard/report/${session.id}`} className="text-indigo-600 font-medium hover:text-indigo-700 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          Lihat Laporan
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {sessions.map((session, i) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 truncate">{session.jobRole}</p>
                      {session.company && <p className="text-xs text-slate-400">{session.company}</p>}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-xs text-slate-400">{new Date(session.createdAt).toLocaleDateString('id-ID')}</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${session.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                            session.status === 'analyzing' ? 'bg-amber-100 text-amber-700' :
                              session.status === 'pending_analysis' ? 'bg-indigo-100 text-indigo-700' :
                              'bg-slate-100 text-slate-700'
                          }`}>
                          {session.status === 'completed' ? 'Completed' : session.status === 'analyzing' ? 'Analyzing' : session.status === 'pending_analysis' ? 'Needs Analysis' : session.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {session.score ? (
                        <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {session.score}
                        </div>
                      ) : null}
                      <Link href={`/dashboard/report/${session.id}`} className="text-indigo-600 font-medium text-sm hover:text-indigo-700">
                        Laporan →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
