'use client';

import { PostHogProvider } from 'posthog-js/react';
import { posthog } from '@/lib/posthog';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

type PHProviderProps = {
  children: React.ReactNode;
};

export function PHProvider({ children }: PHProviderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track pageviews
  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname;
      if (searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      posthog.capture('$pageview', {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
} 