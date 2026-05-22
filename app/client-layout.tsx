'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

function WireframeModeToggle() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const envWireframeEnabled = process.env.NEXT_PUBLIC_WIREFRAME_MODE === 'true';
    const wireframeParam = searchParams.get('wf');
    const isWireframe = wireframeParam === '1' || (wireframeParam !== '0' && envWireframeEnabled);
    document.body.classList.toggle('wf-mode', isWireframe);

    return () => {
      document.body.classList.remove('wf-mode');
    };
  }, [searchParams]);

  return null;
}

function ProtectedRouteGuard({ children }: { children: React.ReactNode }) {
  const { user, userData, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

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
  }, [user, userData, loading, pathname, router]);

  // If loading and trying to access a protected route, don't flash content
  if (loading && (pathname.startsWith('/dashboard') || pathname.startsWith('/interview') || pathname.startsWith('/profile') || pathname.startsWith('/reports') || pathname.startsWith('/admin'))) {
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
        <WireframeModeToggle />
      </Suspense>
      <ProtectedRouteGuard>
        {children}
      </ProtectedRouteGuard>
    </AuthProvider>
  );
}
