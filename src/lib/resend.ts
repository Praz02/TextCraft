import { Resend } from 'resend';

// Check for required environment variables
if (!process.env.RESEND_API_KEY) {
  console.error('RESEND_API_KEY is not defined in environment variables');
}

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

export default resend; 