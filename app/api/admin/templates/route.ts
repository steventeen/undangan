import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ templates: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = getServiceSupabase();

    const { name, category, price, is_active, html_template, css_custom, thumbnail_url } = body;

    if (!name || !html_template) {
      return NextResponse.json({ error: 'name dan html_template wajib diisi' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('templates')
      .insert({ name, category, price: price || 0, is_active: is_active ?? true, html_template, css_custom: css_custom || '', thumbnail_url: thumbnail_url || null })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, template: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
