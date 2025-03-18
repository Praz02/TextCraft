'use client';

import { useUserData } from '@/hooks/useUserData';
import { useUser } from '@clerk/nextjs';
import UserAccount from './UserAccount';

export default function DashboardContent() {
  const { user } = useUser();
  const { profile, preferences, loading, error } = useUserData();

  if (loading) {
    return <div className="text-center p-4">Loading your data...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="card p-6 bg-white shadow rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Your Account</h2>
        <div className="space-y-2">
          <p>Welcome, {user?.firstName || 'User'}!</p>
          <p className="text-gray-600">Email: {user?.emailAddresses[0]?.emailAddress}</p>
          {profile && (
            <div className="mt-4 pt-4 border-t">
              <h3 className="text-lg font-medium mb-2">Account Information</h3>
              <p className="text-gray-600">Subscription: {profile.subscription_tier || 'Free'}</p>
              <p className="text-gray-600">Status: {profile.subscription_status || 'Active'}</p>
            </div>
          )}
        </div>
      </div>

      {preferences && (
        <div className="card p-6 bg-white shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Your Preferences</h2>
          <div className="space-y-2">
            <p className="text-gray-600">Theme: {preferences.theme || 'System'}</p>
            <p className="text-gray-600">
              Notifications: {preferences.notifications_enabled ? 'Enabled' : 'Disabled'}
            </p>
          </div>
        </div>
      )}
      
      <UserAccount />
    </div>
  );
} 