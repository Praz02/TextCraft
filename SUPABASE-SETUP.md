# TextCraft Supabase Setup Guide

This guide provides simple instructions to set up Supabase for TextCraft.

## 1. Reset Your Supabase Database

1. **Log in to Supabase**
   - Go to https://app.supabase.com/
   - Select your TextCraft project

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run the Reset Script**
   - Copy the entire contents of `supabase-reset.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute

4. **Check the Tables**
   - Go to "Table Editor" in the left sidebar
   - Verify that these tables were created:
     - `user_profiles`
     - `user_preferences`
     - `templates`
     - `generated_texts`

## 2. Connect TextCraft to Supabase

Make sure your `.env.local` file contains these variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://lsembqvbdhfikjnydpzs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzZW1icXZiZGhmaWtqbnlkcHpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1ODY1MTIsImV4cCI6MjA1NzE2MjUxMn0._lAJjr_V_UJP30gpNsMILcsdkp6oGfLDj5-RoKJC_t4
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzZW1icXZiZGhmaWtqbnlkcHpzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTU4NjUxMiwiZXhwIjoyMDU3MTYyNTEyfQ.7TIooG9V-kREScMb5SDa7kYy0Wq0cw_5K3LC1v1SXTw
```

## 3. Test the Setup

1. **Start your server**
   ```
   npm run dev
   ```

2. **Visit the test page**
   - Go to `/supabase-test` in your browser
   - Sign in with Clerk
   - Click "Run Test Operations"
   - Verify that test data is created successfully

## Troubleshooting

- **Error dropping tables**: The CASCADE option should handle dependencies automatically. If you still encounter errors, make sure there are no active connections blocking the operation.

- **Connection errors**: Double-check your Supabase environment variables.

- **Missing user profile**: Make sure the Clerk webhook is properly configured to create user profiles in Supabase when users sign up. 