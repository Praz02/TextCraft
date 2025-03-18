'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { posthog } from '@/lib/posthog';

/**
 * Analytics component that sets up various analytics and tracking services.
 * This component doesn't render anything visible but handles analytics initialization.
 */
export function Analytics() {
  const { user, isLoaded } = useUser();

  // Associate user data with analytics tools when user is loaded
  useEffect(() => {
    if (isLoaded && user) {
      // Identify user in PostHog
      posthog.identify(user.id, {
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName,
        clerk_id: user.id,
      });
    }
  }, [isLoaded, user]);

  return null;
} 