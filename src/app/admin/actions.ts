'use server';

import { createClient } from '@/lib/supabase/server';
import {
  updateTailorStatusSchema,
  UpdateTailorStatusInput,
} from '@/lib/validation/admin';
import { revalidatePath } from 'next/cache';

export interface AdminActionResponse<T = unknown> {
  success?: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

/**
 * Updates a tailor's account status (suspend/reactivate) and records the event in admin_audit_log.
 */
export async function updateTailorStatusAction(
  payload: UpdateTailorStatusInput
): Promise<AdminActionResponse> {
  // 1. Authenticate caller
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be signed in to perform this action.' };
  }

  // 2. Validate input schema
  const parsed = updateTailorStatusSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      error: 'Invalid input provided.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { target_id, action } = parsed.data;

  // 3. Verify caller has admin role
  const { data: adminProfile, error: adminError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (adminError || adminProfile?.role !== 'admin') {
    return { error: 'Forbidden: Admin privileges required.' };
  }

  // 4. Prevent self-suspension
  if (target_id === user.id) {
    return { error: 'You cannot change your own administrator account status.' };
  }

  // 5. Fetch target user's current status
  const { data: targetUser, error: targetError } = await supabase
    .from('users')
    .select('id, name, status, role')
    .eq('id', target_id)
    .single();

  if (targetError || !targetUser) {
    return { error: 'Target user not found.' };
  }

  const previousStatus = targetUser.status;
  const newStatus = action === 'suspend' ? 'suspended' : 'active';

  if (previousStatus === newStatus) {
    return { error: `Account is already ${newStatus}.` };
  }

  // 6. Update user status
  const { error: updateError } = await supabase
    .from('users')
    .update({ status: newStatus })
    .eq('id', target_id);

  if (updateError) {
    return { error: 'Failed to update user status in database.' };
  }

  // 7. Insert audit log record (FR-5.4)
  const { error: auditError } = await supabase
    .from('admin_audit_log')
    .insert({
      actor_id: user.id,
      target_id: target_id,
      action: action,
      previous_status: previousStatus,
      new_status: newStatus,
    });

  if (auditError) {
    console.error('Audit log write error:', auditError);
    // Note: status update succeeded; we log the error for diagnostics
  }

  // 8. Revalidate admin views
  revalidatePath('/admin');
  revalidatePath('/admin/audit-log');

  return { success: true };
}
