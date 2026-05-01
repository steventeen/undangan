import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase.server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate Signature (in production, ensure MIDTRANS_SERVER_KEY is set)
    const serverKey = process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-placeholder';
    const signatureKey = body.signature_key;
    const orderId = body.order_id;
    const statusCode = body.status_code;
    const grossAmount = body.gross_amount;
    
    const hash = crypto.createHash('sha512').update(orderId + statusCode + grossAmount + serverKey).digest('hex');
    
    if (signatureKey !== hash && serverKey !== 'SB-Mid-server-placeholder') {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const transactionStatus = body.transaction_status;
    const fraudStatus = body.fraud_status;

    let finalStatus = 'pending';
    if (transactionStatus === 'capture') {
      finalStatus = fraudStatus === 'challenge' ? 'pending' : 'success';
    } else if (transactionStatus === 'settlement') {
      finalStatus = 'success';
    } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
      finalStatus = 'failed';
    } else if (transactionStatus === 'pending') {
      finalStatus = 'pending';
    }

    await handleTransactionStatus(orderId, finalStatus);

    return NextResponse.json({ status: 'OK' });
  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET is used for mock simulation since browser redirect comes here
export async function GET(req: Request) {
  const requestUrl = new URL(req.url);
  const mockSuccess = requestUrl.searchParams.get('mock_success');
  const orderId = requestUrl.searchParams.get('order_id');

  if (mockSuccess === 'true' && orderId) {
    await handleTransactionStatus(orderId, 'success');
    return NextResponse.redirect(new URL('/dashboard/subscription?status=success', req.url));
  }

  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

async function handleTransactionStatus(orderId: string, status: string) {
  const supabase = getServiceSupabase();
  
  // 1. Update transaction status
  const { data: trx, error: trxError } = await supabase
    .from('transactions')
    .update({ status })
    .eq('external_id', orderId)
    .select('*')
    .single();

  if (trxError || !trx) {
    throw new Error('Transaction not found');
  }

  // 2. If success, update user profile
  if (status === 'success' && trx.type === 'subscription') {
    const plan = trx.metadata?.plan;
    if (plan === 'pro' || plan === 'premium') {
      const limits = {
        free: { invitations: 1, ai_credits: 0 },
        pro: { invitations: 10, ai_credits: 5 },
        premium: { invitations: -1, ai_credits: 20 },
      }[plan];

      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 month subscription

      await supabase
        .from('profiles')
        .update({
          plan: plan,
          plan_expires_at: expiresAt.toISOString(),
          invitation_quota: limits.invitations,
          ai_credits: limits.ai_credits,
        })
        .eq('id', trx.user_id);
    }
  }
}
