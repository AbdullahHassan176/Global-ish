'use client';

import { useSession } from 'next-auth/react';
import { SignInButton } from './auth/sign-in-button';
import { DashboardContent } from './dashboard/dashboard-content';

export function Dashboard() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Global Next Portal
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Sign in to access your dashboard
            </p>
          </div>
          <div className="mt-8 space-y-6">
            <SignInButton />
          </div>
        </div>
      </div>
    );
  }

  return <DashboardContent user={session.user} />;
}
