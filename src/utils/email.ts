import { Resend } from 'resend';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send an email using Resend
 * 
 * @param to - Recipient email address
 * @param subject - Email subject
 * @param html - HTML content of the email
 * @param from - Sender email address (defaults to a no-reply address)
 * @returns Promise with the result of the email sending operation
 */
export async function sendEmail({
  to,
  subject,
  html,
  from = 'TextCraft <no-reply@textcraft.ai>',
}: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Error sending email:', error);
      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

/**
 * Creates a formatted HTML email for TextCraft generated content
 * 
 * @param content - The generated text content
 * @param title - The title for the content
 * @returns HTML string for the email
 */
export function createContentEmailTemplate(content: string, title: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          border-bottom: 2px solid #f0f0f0;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        .logo {
          font-weight: bold;
          font-size: 20px;
          color: #4F46E5;
        }
        .content {
          white-space: pre-wrap;
          margin-bottom: 30px;
        }
        .footer {
          font-size: 12px;
          color: #666;
          border-top: 1px solid #f0f0f0;
          padding-top: 15px;
          margin-top: 30px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">TextCraft</div>
      </div>
      <h1>${title}</h1>
      <div class="content">
        ${content.replace(/\n/g, '<br>')}
      </div>
      <div class="footer">
        <p>This content was generated using TextCraft AI</p>
      </div>
    </body>
    </html>
  `;
} 