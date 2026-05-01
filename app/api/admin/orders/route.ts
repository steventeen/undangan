import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from('orders')
      .select('*, template:templates(id, name, price, thumbnail_url)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ orders: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
