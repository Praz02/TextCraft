-- TextCraft Database Reset and Setup Script
-- WARNING: This script will delete all existing tables and recreate them from scratch

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables with CASCADE to automatically remove all dependencies
DROP TABLE IF EXISTS generated_texts CASCADE;
DROP TABLE IF EXISTS templates CASCADE;
DROP TABLE IF EXISTS user_preferences CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Drop existing functions
DROP FUNCTION IF EXISTS update_timestamp;

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  subscription_status TEXT DEFAULT 'free',
  subscription_tier TEXT DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles table
CREATE POLICY "Users can read their own profile"
  ON user_profiles
  FOR SELECT
  USING (clerk_id = auth.uid()::TEXT);

-- Fixed policy to avoid using OLD reference directly, which was causing the error
CREATE POLICY "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  USING (clerk_id = auth.uid()::TEXT);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'system',
  notifications_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_user_preferences UNIQUE (user_id)
);

-- Enable RLS on user_preferences
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for user_preferences
CREATE POLICY "Users can read their own preferences"
  ON user_preferences
  FOR SELECT
  USING (
    user_id IN (
      SELECT id FROM user_profiles WHERE clerk_id = auth.uid()::TEXT
    )
  );

CREATE POLICY "Users can update their own preferences"
  ON user_preferences
  FOR UPDATE
  USING (
    user_id IN (
      SELECT id FROM user_profiles WHERE clerk_id = auth.uid()::TEXT
    )
  );

CREATE POLICY "Users can insert their own preferences"
  ON user_preferences
  FOR INSERT
  WITH CHECK (
    user_id IN (
      SELECT id FROM user_profiles WHERE clerk_id = auth.uid()::TEXT
    )
  );

-- Create templates table
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  category TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on templates
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Create policies for templates
CREATE POLICY "Users can read their own templates and public templates"
  ON templates
  FOR SELECT
  USING (
    user_id IN (
      SELECT id FROM user_profiles WHERE clerk_id = auth.uid()::TEXT
    ) OR is_public = TRUE
  );

CREATE POLICY "Users can insert their own templates"
  ON templates
  FOR INSERT
  WITH CHECK (
    user_id IN (
      SELECT id FROM user_profiles WHERE clerk_id = auth.uid()::TEXT
    )
  );

CREATE POLICY "Users can update their own templates"
  ON templates
  FOR UPDATE
  USING (
    user_id IN (
      SELECT id FROM user_profiles WHERE clerk_id = auth.uid()::TEXT
    )
  );

CREATE POLICY "Users can delete their own templates"
  ON templates
  FOR DELETE
  USING (
    user_id IN (
      SELECT id FROM user_profiles WHERE clerk_id = auth.uid()::TEXT
    )
  );

-- Create generated_texts table
CREATE TABLE IF NOT EXISTS generated_texts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  template_id UUID REFERENCES templates(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  prompt TEXT,
  generation_settings JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on generated_texts
ALTER TABLE generated_texts ENABLE ROW LEVEL SECURITY;

-- Create policies for generated_texts
CREATE POLICY "Users can read their own generated texts"
  ON generated_texts
  FOR SELECT
  USING (
    user_id IN (
      SELECT id FROM user_profiles WHERE clerk_id = auth.uid()::TEXT
    )
  );

CREATE POLICY "Users can insert their own generated texts"
  ON generated_texts
  FOR INSERT
  WITH CHECK (
    user_id IN (
      SELECT id FROM user_profiles WHERE clerk_id = auth.uid()::TEXT
    )
  );

CREATE POLICY "Users can update their own generated texts"
  ON generated_texts
  FOR UPDATE
  USING (
    user_id IN (
      SELECT id FROM user_profiles WHERE clerk_id = auth.uid()::TEXT
    )
  );

CREATE POLICY "Users can delete their own generated texts"
  ON generated_texts
  FOR DELETE
  USING (
    user_id IN (
      SELECT id FROM user_profiles WHERE clerk_id = auth.uid()::TEXT
    )
  );

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_timestamp
BEFORE UPDATE ON user_profiles
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_user_preferences_timestamp
BEFORE UPDATE ON user_preferences
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_templates_timestamp
BEFORE UPDATE ON templates
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_generated_texts_timestamp
BEFORE UPDATE ON generated_texts
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Allow service role access to all tables
CREATE POLICY "Service role access for user_profiles" 
ON user_profiles 
USING (auth.jwt() ->> 'role' = 'service_role');

COMMIT; 