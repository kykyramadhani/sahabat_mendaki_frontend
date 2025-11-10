'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface WithAuthProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function WithAuth({ children, allowedRoles }: WithAuthProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in, redirect to login
        router.replace('/login');
      } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Not authorized for this role
        router.replace('/');
      }
    }
  }, [loading, user, router, allowedRoles]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return null;
  }

  return <>{children}</>;
}