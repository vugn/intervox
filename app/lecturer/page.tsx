'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { listAllSessions, listAllUsers } from '@/lib/data-service';
import Link from 'next/link';
import { Users, FileText, BarChart2, ChevronRight, FileSpreadsheet } from 'lucide-react';
import * as motion from 'motion/react-client';

export default function LecturerDashboard() {
  const { user, userData, loading: authLoading } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
            });
        });

        allSessions.forEach((session: any) => {
            if (studentMap.has(session.userId)) {
                const studentData = studentMap.get(session.userId);
                studentData.sessions.push(session);
                studentData.totalSessions++;
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900">Dashboard Dosen Pembimbing</h1>
          <p className="text-slate-500 mt-1 text-sm">Pantau aktivitas dan progres wawancara mahasiswa didik Anda.</p>
        </div>
        <div className="flex gap-2">
           <Link href="/reports/active-participants" className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2">
             <FileSpreadsheet className="w-4 h-4" /> Laporan Rekap
           </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-blue-100 text-blue-600">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Mahasiswa Aktif</p>
            <p className="text-3xl font-bold text-slate-900">{activeStudents.length} <span className="text-lg font-normal text-slate-400">/ {students.length}</span></p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-emerald-100 text-emerald-600">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Simulasi Wawancara</p>
            <p className="text-3xl font-bold text-slate-900">{totalSimulations}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-amber-100 text-amber-600">
            <BarChart2 className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Rata-rata Skor Keseluruhan</p>
            <p className="text-3xl font-bold text-slate-900">
              {activeStudents.length > 0 
                ? Math.round(activeStudents.reduce((acc, s) => acc + s.averageScore, 0) / activeStudents.length)
                : '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Daftar Mahasiswa & Progres</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="px-6 py-4 font-medium">Mahasiswa</th>
                <th className="px-6 py-4 font-medium text-center">Total Sesi</th>
                <th className="px-6 py-4 font-medium text-center">Rata-rata Skor</th>
                <th className="px-6 py-4 font-medium">Sesi Terakhir</th>
                <th className="px-6 py-4 font-medium text-right">Laporan Utama</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    Belum ada data mahasiswa.
                  </td>
                </tr>
              ) : (
                students.map((student, i) => (
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
      </div>
    </div>
  );
}
