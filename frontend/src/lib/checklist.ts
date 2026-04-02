import { fetchProfile, updateProfile } from './api';

/**
 * Mark a checklist item as completed in the merchant profile.
 * Called when a user visits a page that corresponds to a checklist step.
 */
export async function markChecklistComplete(itemId: string): Promise<void> {
  try {
    const profile = await fetchProfile();
    const completed = (profile?.checklist_completed as Record<string, boolean>) || {};
    if (completed[itemId]) return; // already marked
    completed[itemId] = true;
    await updateProfile({ ...profile, checklist_completed: completed });
  } catch {
    // silently fail - checklist is a nicety, not critical
  }
}
