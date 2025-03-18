import { supabase } from './supabase';
import { Template } from './supabase';

/**
 * Get all templates for a user
 */
export async function getUserTemplates(userId: string): Promise<Template[]> {
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user templates:', error);
    return [];
  }

  return data as Template[];
}

/**
 * Get public templates
 */
export async function getPublicTemplates(): Promise<Template[]> {
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching public templates:', error);
    return [];
  }

  return data as Template[];
}

/**
 * Get a single template by ID
 */
export async function getTemplateById(templateId: string): Promise<Template | null> {
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .eq('id', templateId)
    .single();

  if (error) {
    console.error('Error fetching template:', error);
    return null;
  }

  return data as Template;
}

/**
 * Create a new template
 */
export async function createTemplate(template: Omit<Template, 'id' | 'created_at' | 'updated_at'>): Promise<Template | null> {
  const { data, error } = await supabase
    .from('templates')
    .insert([template])
    .select()
    .single();

  if (error) {
    console.error('Error creating template:', error);
    return null;
  }

  return data as Template;
}

/**
 * Update a template
 */
export async function updateTemplate(templateId: string, template: Partial<Omit<Template, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<Template | null> {
  const { data, error } = await supabase
    .from('templates')
    .update(template)
    .eq('id', templateId)
    .select()
    .single();

  if (error) {
    console.error('Error updating template:', error);
    return null;
  }

  return data as Template;
}

/**
 * Delete a template
 */
export async function deleteTemplate(templateId: string): Promise<boolean> {
  const { error } = await supabase
    .from('templates')
    .delete()
    .eq('id', templateId);

  if (error) {
    console.error('Error deleting template:', error);
    return false;
  }

  return true;
} 