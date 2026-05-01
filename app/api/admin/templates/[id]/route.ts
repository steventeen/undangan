import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseClient';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const supabase = getServiceSupabase();

    const allowedFields = ['name', 'category', 'price', 'is_active', 'html_template', 'css_custom', 'thumbnail_url'];
    const updateData: Record<string, any> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'Tidak ada field yang valid untuk diperbarui' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('templates')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, template: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getServiceSupabase();

    // Guard: check if template is used by any orders
    const { count } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('template_id', id);

    if (count && count > 0) {
      return NextResponse.json(
        { error: `Tidak bisa menghapus: template ini dipakai oleh ${count} pesanan.` },
        { status: 409 }
      );
    }

    const { error } = await supabase.from('templates').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
