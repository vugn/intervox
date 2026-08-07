'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Mic, Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';

type Tab = 'signin' | 'signup' | 'forgot';

export default function AuthPage() {
  const { user, signInWithEmail, signUpWithEmail, resetPassword } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Sign In state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up state
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirm, setSignUpConfirm] = useState('');

  // Forgot Password state
  const [forgotEmail, setForgotEmail] = useState('');

  useEffect(() => {
    if (user) router.push('/dashboard');
  }, [user, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmail(signInEmail, signInPassword);
    } catch (err: any) {
      setError(getSupabaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (signUpPassword !== signUpConfirm) {
      setError('Passwords do not match.');
      return;
    }
    if (signUpPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setSuccess('');
    try {
      const result = await signUpWithEmail(signUpEmail, signUpPassword, signUpName);
      if (result.confirmEmail) {
        setSuccess('🎉 Pendaftaran berhasil! Cek email kamu dan klik link konfirmasi untuk mengaktifkan akun. Setelah itu, kamu bisa login.');
        setTab('signin');
        setSignUpName('');
        setSignUpEmail('');
        setSignUpPassword('');
        setSignUpConfirm('');
      } else {
        // No email confirmation needed — user is logged in immediately
        // The useEffect will redirect to /dashboard
        setSuccess('🎉 Pendaftaran berhasil! Mengalihkan ke dashboard...');
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(getSupabaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await resetPassword(forgotEmail);
      setSuccess('Password reset email sent! Check your inbox.');
    } catch (err: any) {
      setError(getSupabaseError(err));
    } finally {
      setLoading(false);
    }
  };


  const switchTab = (newTab: Tab) => {
    setTab(newTab);
    setError('');
    setSuccess('');
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors text-sm";

  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-slate-50 p-4 min-h-screen">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-8 text-center text-white">
          <Link href="/" className="inline-flex items-center gap-2 text-white/90 mb-4">
            <Mic className="w-6 h-6" />
            <span className="font-display font-bold text-xl">Intervox</span>
          </Link>
          <h1 className="text-2xl font-display font-bold">
            {tab === 'signin' && 'Selamat Datang Kembali'}
            {tab === 'signup' && 'Buat Akun Baru'}
            {tab === 'forgot' && 'Reset Password'}
          </h1>
          <p className="text-indigo-200 text-sm mt-1">
            {tab === 'signin' && 'Login untuk melanjutkan latihan interview'}
            {tab === 'signup' && 'Mulai perjalanan interview practice-mu'}
            {tab === 'forgot' && 'Masukkan email untuk reset password'}
          </p>
        </div>

        <div className="p-8">
          {/* Tab Switcher */}
          {tab !== 'forgot' && (
            <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
              <button
                onClick={() => switchTab('signin')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'signin' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Masuk
              </button>
              <button
                onClick={() => switchTab('signup')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'signup' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Daftar
              </button>
            </div>
          )}

          {/* Error / Success */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
              {success}
            </div>
          )}

          {/* Sign In Form */}
          {tab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  placeholder="email@example.com"
                  value={signInEmail}
                  onChange={e => setSignInEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={signInPassword}
                    onChange={e => setSignInPassword(e.target.value)}
                    className={`${inputClass} pr-11`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button type="button" onClick={() => switchTab('forgot')} className="text-xs text-indigo-600 hover:underline mt-1 float-right">
                  Lupa password?
                </button>
              </div>
              <div className="pt-2">
                <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Masuk
                </button>
              </div>
            </form>
          )}

          {/* Sign Up Form */}
          {tab === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  placeholder="Nama kamu"
                  value={signUpName}
                  onChange={e => setSignUpName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  placeholder="email@example.com"
                  value={signUpEmail}
                  onChange={e => setSignUpEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Min. 6 karakter"
                    value={signUpPassword}
                    onChange={e => setSignUpPassword(e.target.value)}
                    className={`${inputClass} pr-11`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Konfirmasi Password</label>
                <input
                  type="password"
                  required
                  placeholder="Ulangi password"
                  value={signUpConfirm}
                  onChange={e => setSignUpConfirm(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="pt-2">
                <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Buat Akun
                </button>
              </div>
            </form>
          )}

          {/* Forgot Password Form */}
          {tab === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  placeholder="email@example.com"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Kirim Link Reset
              </button>
              <button type="button" onClick={() => switchTab('signin')} className="w-full text-sm text-slate-500 hover:text-indigo-600 transition-colors">
                ← Kembali ke halaman masuk
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function getSupabaseError(err: any): string {
  const message = err?.message || err?.error_description || '';

  if (message.includes('Invalid login credentials')) return 'Email atau password salah.';
  if (message.includes('User already registered')) return 'Email sudah terdaftar. Coba masuk.';
  if (message.includes('Password should be at least')) return 'Password terlalu lemah.';
  if (message.includes('Unable to validate email')) return 'Format email tidak valid.';
  if (message.includes('Email rate limit exceeded')) return 'Terlalu banyak percobaan. Coba lagi nanti.';
  if (message.includes('popup_closed')) return 'Login dibatalkan.';

  return message || 'Terjadi kesalahan. Coba lagi.';
}
