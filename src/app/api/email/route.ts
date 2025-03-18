import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, createContentEmailTemplate } from '@/utils/email';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - You must be signed in to send emails' },
        { status: 401 }
      );
    }

    // Parse request body
    const { to, subject, content, title } = await request.json();

    // Validate request
    if (!to || !subject || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, or content' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { error: 'Invalid email address format' },
        { status: 400 }
      );
    }

    // Create HTML email content
    const html = createContentEmailTemplate(content, title || 'Generated Content');

    // Send email using Resend
    const result = await sendEmail({
      to,
      subject,
      html,
    });

    return NextResponse.json({ success: true, message: 'Email sent successfully', data: result });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send email' },
      { status: 500 }
    );
  }
} 