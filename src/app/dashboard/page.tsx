import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import MainLayout from '@/layouts/MainLayout';
import DashboardContent from '@/components/DashboardContent';

export default async function DashboardPage() {
  const user = await currentUser();

  // If not authenticated, redirect to sign-in
  if (!user) {
    redirect('/sign-in');
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <DashboardContent />
      </div>
    </MainLayout>
  );
}
