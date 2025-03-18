'use client';

import { Amplify } from 'aws-amplify';

// Check for required environment variables
const hasRequiredVars = typeof window !== 'undefined' && 
  process.env.NEXT_PUBLIC_AWS_REGION && 
  process.env.NEXT_PUBLIC_AWS_USER_POOLS_ID && 
  process.env.NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID;

if (!hasRequiredVars && typeof window !== 'undefined') {
  console.error('AWS Amplify environment variables are missing');
}

// Export Amplify for use in components
export { Amplify }; 