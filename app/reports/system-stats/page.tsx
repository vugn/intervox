'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getSystemUsageStats, getSystemSettings } from '@/lib/data-service';
import Link from 'next/link';
import { ArrowLeft, Activity, Clock, FileText, CheckCircle, Download } from 'lucide-react';
import * as motion from 'motion/react-client';
import ReportTemplate from '@/components/report-template';

export default function SystemStatsReport() {
  const { user, userData, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [headOfProgram, setHeadOfProgram] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (authLoading) return;
      if (!user || (userData?.role !== 'administrator' && userData?.role !== 'head_of_program')) {
        setLoading(false);
        return;
      }

      try {
        const data = await getSystemUsageStats();
        setStats(data);
        const settings = await getSystemSettings('head_of_program_signature');
        setHeadOfProgram(settings);
      } catch (error) {
        console.error("Error fetching system stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, userData, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || (userData?.role !== 'administrator' && userData?.role !== 'head_of_program')) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center max-w-md w-full">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Akses Ditolak</h2>
          <p className="text-slate-600 mb-6">Laporan ini khusus untuk Administrator dan Ketua Program.</p>
          <Link href="/dashboard" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors inline-block">
            Ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ReportTemplate
      title="Laporan Statistik Penggunaan Sistem"
      subtitle="Data analitik penggunaan modul wawancara oleh mahasiswa secara keseluruhan."
      requireSignature={true}
      headOfProgram={headOfProgram}
    >
      <div className="mb-6 flex items-center justify-between gap-4 print:hidden">
        <Link href="/reports" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Kembali ke Daftar Laporan
        </Link>
        <button onClick={() => window.print()} className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" />Export PDF
        </button>
      </div>

      {!stats ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
          <p className="text-slate-500">Data statistik belum tersedia. Harap pastikan tabel view telah dibuat di database.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-indigo-100 text-indigo-600">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Sesi</p>
              <p className="text-3xl font-bold text-slate-900">{stats.total_sessions || 0}</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-emerald-100 text-emerald-600">
              <CheckCircle className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Sesi Selesai</p>
              <p className="text-3xl font-bold text-slate-900">{stats.completed_sessions || 0}</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-blue-100 text-blue-600">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Rata-rata Durasi Latihan</p>
              <p className="text-2xl font-bold text-slate-900">{stats.avg_duration_minutes ? `${Math.round(stats.avg_duration_minutes)} Menit` : '-'}</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-amber-100 text-amber-600">
              <Activity className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Modul Terpopuler</p>
              <p className="text-xl font-bold text-slate-900 truncate">{stats.most_popular_module || '-'}</p>
            </div>
          </motion.div>

        </div>
      )}
    </ReportTemplate>
  );
}
