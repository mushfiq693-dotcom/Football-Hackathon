import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth-guard';
import { z } from 'zod';

const settingsSchema = z.object({
  full_name: z.string().optional(),
  notification_preferences: z.object({
    auction_reminders: z.boolean(),
    match_results: z.boolean(),
  }).optional(),
});

export const PATCH = requireAuth(async (request, { user }) => {
  try {
    const body = await request.json();
    const { full_name, notification_preferences } = settingsSchema.parse(body);

    const supabase = await createClient();

    // Update profile
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: full_name !== undefined ? full_name : user.profile.full_name,
        notification_preferences: notification_preferences !== undefined 
          ? notification_preferences 
          : (user.profile.notification_preferences || { auction_reminders: true, match_results: true }),
      })
      .eq('id', user.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ message: 'Settings updated' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}, ['admin', 'super_admin', 'auctioneer', 'team_owner', 'captain', 'viewer']);
