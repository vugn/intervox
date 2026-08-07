'use client';

import { useEffect, Suspense, createContext, useContext } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

const WireframeContext = createContext(false);

export const useWireframe = () => useContext(WireframeContext);

function WireframeProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const envWireframeEnabled = process.env.NEXT_PUBLIC_WIREFRAME_MODE === 'true';
  const wireframeParam = searchParams.get('wf');
  const isWireframe = wireframeParam === '1' || (wireframeParam !== '0' && envWireframeEnabled);

  useEffect(() => {
    document.body.classList.toggle('wf-mode', isWireframe);
    return () => {
      document.body.classList.remove('wf-mode');
    };
  }, [isWireframe]);

  return (
    <WireframeContext.Provider value={isWireframe}>
      {children}
    </WireframeContext.Provider>
  );
}

function BrowserWrapper({ children }: { children: React.ReactNode }) {
  const isWireframe = useWireframe();
  const pathname = usePathname();

  if (!isWireframe || pathname?.startsWith('/reports')) return <>{children}</>;

  return (
    <div className="min-h-screen bg-slate-200 p-4 md:p-8 flex items-start justify-center font-sans">
      <div className="w-full max-w-[1440px] bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-300 flex flex-col">
        {/* Browser Topbar */}
        <div className="h-14 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-4 shrink-0">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-white border border-slate-200 rounded-md px-4 py-1.5 text-sm text-slate-500 w-full max-w-xl text-center truncate flex items-center justify-center gap-2 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              localhost:3000{pathname}
            </div>
          </div>
          <div className="w-16"></div> {/* Spacer to keep URL centered */}
        </div>
        {/* Browser Content */}
        <div className="bg-white relative">
          {children}
        </div>
      </div>
    </div>
  );
}

function ProtectedRouteGuard({ children }: { children: React.ReactNode }) {
  const { user, userData, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isWireframe = useWireframe();

  useEffect(() => {
    if (loading || isWireframe) return;

    const isProtectedRoute = pathname.startsWith('/dashboard') || 
                             pathname.startsWith('/interview') || 
                             pathname.startsWith('/profile') || 
                             pathname.startsWith('/reports') || 
                             pathname.startsWith('/admin');

    if (isProtectedRoute) {
      if (!user) {
        router.replace('/auth');
      } else if (userData?.accountStatus === 'pending') {
        router.replace('/pending');
      }
    }
  }, [user, userData, loading, pathname, router, isWireframe]);

  // If loading and trying to access a protected route, don't flash content
  if (loading && !isWireframe && (pathname.startsWith('/dashboard') || pathname.startsWith('/interview') || pathname.startsWith('/profile') || pathname.startsWith('/reports') || pathname.startsWith('/admin'))) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return <>{children}</>;
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Suspense fallback={null}>
        <WireframeProvider>
          <BrowserWrapper>
            <ProtectedRouteGuard>
              {children}
            </ProtectedRouteGuard>
          </BrowserWrapper>
        </WireframeProvider>
      </Suspense>
    </AuthProvider>
  );
}
