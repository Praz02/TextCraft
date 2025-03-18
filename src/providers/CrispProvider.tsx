'use client';

import { useEffect } from 'react';
import { initCrisp } from '@/lib/crisp';

type CrispProviderProps = {
  children: React.ReactNode;
};

export default function CrispProvider({ children }: CrispProviderProps) {
  useEffect(() => {
    // Initialize Crisp chat on the client side
    initCrisp();
  }, []);

  return <>{children}</>;
} 