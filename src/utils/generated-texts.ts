import { supabase } from './supabase';
import { GeneratedText } from './supabase';

/**
 * Get all generated texts for a user
 */
export async function getUserGeneratedTexts(userId: string): Promise<GeneratedText[]> {
  const { data, error } = await supabase
    .from('generated_texts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user generated texts:', error);
    return [];
  }

  return data as GeneratedText[];
}

/**
 * Get generated texts by template ID
 */
export async function getGeneratedTextsByTemplate(userId: string, templateId: string): Promise<GeneratedText[]> {
  const { data, error } = await supabase
    .from('generated_texts')
    .select('*')
    .eq('user_id', userId)
    .eq('template_id', templateId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching template-based generated texts:', error);
    return [];
  }

  return data as GeneratedText[];
}

/**
 * Get a single generated text by ID
 */
export async function getGeneratedTextById(textId: string): Promise<GeneratedText | null> {
  const { data, error } = await supabase
    .from('generated_texts')
    .select('*')
    .eq('id', textId)
    .single();

  if (error) {
    console.error('Error fetching generated text:', error);
    return null;
  }

  return data as GeneratedText;
}

/**
 * Create a new generated text
 */
export async function createGeneratedText(generatedText: Omit<GeneratedText, 'id' | 'created_at' | 'updated_at'>): Promise<GeneratedText | null> {
  const { data, error } = await supabase
    .from('generated_texts')
    .insert([generatedText])
    .select()
    .single();

  if (error) {
    console.error('Error creating generated text:', error);
    return null;
  }

  return data as GeneratedText;
}

/**
 * Update a generated text
 */
export async function updateGeneratedText(textId: string, updates: Partial<Omit<GeneratedText, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<GeneratedText | null> {
  const { data, error } = await supabase
    .from('generated_texts')
    .update(updates)
    .eq('id', textId)
    .select()
    .single();

  if (error) {
    console.error('Error updating generated text:', error);
    return null;
  }

  return data as GeneratedText;
}

/**
 * Delete a generated text
 */
export async function deleteGeneratedText(textId: string): Promise<boolean> {
  const { error } = await supabase
    .from('generated_texts')
    .delete()
    .eq('id', textId);

  if (error) {
    console.error('Error deleting generated text:', error);
    return false;
  }

  return true;
} 