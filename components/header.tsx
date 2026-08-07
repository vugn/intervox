'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mic, LogOut, Menu, X, User } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';
import { createPortal } from 'react-dom';

export default function Header() {
  const { user, userData, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const baseLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/interview/setup', label: 'Interview Baru' },
    { href: '/reports', label: 'Laporan' },
    { href: '/profile', label: 'Profil' },
  ];

  let navLinks = baseLinks;
  if (userData?.role === 'administrator') {
    navLinks = [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/reports', label: 'Laporan' },
        { href: '/admin/users', label: 'Verifikasi' },
        { href: '/profile', label: 'Profil' },
    ];
  } else if (userData?.role === 'lecturer') {
    navLinks = [
        { href: '/lecturer', label: 'Dashboard Dosen' },
        { href: '/lecturer/questions', label: 'Bank Soal' },
        { href: '/reports', label: 'Laporan' },
        { href: '/profile', label: 'Profil' },
    ];
  } else if (userData?.role === 'dean') {
    navLinks = [
        { href: '/dashboard', label: 'Dashboard Dean' },
        { href: '/reports', label: 'Laporan' },
        { href: '/profile', label: 'Profil' },
    ];
  }

  const getLogoHref = () => {
    if (!user) return '/';
    if (userData?.accountStatus === 'pending') return '/pending';
    if (userData?.role === 'lecturer') return '/lecturer';
    return '/dashboard';
  };

  return (
    <header className={`sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md print:hidden ${pathname?.startsWith('/reports') ? '[.wf-mode_&]:hidden' : ''}`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href={getLogoHref()} className="flex items-center gap-2 font-display font-bold text-xl text-indigo-600 flex-shrink-0">
          <Mic className="w-6 h-6" />
          <span>Intervox</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          {user && navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={`hover:text-indigo-600 transition-colors ${pathname === link.href ? 'text-indigo-600 font-semibold' : ''}`}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/profile" className="flex items-center gap-2">
                {user.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt={user.user_metadata?.full_name || 'User'} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                    {(user.user_metadata?.full_name || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-medium text-slate-700">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
              </Link>
              <button onClick={() => setShowLogoutModal(true)} className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-lg" title="Keluar">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link href="/auth" className="text-slate-600 hover:text-indigo-600 font-medium text-sm transition-colors">Masuk</Link>
          )}
          {user && (
            <Link href="/interview/setup" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors">
              Mulai Interview
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white shadow-lg">
          <nav className="container mx-auto px-4 py-4 space-y-1">
            {user && navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${pathname === link.href ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'}`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-slate-100 mt-2">
              {user ? (
                <div className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center gap-2">
                    {user.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} alt="User" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                        {(user.user_metadata?.full_name || user.email || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm font-medium text-slate-700 max-w-[160px] truncate">{user.user_metadata?.full_name || user.email}</span>
                  </div>
                  <button onClick={() => { setShowLogoutModal(true); setMobileOpen(false); }} className="text-slate-400 hover:text-red-500 transition-colors text-xs flex items-center gap-1">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link href="/auth" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                  Masuk / Daftar
                </Link>
              )}
              {user && (
                <Link
                  href="/interview/setup"
                  onClick={() => setMobileOpen(false)}
                  className="block mt-2 w-full text-center bg-indigo-600 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Mulai Interview
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* Logout Confirmation Modal rendered via Portal so it centers on the full window */}
      {showLogoutModal && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 transform transition-all">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4 mx-auto">
              <LogOut className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center mb-2">Konfirmasi Keluar</h3>
            <p className="text-sm text-slate-500 text-center mb-6 leading-relaxed">
              Apakah Anda yakin ingin keluar dari akun Intervox? Anda perlu masuk kembali untuk melanjutkan aktivitas Anda.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                disabled={isLoggingOut}
                className="flex-1 py-2.5 px-4 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={async () => {
                  setIsLoggingOut(true);
                  await logout();
                }}
                disabled={isLoggingOut}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoggingOut ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Keluar...
                  </>
                ) : (
                  'Ya, Keluar'
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}

