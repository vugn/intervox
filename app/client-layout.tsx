'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuthProvider } from '@/hooks/use-auth';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
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

  return <AuthProvider>{children}</AuthProvider>;
}
