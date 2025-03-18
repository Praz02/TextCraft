import { NextResponse } from 'next/server';

// Instead of auth, just return dummy data for now
export async function GET() {
  // Return dummy user profile data
  const userData = {
    userId: 'dummy-user-id',
    profile: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: 'Demo User',
      bio: 'Content creator and marketer',
      usage: {
        textGenerations: 0,
        templatesUsed: 0,
        currentPlan: 'Free'
      }
    }
  };
  
  return NextResponse.json(userData);
} 