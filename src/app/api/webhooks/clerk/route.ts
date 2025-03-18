import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Get the headers
  const headersList = headers();
  const svix_id = headersList.get('svix-id') || '';
  const svix_timestamp = headersList.get('svix-timestamp') || '';
  const svix_signature = headersList.get('svix-signature') || '';

  // If there are no Svix headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret from env vars
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    console.error('CLERK_WEBHOOK_SECRET is not defined in environment variables');
    return new Response('Server configuration error', { status: 500 });
  }
  
  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', {
      status: 400
    });
  }

  // Handle the webhook event
  const eventType = evt.type;
  
  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name } = evt.data;
    const email = email_addresses[0]?.email_address;
    
    if (!email) {
      return NextResponse.json({ message: 'No email found' }, { status: 400 });
    }

    try {
      // Create a new user profile in Supabase
      const { data, error } = await supabaseAdmin
        .from('user_profiles')
        .insert({
          clerk_id: id,
          email,
          first_name: first_name || null,
          last_name: last_name || null,
          subscription_status: 'free',
          subscription_tier: 'free'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating user profile:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      // Create default user preferences
      await supabaseAdmin
        .from('user_preferences')
        .insert({
          user_id: data.id,
          theme: 'system',
          notifications_enabled: true
        });

      return NextResponse.json({ message: 'User created in Supabase', user: data });
    } catch (error) {
      console.error('Error in user.created webhook handler:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name } = evt.data;
    const email = email_addresses[0]?.email_address;

    if (!email) {
      return NextResponse.json({ message: 'No email found' }, { status: 400 });
    }

    try {
      // Update the user profile in Supabase
      const { data, error } = await supabaseAdmin
        .from('user_profiles')
        .update({
          email,
          first_name: first_name || null,
          last_name: last_name || null,
          updated_at: new Date().toISOString()
        })
        .eq('clerk_id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating user profile:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ message: 'User updated in Supabase', user: data });
    } catch (error) {
      console.error('Error in user.updated webhook handler:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;

    try {
      // First, get the user profile to get the Supabase ID
      const { data: userProfile, error: fetchError } = await supabaseAdmin
        .from('user_profiles')
        .select('id')
        .eq('clerk_id', id)
        .single();

      if (fetchError) {
        console.error('Error finding user profile:', fetchError);
        return NextResponse.json({ error: fetchError.message }, { status: 500 });
      }

      if (userProfile) {
        // Delete user preferences first to maintain referential integrity
        await supabaseAdmin
          .from('user_preferences')
          .delete()
          .eq('user_id', userProfile.id);

        // Then delete the user profile
        const { error: deleteError } = await supabaseAdmin
          .from('user_profiles')
          .delete()
          .eq('clerk_id', id);

        if (deleteError) {
          console.error('Error deleting user profile:', deleteError);
          return NextResponse.json({ error: deleteError.message }, { status: 500 });
        }
      }

      return NextResponse.json({ message: 'User deleted from Supabase' });
    } catch (error) {
      console.error('Error in user.deleted webhook handler:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }

  // Return a response for any other event type
  return NextResponse.json({ message: `Webhook received: ${eventType}` });
} 