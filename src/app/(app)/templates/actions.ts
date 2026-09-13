'use server';

import { createClient } from '@/lib/supabase/server';
import {
  createTemplateSchema,
  updateTemplateSchema,
  deleteTemplateSchema,
  CreateTemplateInput,
  UpdateTemplateInput,
} from '@/lib/validation/template';
import { revalidatePath } from 'next/cache';

export interface ActionResponse<T = unknown> {
  success?: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

/**
 * Creates a new template and its associated fields.
 */
export async function createTemplate(
  payload: CreateTemplateInput
): Promise<ActionResponse<{ id: string }>> {
  // 1. Authenticate
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be signed in to perform this action.' };
  }

  // 2. Validate
  const parsed = createTemplateSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      error: 'Validation failed. Please check the fields.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, fields } = parsed.data;

  // 3. Mutate (Insert template)
  const { data: template, error: templateError } = await supabase
    .from('templates')
    .insert({
      tailor_id: user.id,
      name,
    })
    .select('id')
    .single();

  if (templateError || !template) {
    return { error: 'Failed to create template. Please try again.' };
  }

  // 4. Insert template fields with sequential order_index
  const fieldsToInsert = fields.map((field, idx) => ({
    template_id: template.id,
    field_name: field.field_name,
    unit: field.unit,
    order_index: idx,
  }));

  const { error: fieldsError } = await supabase
    .from('template_fields')
    .insert(fieldsToInsert);

  if (fieldsError) {
    // Attempt rollback/cleanup of orphaned template if fields fail
    await supabase.from('templates').delete().eq('id', template.id);
    return { error: 'Failed to save template fields. Please try again.' };
  }

  revalidatePath('/templates');
  revalidatePath('/dashboard');
  return { success: true, data: { id: template.id } };
}

/**
 * Updates an existing template and replaces/syncs its fields.
 */
export async function updateTemplate(
  payload: UpdateTemplateInput
): Promise<ActionResponse<{ id: string }>> {
  // 1. Authenticate
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be signed in to perform this action.' };
  }

  // 2. Validate
  const parsed = updateTemplateSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      error: 'Validation failed. Please check the fields.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { id: templateId, name, fields } = parsed.data;

  // 3. Verify ownership & update template name
  const { error: templateError } = await supabase
    .from('templates')
    .update({
      name,
      updated_at: new Date().toISOString(),
    })
    .eq('id', templateId)
    .eq('tailor_id', user.id)
    .is('deleted_at', null);

  if (templateError) {
    return { error: 'Failed to update template. Please try again.' };
  }

  // 4. Synchronize fields: delete existing fields and insert new ordered fields
  // (Order_index uniqueness is deferred, but deleting first ensures a clean sync)
  const { error: deleteFieldsError } = await supabase
    .from('template_fields')
    .delete()
    .eq('template_id', templateId);

  if (deleteFieldsError) {
    return { error: 'Failed to update template fields. Please try again.' };
  }

  const fieldsToInsert = fields.map((field, idx) => ({
    template_id: templateId,
    field_name: field.field_name,
    unit: field.unit,
    order_index: idx,
  }));

  const { error: insertFieldsError } = await supabase
    .from('template_fields')
    .insert(fieldsToInsert);

  if (insertFieldsError) {
    return { error: 'Failed to update template fields. Please try again.' };
  }

  revalidatePath('/templates');
  revalidatePath(`/templates/${templateId}/edit`);
  revalidatePath('/dashboard');
  return { success: true, data: { id: templateId } };
}

/**
 * Soft-deletes a template by setting deleted_at = now().
 * Satisfies FR-2.4 and DR-2: Historical measurements remain untouched.
 */
export async function deleteTemplate(
  templateId: string
): Promise<ActionResponse> {
  // 1. Authenticate
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be signed in to perform this action.' };
  }

  // 2. Validate
  const parsed = deleteTemplateSchema.safeParse({ id: templateId });
  if (!parsed.success) {
    return { error: 'Invalid template ID.' };
  }

  // 3. Soft-delete
  const { error } = await supabase
    .from('templates')
    .update({
      deleted_at: new Date().toISOString(),
    })
    .eq('id', parsed.data.id)
    .eq('tailor_id', user.id);

  if (error) {
    return { error: 'Failed to delete template. Please try again.' };
  }

  revalidatePath('/templates');
  revalidatePath('/dashboard');
  return { success: true };
}

/**
 * Fetches tailor's active templates with their fields.
 */
export async function getTemplates() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized', data: [] };
  }

  const { data, error } = await supabase
    .from('templates')
    .select(`
      id,
      name,
      created_at,
      updated_at,
      template_fields (
        id,
        field_name,
        unit,
        order_index
      )
    `)
    .eq('tailor_id', user.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) {
    return { error: 'Failed to load templates', data: [] };
  }

  // Sort fields by order_index for each template
  const formatted = data.map((t) => ({
    ...t,
    template_fields: (t.template_fields || []).sort(
      (a, b) => a.order_index - b.order_index
    ),
  }));

  return { data: formatted };
}

/**
 * Fetches a single active template by ID with its fields.
 */
export async function getTemplateById(templateId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized', data: null };
  }

  const { data, error } = await supabase
    .from('templates')
    .select(`
      id,
      name,
      created_at,
      updated_at,
      template_fields (
        id,
        field_name,
        unit,
        order_index
      )
    `)
    .eq('id', templateId)
    .eq('tailor_id', user.id)
    .is('deleted_at', null)
    .single();

  if (error || !data) {
    return { error: 'Template not found', data: null };
  }

  const formatted = {
    ...data,
    template_fields: (data.template_fields || []).sort(
      (a, b) => a.order_index - b.order_index
    ),
  };

  return { data: formatted };
}
