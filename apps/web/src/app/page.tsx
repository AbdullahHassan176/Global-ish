import { Suspense } from 'react';
import { Dashboard } from '@/components/dashboard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Suspense fallback={<LoadingSpinner />}>
        <Dashboard />
      </Suspense>
    </main>
  );
}
