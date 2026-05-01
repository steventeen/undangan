import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseClient';
import { generateOrderNumber, generateUniqueSlug } from '@/lib/templateEngine';

export async function POST(request: Request) {
  try {
    const { templateId, customer, eventData, paymentProofUrl } = await request.json();
    
    if (!templateId || !customer || !eventData) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    
    const orderNumber = generateOrderNumber();
    const slugBase = eventData.groom_name 
      ? `${eventData.groom_name}-${eventData.bride_name}`
      : (eventData.child_name || eventData.event_title || eventData.student_name || 'event');
    
    const uniqueSlug = generateUniqueSlug(slugBase);

    const { data, error } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        template_id: templateId,
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        event_data: eventData,
        unique_slug: uniqueSlug,
        payment_proof_url: paymentProofUrl || null,
        payment_status: paymentProofUrl ? 'pending' : 'unpaid',
        design_status: 'pending', 
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, order: data });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
