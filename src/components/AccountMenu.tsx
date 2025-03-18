'use client';

import { useState } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { useUserData } from '@/hooks/useUserData';
import Link from 'next/link';

// Clerk account URLs - using the same domain as specified in the environment variables
const CLERK_USER_PROFILE_URL = 'https://accounts.clerk.com/user';

export default function AccountMenu() {
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const { profile } = useUserData();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleSignOut = () => {
    signOut();
    closeMenu();
  };

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
      >
        <span className="font-medium hidden md:inline-block">
          {user?.firstName || 'Account'}
        </span>
        <svg
          className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
            <p className="text-xs text-gray-500 truncate">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
            {profile?.subscription_tier !== 'free' && (
              <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                {profile?.subscription_tier}
              </span>
            )}
          </div>

          <Link
            href="/dashboard"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={closeMenu}
          >
            Dashboard
          </Link>
          <Link
            href="/settings"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={closeMenu}
          >
            Settings
          </Link>
          <a
            href={CLERK_USER_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={closeMenu}
          >
            Manage Profile
          </a>
          <button
            onClick={handleSignOut}
            className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
} 