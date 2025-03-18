# Clerk and Supabase Integration Setup

This document explains how to set up and configure the integration between Clerk (for authentication) and Supabase (for data storage) in the TextCraft application.

## Prerequisites

1. A Clerk account (https://clerk.com)
2. A Supabase account (https://supabase.com)
3. Node.js and npm installed

## 1. Clerk Setup

### Create a Clerk Application

1. Sign up or log in to your Clerk account at https://dashboard.clerk.com
2. Create a new application or use an existing one
3. Go to the API Keys section and copy your Publishable Key and Secret Key
4. Configure your application's authentication settings (sign-in, sign-up, after-sign-in URLs, etc.)

### Configure Webhook Endpoint

1. Go to your Clerk Dashboard > Webhooks
2. Create a new webhook endpoint with the URL: `https://your-domain.com/api/webhooks/clerk`
3. Select the following events:
   - user.created
   - user.updated
   - user.deleted
4. Copy the webhook signing secret to use in your environment variables

## 2. Supabase Setup

### Create a Supabase Project

1. Sign up or log in to your Supabase account at https://app.supabase.com
2. Create a new project or use an existing one
3. Navigate to Project Settings > API to get your API URL and anon/service role keys

### Set Up Database Tables

1. Go to the SQL Editor in your Supabase Dashboard
2. Create the necessary tables by running the SQL queries in the `supabase-setup.sql` file
3. These commands will:
   - Create user_profiles table
   - Create user_preferences table
   - Set up appropriate permissions with Row Level Security
   - Create triggers for updating timestamps

## 3. Environment Configuration

Update your `.env.local` file with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
CLERK_WEBHOOK_SECRET=whsec_sSBK49DefsYdrklrbGSDGkCky8ZLG9dX

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://lsembqvbdhfikjnydpzs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzZW1icXZiZGhmaWtqbnlkcHpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1ODY1MTIsImV4cCI6MjA1NzE2MjUxMn0._lAJjr_V_UJP30gpNsMILcsdkp6oGfLDj5-RoKJC_t4
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzZW1icXZiZGhmaWtqbnlkcHpzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTU4NjUxMiwiZXhwIjoyMDU3MTYyNTEyfQ.7TIooG9V-kREScMb5SDa7kYy0Wq0cw_5K3LC1v1SXTw
```

## 4. Data Flow

With this integration:

1. Users sign up/in through Clerk's hosted UI
2. When a user is created in Clerk, a webhook is triggered to create a corresponding record in Supabase's `user_profiles` table
3. The application uses the Clerk user ID to fetch related data from Supabase
4. User profile updates in Clerk are synchronized to Supabase via webhooks
5. Supabase stores extended user data like subscription status and preferences

## 5. Testing the Integration

1. Register a new user through your application
2. Check the Supabase database to ensure a corresponding record was created in the `user_profiles` table
3. Update user information in Clerk and verify it's reflected in Supabase
4. Delete a test user in Clerk and verify the corresponding records are deleted in Supabase

## Troubleshooting

- **Webhook Errors**: Check your server logs for any webhook verification errors
- **Missing User Data**: Ensure the Clerk webhook is properly configured and your server can receive webhook events
- **Database Access Issues**: Verify your Supabase connection strings and permissions

## Security Considerations

- The service role key is used server-side only and should never be exposed to the client
- Row Level Security in Supabase ensures users can only access their own data
- Webhook verification ensures that only legitimate Clerk events are processed 