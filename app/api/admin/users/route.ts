import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase.server';

export async function GET() {
  try {
    const supabase = getServiceSupabase();
    
    // 1. Fetch all profiles
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profileError) throw profileError;

    // 2. Fetch all users from auth.admin to get emails
    const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) throw authError;

    // 3. Merge data
    const mergedUsers = profiles.map(profile => {
      const authUser = authUsers.find(u => u.id === profile.id);
      return {
        ...profile,
        email: authUser?.email || 'N/A',
        last_sign_in_at: authUser?.last_sign_in_at
      };
    });

    return NextResponse.json(mergedUsers);
  } catch (error: any) {
    console.error('Admin Users API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
