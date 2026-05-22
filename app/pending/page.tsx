'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Mail, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function PendingVerificationPage() {
  const { user, userData, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/');
      } else if (userData?.accountStatus === 'approved') {
        router.replace('/dashboard');
      } else if (userData?.accountStatus === 'rejected') {
        router.replace('/rejected');
      }
    }
  }, [user, userData, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!user || userData?.accountStatus !== 'pending') return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-amber-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Menunggu Verifikasi</h1>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          Terima kasih telah mendaftar, <strong>{userData.fullName}</strong>. Akun Anda saat ini sedang ditinjau oleh Administrator. Anda akan menerima email setelah akun disetujui.
        </p>

        <div className="bg-slate-50 rounded-xl p-4 mb-8 text-left border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900 mb-2">Apa selanjutnya?</h3>
          <ul className="text-sm text-slate-600 space-y-2">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0" />
              <span>Tim kami akan mengecek data pendaftaran Anda.</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0" />
              <span>Proses ini biasanya memakan waktu 1x24 jam.</span>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => window.location.reload()}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-xl font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Cek Status Terbaru
          </button>
          
          <button 
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-2 text-slate-600 hover:text-slate-900 py-3 px-4 rounded-xl font-medium transition-colors"
          >
            Keluar (Logout)
          </button>
        </div>
      </div>
    </div>
  );
}
