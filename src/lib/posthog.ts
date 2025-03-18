'use client';

import posthog from 'posthog-js';

// Check for required environment variables
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    capture_pageview: false, // We'll capture these manually
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') {
        // Disable PostHog tracking in development
        posthog.opt_out_capturing();
      }
    },
  });
}

export { posthog }; 