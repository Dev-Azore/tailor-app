'use server';

import { createClient } from '@/lib/supabase/server';
import {
  createClientSchema,
  updateClientSchema,
  deleteClientSchema,
  CreateClientInput,
  UpdateClientInput,
} from '@/lib/validation/client';
import { revalidatePath } from 'next/cache';

export interface ClientActionResponse<T = unknown> {
  success?: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

/**
 * Creates a new client for the authenticated tailor.
 */
export async function createClientAction(
  payload: CreateClientInput
): Promise<ClientActionResponse<{ id: string }>> {
  // 1. Authenticate
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be signed in to perform this action.' };
  }

  // 2. Validate
  const parsed = createClientSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      error: 'Validation failed. Please check the fields.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, phone, notes } = parsed.data;

  // 3. Mutate
  const { data, error } = await supabase
    .from('clients')
    .insert({
      tailor_id: user.id,
      name,
      phone,
      notes,
    })
    .select('id')
    .single();

  if (error || !data) {
    return { error: 'Failed to create client. Please try again.' };
  }

  revalidatePath('/clients');
  revalidatePath('/dashboard');
  return { success: true, data: { id: data.id } };
}

/**
 * Updates an existing client for the authenticated tailor.
 */
export async function updateClientAction(
  payload: UpdateClientInput
): Promise<ClientActionResponse<{ id: string }>> {
  // 1. Authenticate
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be signed in to perform this action.' };
  }

  // 2. Validate
  const parsed = updateClientSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      error: 'Validation failed. Please check the fields.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { id: clientId, name, phone, notes } = parsed.data;

  // 3. Mutate
  const { error } = await supabase
    .from('clients')
    .update({
      name,
      phone,
      notes,
      updated_at: new Date().toISOString(),
    })
    .eq('id', clientId)
    .eq('tailor_id', user.id);

  if (error) {
    return { error: 'Failed to update client. Please try again.' };
  }

  revalidatePath('/clients');
  revalidatePath(`/clients/${clientId}`);
  revalidatePath('/dashboard');
  return { success: true, data: { id: clientId } };
}

/**
 * Deletes a client. If measurements exist, the foreign key constraint
 * (ON DELETE RESTRICT) will prevent deletion and return a friendly error.
 */
export async function deleteClientAction(
  clientId: string
): Promise<ClientActionResponse> {
  // 1. Authenticate
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be signed in to perform this action.' };
  }

  // 2. Validate
  const parsed = deleteClientSchema.safeParse({ id: clientId });
  if (!parsed.success) {
    return { error: 'Invalid client ID.' };
  }

  // 3. Mutate
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', parsed.data.id)
    .eq('tailor_id', user.id);

  if (error) {
    // Foreign key violation error code in Postgres is 23503
    if (error.code === '23503' || error.message.includes('foreign key constraint')) {
      return {
        error:
          'Cannot delete client: This client has saved measurement records. To preserve historical records, clients with measurements cannot be removed.',
      };
    }
    return { error: 'Failed to delete client. Please try again.' };
  }

  revalidatePath('/clients');
  revalidatePath('/dashboard');
  return { success: true };
}

/**
 * Fetches all clients belonging to the authenticated tailor.
 */
export async function getClients() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized', data: [] };
  }

  const { data, error } = await supabase
    .from('clients')
    .select(`
      id,
      name,
      phone,
      notes,
      created_at,
      updated_at
    `)
    .eq('tailor_id', user.id)
    .order('name', { ascending: true });

  if (error) {
    return { error: 'Failed to load clients', data: [] };
  }

  return { data };
}

/**
 * Fetches a single client along with their historical measurements.
 */
export async function getClientProfile(clientId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized', data: null };
  }

  // 1. Get client info
  const { data: client, error: clientError } = await supabase
    .from('clients')
    .select('*')
    .eq('id', clientId)
    .eq('tailor_id', user.id)
    .single();

  if (clientError || !client) {
    return { error: 'Client not found', data: null };
  }

  // 2. Get measurements for this client (newest first per DR-2/FR-4.3)
  const { data: measurements, error: measurementsError } = await supabase
    .from('measurements')
    .select(`
      id,
      template_id,
      template_name_snapshot,
      fields_snapshot,
      taken_at,
      created_at
    `)
    .eq('client_id', clientId)
    .eq('tailor_id', user.id)
    .order('taken_at', { ascending: false });

  return {
    data: {
      client,
      measurements: measurementsError ? [] : measurements,
    },
  };
}
