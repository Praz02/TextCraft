import MainLayout from '@/layouts/MainLayout';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const user = await currentUser();
  
  // Redirect if not logged in
  if (!user) {
    redirect('/sign-in');
  }
  
  return (
    <MainLayout>
      <div className="py-16 mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '80rem' }}>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
          
          <div className="card mb-8">
            <div className="flex items-center">
              {user.imageUrl && (
                <img 
                  src={user.imageUrl}
                  alt={`${user.firstName || ''} ${user.lastName || ''}`}
                  className="w-20 h-20 rounded-full mr-4"
                />
              )}
              <div>
                <h2 className="text-xl font-semibold">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{user.emailAddresses[0]?.emailAddress}</p>
              </div>
            </div>
          </div>
          
          <div className="card mb-8">
            <h2 className="text-xl font-semibold mb-4">Account Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <div className="input flex items-center">
                  <span>{user.emailAddresses[0]?.emailAddress}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Member Since
                </label>
                <div className="input flex items-center">
                  <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Usage Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Text Generations</div>
                <div className="text-2xl font-bold">0</div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Templates Used</div>
                <div className="text-2xl font-bold">0</div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Current Plan</div>
                <div className="text-xl font-bold">Free</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 