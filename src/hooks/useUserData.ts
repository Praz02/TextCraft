import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import type { UserProfile, UserPreferences } from '@/utils/supabase';

type UserData = {
  profile: UserProfile | null;
  preferences: UserPreferences | null;
  loading: boolean;
  error: string | null;
  refreshUserData: () => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
};

export function useUserData(): UserData {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch user data from API endpoint instead of directly using Supabase
      const response = await fetch('/api/user-data');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load user data');
      }
      
      const data = await response.json();
      
      setProfile(data.profile);
      setPreferences(data.preferences);
    } catch (err) {
      console.error('Error in fetchUserData:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    if (!user?.id) {
      setError('User not authenticated');
      return;
    }

    try {
      const response = await fetch('/api/user-data', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          preferences: newPreferences,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update preferences');
      }

      // Refresh the data after update
      await fetchUserData();
    } catch (err) {
      console.error('Error updating preferences:', err);
      setError(err instanceof Error ? err.message : 'Failed to update preferences');
    }
  };

  // Fetch user data when the user is loaded
  useEffect(() => {
    if (isUserLoaded && user?.id) {
      fetchUserData();
    } else if (isUserLoaded && !user) {
      setLoading(false);
      setProfile(null);
      setPreferences(null);
    }
  }, [isUserLoaded, user?.id]);

  return {
    profile,
    preferences,
    loading,
    error,
    refreshUserData: fetchUserData,
    updatePreferences
  };
} 