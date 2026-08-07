'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useWireframe } from '@/app/client-layout';
import { listUserFeedbacks, getSystemSettings } from '@/lib/data-service';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, Star, User, Download } from 'lucide-react';
import * as motion from 'motion/react-client';
import ReportTemplate from '@/components/report-template';

const DEMO_FEEDBACKS = [
  { id: 'f1', rating: 5, comments: 'Platform ini sangat membantu latihan interview saya! AI-nya terasa seperti interviewer nyata. Saya jadi lebih percaya diri.', submitted_at: '2026-08-05T10:30:00Z', users: { full_name: 'Gus Tiran', email: 'gustiranda3014@gmail.com' } },
  { id: 'f2', rating: 4, comments: 'Fitur transkripnya bagus sekali. Bisa review jawaban saya setelah sesi selesai. Minta tambah fitur rekap mingguan.', submitted_at: '2026-08-04T14:15:00Z', users: { full_name: 'Dimas Pratama', email: 'dimas.pratama@student.uniska.ac.id' } },
  { id: 'f3', rating: 5, comments: 'Rekomendasi pengembangan dari AI sangat spesifik dan actionable. Berbeda dengan feedback umum yang biasanya saya dapat.', submitted_at: '2026-08-03T09:00:00Z', users: { full_name: 'Andika Putra', email: 'andika.p@student.uniska.ac.id' } },
  { id: 'f4', rating: 3, comments: 'Bagus tapi kadang respons AI sedikit lambat. Overall pengalaman latihan sangat positif.', submitted_at: '2026-08-01T16:45:00Z', users: { full_name: 'Rina Septiani', email: 'rina.s@student.uniska.ac.id' } },
];

export default function UserFeedbackReport() {
  const { user, userData, loading: authLoading } = useAuth();
  const isWireframe = useWireframe();
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [headOfProgram, setHeadOfProgram] = useState<any>(null);

  const allowedRoles = ['administrator', 'dean', 'head_of_program', 'lecturer'];

  useEffect(() => {
    const fetchFeedbacks = async () => {
      if (authLoading) return;
      if (!user || !allowedRoles.includes(userData?.role)) {
        if (isWireframe) setFeedbacks(DEMO_FEEDBACKS.slice(0, 5));
        setLoading(false);
        return;
      }

      try {
        let data = await listUserFeedbacks();
        if (isWireframe && (!data || data.length === 0)) data = DEMO_FEEDBACKS;
        if (isWireframe && data) data = data.slice(0, 5);
        setFeedbacks(data || []);
        const settings = await getSystemSettings('head_of_program_signature');
        setHeadOfProgram(settings);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
        if (isWireframe) setFeedbacks(DEMO_FEEDBACKS.slice(0, 5));
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [user, userData, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isWireframe && (!user || !allowedRoles.includes(userData?.role))) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center max-w-md w-full">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Akses Ditolak</h2>
          <p className="text-slate-600 mb-6">Anda tidak memiliki izin untuk melihat laporan ini.</p>
          <Link href="/dashboard" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors inline-block">
            Ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const averageRating = feedbacks.length > 0 
    ? (feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length).toFixed(1)
    : 0;

  return (
    <ReportTemplate
      title="Laporan Feedback Pengguna"
      subtitle="Umpan balik dan penilaian dari mahasiswa setelah menggunakan platform."
      requireSignature={true}
      headOfProgram={headOfProgram}
    >
      <div className="mb-6 flex items-center justify-between gap-4 print:hidden [.wf-mode_&]:hidden">
        <Link href="/reports" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Kembali ke Daftar Laporan
        </Link>
        <button onClick={() => window.print()} className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" />Export PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm col-span-1 md:col-span-1 flex flex-col justify-center items-center text-center">
           <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Rating Rata-rata</h3>
           <div className="text-5xl font-black text-slate-900 mb-2">{averageRating}</div>
           <div className="flex gap-1 text-amber-400">
             {[1,2,3,4,5].map(star => (
               <Star key={star} className={`w-5 h-5 ${star <= Math.round(Number(averageRating)) ? 'fill-current' : 'text-slate-200'}`} />
             ))}
           </div>
           <p className="text-slate-500 text-sm mt-2">Dari {feedbacks.length} ulasan</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" /> Daftar Umpan Balik
          </h2>
        </div>
        <div className="divide-y divide-slate-100">
          {feedbacks.length === 0 ? (
            <div className="p-8 text-center text-slate-500">Belum ada feedback yang dikirimkan pengguna.</div>
          ) : (
            feedbacks.map((fb, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={fb.id} 
                className="p-6 hover:bg-slate-50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold text-slate-900">{fb.users?.full_name || 'Anonim'}</span>
                      <span className="text-slate-400 text-sm">({fb.users?.email})</span>
                    </div>
                    <div className="text-sm text-slate-500 mb-3">
                      {new Date(fb.submitted_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {fb.comments ? (
                      <p className="text-slate-700 bg-white border border-slate-100 p-4 rounded-xl">{fb.comments}</p>
                    ) : (
                      <p className="text-slate-400 italic">Tidak ada pesan teks.</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 shrink-0">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="font-bold text-amber-700">{fb.rating}/5</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </ReportTemplate>
  );
}
