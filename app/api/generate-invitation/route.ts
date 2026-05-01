import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseClient';
import { renderInvitation } from '@/lib/templateEngine';

export async function POST(request: Request) {
  try {
    const { order_id } = await request.json();
    
    if (!order_id) {
      return NextResponse.json({ error: 'order_id is required' }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    
    // 1. Ambil order dan template
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, template:templates(*)')
      .eq('id', order_id)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
    }

    if (!order.template) {
      return NextResponse.json({ error: 'Template tidak ditemukan' }, { status: 404 });
    }

    // 2. Replace placeholder dengan event_data
    const html = renderInvitation(order.template.html_template, order.event_data);

    // 3. Simpan HTML ke database sebagai text (atau bisa ke Storage jika diatur, tapi simpan ke DB lebih praktis sesuai prompt "atau simpan sebagai text di database")
    // Menggunakan column final_html_url untuk menyimpan string HTML secara langsung atau bisa bikin file.
    // Karena kolom final_html_url aslinya bertipe text, kita simpan HTML-nya saja langsung.
    // Wait, prompt: "Simpan HTML ke Supabase Storage bucket 'invitations' atau simpan sebagai text di database"
    // Menyimpan sebagai text di final_html_url sangat mudah.
    
    const { data: updateData, error: updateError } = await supabase
      .from('orders')
      .update({
        final_html_url: html,
        design_status: 'generated'
      })
      .eq('id', order_id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, order: updateData });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
