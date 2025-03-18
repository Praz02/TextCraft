import { supabase } from './supabase';
import { UserProfile } from './supabase';

/**
 * Get a user profile by Clerk ID
 */
export async function getUserProfileByClerkId(clerkId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('clerk_id', clerkId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data as UserProfile;
}

/**
 * Create a new user profile (will use a server action in production)
 */
export async function createUserProfile(profile: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>): Promise<UserProfile | null> {
  try {
    // In a real implementation, this would be a server action or API route
    // For now, use the client supabase instance for testing
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([profile])
      .select()
      .single();

    if (error) {
      console.error('Error creating user profile:', error);
      return null;
    }

    return data as UserProfile;
  } catch (error) {
    console.error('Error creating user profile:', error);
    return null;
  }
}

/**
 * Update a user profile
 */
export async function updateUserProfile(clerkId: string, profile: Partial<Omit<UserProfile, 'id' | 'clerk_id' | 'created_at' | 'updated_at'>>): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(profile)
    .eq('clerk_id', clerkId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user profile:', error);
    return null;
  }

  return data as UserProfile;
}

/**
 * Delete a user profile (will use a server action in production)
 */
export async function deleteUserProfile(clerkId: string): Promise<boolean> {
  try {
    // In a real implementation, this would be a server action or API route
    // For now, use the client supabase instance for testing
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('clerk_id', clerkId);

    if (error) {
      console.error('Error deleting user profile:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting user profile:', error);
    return false;
  }
} 