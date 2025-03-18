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
-- Users can read their own templates and public templates
CREATE POLICY "Users can read their own templates and public templates"
  ON templates
  FOR SELECT
  USING (
    user_id IN (
      SELECT id FROM user_profiles WHERE clerk_id = auth.uid()::TEXT
    ) OR is_public = TRUE
  );

-- Users can insert their own templates
CREATE POLICY "Users can insert their own templates"
  ON templates
  FOR INSERT
  WITH CHECK (
    user_id IN (
      SELECT id FROM user_profiles WHERE clerk_id = auth.uid()::TEXT
    )
  );

-- Users can update their own templates
CREATE POLICY "Users can update their own templates"
  ON templates
  FOR UPDATE
  USING (
    user_id IN (
      SELECT id FROM user_profiles WHERE clerk_id = auth.uid()::TEXT
    )
  );

-- Users can delete their own templates
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
-- Users can read their own generated texts
CREATE POLICY "Users can read their own generated texts"
  ON generated_texts
  FOR SELECT
  USING (
    user_id IN (
      SELECT id FROM user_profiles WHERE clerk_id = auth.uid()::TEXT
    )
  );

-- Users can insert their own generated texts
CREATE POLICY "Users can insert their own generated texts"
  ON generated_texts
  FOR INSERT
  WITH CHECK (
    user_id IN (
      SELECT id FROM user_profiles WHERE clerk_id = auth.uid()::TEXT
    )
  );

-- Users can update their own generated texts
CREATE POLICY "Users can update their own generated texts"
  ON generated_texts
  FOR UPDATE
  USING (
    user_id IN (
      SELECT id FROM user_profiles WHERE clerk_id = auth.uid()::TEXT
    )
  );

-- Users can delete their own generated texts
CREATE POLICY "Users can delete their own generated texts"
  ON generated_texts
  FOR DELETE
  USING (
    user_id IN (
      SELECT id FROM user_profiles WHERE clerk_id = auth.uid()::TEXT
    )
  );

-- Create triggers to update timestamps
CREATE TRIGGER update_templates_timestamp
BEFORE UPDATE ON templates
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_generated_texts_timestamp
BEFORE UPDATE ON generated_texts
FOR EACH ROW EXECUTE FUNCTION update_timestamp(); 