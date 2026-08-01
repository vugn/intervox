'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { listAllSessions, listAllUsers } from '@/lib/data-service';
import Link from 'next/link';
import { Users, FileText, BarChart2, ChevronRight, FileSpreadsheet, Search, ChevronLeft } from 'lucide-react';
import * as motion from 'motion/react-client';

export default function LecturerDashboard() {
  const { user, userData, loading: authLoading } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      if (authLoading) return;
      if (!user || userData?.role !== 'lecturer') {
        setLoading(false);
        return;
      }
      
      try {
        const [allSessions, allUsers] = await Promise.all([
          listAllSessions(),
          listAllUsers()
        ]);
        
        // Group sessions by userId
        const studentMap = new Map();
        
        // Filter users to only include students (we can also filter by department if needed in the future)
        const studentUsers = allUsers.filter((u: any) => u.role === 'student');
        
        studentUsers.forEach((student: any) => {
            studentMap.set(student.id, {
                ...student,
                sessions: [],
                totalSessions: 0,
                averageScore: 0,
                pendingVerifications: 0,
            });
        });

        allSessions.forEach((session: any) => {
            if (studentMap.has(session.userId)) {
                const studentData = studentMap.get(session.userId);
                studentData.sessions.push(session);
                studentData.totalSessions++;
                if (session.status === 'pending-verification') {
                    studentData.pendingVerifications++;
                }
            }
        });

        // Calculate averages
        const studentList = Array.from(studentMap.values()).map(student => {
            const sessionsWithScore = student.sessions.filter((s: any) => s.score);
            if (sessionsWithScore.length > 0) {
                student.averageScore = Math.round(
                    sessionsWithScore.reduce((acc: number, s: any) => acc + (s.score || 0), 0) / sessionsWithScore.length
                );
            }
            return student;
        }).sort((a, b) => b.totalSessions - a.totalSessions);

        setStudents(studentList);
      } catch (error) {
        console.error("Error fetching lecturer data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, userData, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 min-h-screen">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 ml-3">Memuat data mahasiswa...</p>
      </div>
    );
  }

  if (!user || userData?.role !== 'lecturer') {
    return (
      <div className="flex-1 flex items-center justify-center p-4 min-h-screen">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center max-w-md w-full">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Akses Ditolak</h2>
          <p className="text-slate-600 mb-6">Halaman ini khusus untuk Dosen Pembimbing.</p>
          <Link href="/dashboard" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors inline-block">
            Ke Dashboard Utama
          </Link>
        </div>
      </div>
    );
  }

  const activeStudents = students.filter(s => s.totalSessions > 0);
  const totalSimulations = students.reduce((acc, s) => acc + s.totalSessions, 0);

  const filteredStudents = students.filter(s => {
    const q = search.toLowerCase();
    return (s.fullName || '').toLowerCase().includes(q) || (s.email || '').toLowerCase().includes(q);
  });

  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / itemsPerPage));
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900">Dashboard Dosen Pembimbing</h1>
          <p className="text-slate-500 mt-1 text-sm">Pantau aktivitas dan progres wawancara mahasiswa didik Anda.</p>
        </div>
        <div className="flex flex-wrap gap-2">
           <Link href="/lecturer/questions" className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm">
             <FileText className="w-4 h-4" /> Kelola Bank Soal
           </Link>
           <Link href="/reports" className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2">
             <FileSpreadsheet className="w-4 h-4" /> Laporan Dosen
           </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Mahasiswa</p>
            <p className="text-2xl font-bold text-slate-900">{students.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Simulasi Wawancara</p>
            <p className="text-2xl font-bold text-slate-900">{totalSimulations}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Rata-rata Skor Kelas</p>
            <p className="text-2xl font-bold text-slate-900">
              {activeStudents.length > 0 
                ? Math.round(activeStudents.reduce((acc, s) => acc + s.averageScore, 0) / activeStudents.length)
                : '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-900">Daftar Mahasiswa & Progres</h2>
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama atau email mahasiswa..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="px-6 py-4 font-medium">Mahasiswa</th>
                <th className="px-6 py-4 font-medium text-center">Total Sesi</th>
                <th className="px-6 py-4 font-medium text-center">Rata-rata Skor</th>
                <th className="px-6 py-4 font-medium text-center">Menunggu Validasi</th>
                <th className="px-6 py-4 font-medium">Sesi Terakhir</th>
                <th className="px-6 py-4 font-medium text-right">Laporan Utama</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    Tidak ada mahasiswa yang ditemukan.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student, i) => (
                  <motion.tr 
                    key={student.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{student.fullName}</div>
                      <div className="text-xs text-slate-500">{student.email}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-sm font-medium bg-slate-100 text-slate-700">
                        {student.totalSessions} sesi
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {student.totalSessions > 0 ? (
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {student.averageScore}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-sm italic">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {student.pendingVerifications > 0 ? (
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-sm font-medium bg-rose-100 text-rose-700">
                          {student.pendingVerifications}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-sm italic">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {student.totalSessions > 0 
                        ? new Date(student.sessions[0].createdAt).toLocaleDateString('id-ID')
                        : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {student.totalSessions > 0 ? (
                         <Link href={`/reports/score-evaluation?user=${student.id}`} className="inline-flex items-center gap-1 text-indigo-600 font-medium hover:text-indigo-700 text-sm transition-colors">
                           Lihat <ChevronRight className="w-4 h-4" />
                         </Link>
                      ) : (
                         <span className="text-slate-300 text-sm">Belum ada data</span>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-slate-600">
          <div>
            Menampilkan <span className="font-semibold text-slate-900">{filteredStudents.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> - <span className="font-semibold text-slate-900">{Math.min(currentPage * itemsPerPage, filteredStudents.length)}</span> dari <span className="font-semibold text-slate-900">{filteredStudents.length}</span> mahasiswa
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
    </div>
  );
}
