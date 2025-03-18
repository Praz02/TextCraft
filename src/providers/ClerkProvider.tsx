import { ClerkProvider as CoreClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { ReactNode } from 'react';

type ClerkProviderProps = {
  children: ReactNode;
};

export default function ClerkProvider({ children }: ClerkProviderProps) {
  return (
    <CoreClerkProvider
      appearance={{
        baseTheme: dark,
        elements: {
          formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
          footerActionLink: 'text-blue-600 hover:text-blue-700',
        },
      }}
    >
      {children}
    </CoreClerkProvider>
  );
}
