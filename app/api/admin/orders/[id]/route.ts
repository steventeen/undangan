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

    const allowedFields = ['payment_status', 'design_status', 'event_data'];
    const updateData: Record<string, any> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'Tidak ada field yang valid untuk diperbarui' }, { status: 400 });
    }

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Bonus: Auto-generate invitation if payment is verified
    if (updateData.payment_status === 'verified') {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        // We call the internal API to generate
        await fetch(`${baseUrl}/api/generate-invitation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order_id: id }),
        });
      } catch (genError) {
        console.error('Auto-generation failed:', genError);
      }
    }

    return NextResponse.json({ success: true, order: data });
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
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
