# TextCraft Supabase Setup Guide

This guide explains how to set up the Supabase database for TextCraft.

## Prerequisites

1. A Supabase account and project
2. The SQL scripts from this repository:
   - `supabase-setup.sql` - For user profiles and preferences tables
   - `templates-generated-texts-setup.sql` - For templates and generated texts tables

## Setup Instructions

1. **Log in to your Supabase Dashboard**
   - Go to https://app.supabase.com/
   - Select your project

2. **Run the SQL Scripts**
   - Navigate to SQL Editor in the left sidebar
   - Create a new query
   - Paste the contents of `supabase-setup.sql` and run it
   - Create another query
   - Paste the contents of `templates-generated-texts-setup.sql` and run it

3. **Verify Table Creation**
   - Go to Table Editor in the left sidebar
   - You should see the following tables:
     - `user_profiles`
     - `user_preferences`
     - `templates`
     - `generated_texts`

## Authentication Setup

TextCraft uses Clerk for authentication and syncs user data to Supabase. Make sure your Clerk webhook is configured to create and update user profiles in Supabase.

## Testing the Connection

1. Make sure you have the correct environment variables set in your `.env.local` file:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://lsembqvbdhfikjnydpzs.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzZW1icXZiZGhmaWtqbnlkcHpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1ODY1MTIsImV4cCI6MjA1NzE2MjUxMn0._lAJjr_V_UJP30gpNsMILcsdkp6oGfLDj5-RoKJC_t4
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzZW1icXZiZGhmaWtqbnlkcHpzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTU4NjUxMiwiZXhwIjoyMDU3MTYyNTEyfQ.7TIooG9V-kREScMb5SDa7kYy0Wq0cw_5K3LC1v1SXTw
   ```

2. Start your development server:
   ```
   npm run dev
   ```

3. Visit `/supabase-test` in your browser to verify the connection and test CRUD operations.

## Tables Schema Overview

### 1. user_profiles
- Stores basic user information linked to Clerk IDs
- Contains fields for subscription status

### 2. user_preferences
- Stores user preferences like theme settings
- Linked to user_profiles by user_id

### 3. templates
- Stores text templates created by users
- Can be marked as public or private
- Linked to user_profiles by user_id

### 4. generated_texts
- Stores text content generated from templates
- Contains fields for the original prompt and generation settings
- Linked to user_profiles by user_id and optionally to templates

## Row Level Security (RLS)

All tables have Row Level Security enabled with policies that ensure:
- Users can only read, update, and delete their own data
- Templates marked as public can be seen by all users
- Generated texts are private to the user who created them