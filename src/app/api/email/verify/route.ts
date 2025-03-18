import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function GET(request: NextRequest) {
  try {
    // Get the API key from environment variables
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { 
          status: 'error',
          configured: false,
          message: 'Resend API key is not configured' 
        },
        { status: 500 }
      );
    }
    
    // Check if the API key is valid by initializing Resend
    const resend = new Resend(apiKey);
    
    return NextResponse.json({ 
      status: 'success',
      configured: true,
      message: 'Resend API key is properly configured' 
    });
  } catch (error) {
    console.error('Resend API verification error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        configured: false,
        message: error instanceof Error ? error.message : 'Failed to verify Resend API key'
      },
      { status: 500 }
    );
  }
} 