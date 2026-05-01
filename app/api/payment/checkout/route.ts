import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase.server';
import { PLAN_PRICES } from '@/lib/utils';
// @ts-ignore
import midtransClient from 'midtrans-client';

export async function GET(req: Request) {
  try {
    const requestUrl = new URL(req.url);
    const plan = requestUrl.searchParams.get('plan');
    
    if (!plan || (plan !== 'pro' && plan !== 'premium')) {
      return NextResponse.redirect(new URL('/dashboard/subscription', req.url));
    }

    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

    // Create Transaction Record in Supabase
    const amount = PLAN_PRICES[plan];
    const externalId = `SUB-${user.id}-${Date.now()}`;

    const { data: trx, error: trxError } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        type: 'subscription',
        amount: amount,
        status: 'pending',
        external_id: externalId,
        metadata: { plan }
      })
      .select('id')
      .single();

    if (trxError || !trx) {
      throw new Error('Failed to create transaction record');
    }

    // Initialize Midtrans Snap
    const snap = new midtransClient.Snap({
      isProduction: false, // Set to true in production
      serverKey: process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-placeholder',
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 'SB-Mid-client-placeholder'
    });

    const parameter = {
      transaction_details: {
        order_id: externalId,
        gross_amount: amount
      },
      customer_details: {
        first_name: profile?.full_name || user.email?.split('@')[0],
        email: user.email
      },
      item_details: [{
        id: `plan-${plan}`,
        price: amount,
        quantity: 1,
        name: `Langganan UndanganDigital ${plan.toUpperCase()}`
      }],
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription?status=success`,
        error: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription?status=error`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription?status=pending`
      }
    };

    // If API keys are placeholders, just simulate a successful transaction for testing
    if (snap.apiConfig.serverKey === 'SB-Mid-server-placeholder') {
      return NextResponse.redirect(new URL(`/api/payment/webhook?mock_success=true&order_id=${externalId}`, req.url));
    }

    const transaction = await snap.createTransaction(parameter);
    return NextResponse.redirect(transaction.redirect_url);

  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.redirect(new URL('/dashboard/subscription?error=1', req.url));
  }
}
