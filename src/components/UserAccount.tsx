'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

// Clerk account URLs - using the same domain as specified in the environment variables
const CLERK_USER_PROFILE_URL = 'https://accounts.clerk.com/user';
const CLERK_USER_SECURITY_URL = 'https://accounts.clerk.com/user/security';

export default function UserAccount() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div className="text-center">Loading account information...</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Account Management</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-md font-medium">Profile Information</h3>
          <p className="text-gray-600 text-sm">
            Manage your name, email, and account details
          </p>
          <div className="mt-2">
            <Link
              href={CLERK_USER_PROFILE_URL}
              target="_blank"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              Edit Profile
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 ml-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
          </div>
        </div>
        
        <div>
          <h3 className="text-md font-medium">Application Preferences</h3>
          <p className="text-gray-600 text-sm">
            Customize your experience with TextCraft
          </p>
          <div className="mt-2">
            <Link
              href="/settings"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              Edit Preferences
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 ml-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
          </div>
        </div>
        
        <div>
          <h3 className="text-md font-medium">Security Settings</h3>
          <p className="text-gray-600 text-sm">
            Update your password and security preferences
          </p>
          <div className="mt-2">
            <Link
              href={CLERK_USER_SECURITY_URL}
              target="_blank"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              Manage Security
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 ml-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 