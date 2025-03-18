import SupabaseTest from '@/components/SupabaseTest';

export const metadata = {
  title: 'Supabase Test - TextCraft',
  description: 'Test Supabase connection and CRUD operations',
};

export default function SupabaseTestPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Supabase Connection Test</h1>
      <p className="mb-6">
        This page tests the connection to Supabase and verifies CRUD operations for templates and generated texts.
      </p>
      <div className="bg-white rounded-lg shadow">
        <SupabaseTest />
      </div>
    </div>
  );
} 