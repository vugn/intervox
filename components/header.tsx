'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mic, LogOut, Menu, X, User } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';

export default function Header() {
  const { user, userData, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const baseLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/interview/setup', label: 'Interview Baru' },
    { href: '/reports', label: 'Laporan' },
    { href: '/profile', label: 'Profil' },
  ];

  const isAdmin = userData?.role === 'admin';
  const navLinks = isAdmin
    ? [...baseLinks.slice(0, 3), { href: '/admin', label: 'Admin' }, baseLinks[3]]
    : baseLinks;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md print:hidden">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 font-display font-bold text-xl text-indigo-600 flex-shrink-0">
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
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                    {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-medium text-slate-700">{user.displayName || user.email?.split('@')[0]}</span>
              </Link>
              <button onClick={logout} className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-lg" title="Keluar">
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
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                        {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm font-medium text-slate-700 max-w-[160px] truncate">{user.displayName || user.email}</span>
                  </div>
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="text-slate-400 hover:text-red-500 transition-colors text-xs flex items-center gap-1">
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
    </header>
  );
}

