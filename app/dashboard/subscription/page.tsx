import { createServerSupabaseClient } from '@/lib/supabase.server';
import { PLAN_LIMITS, PLAN_PRICES, formatRupiah } from '@/lib/utils';
import { Check, Star, Zap } from 'lucide-react';
import Link from 'next/link';

export default async function SubscriptionPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, plan_expires_at, invitation_quota, ai_credits')
    .eq('id', user!.id)
    .single();

  const currentPlan = profile?.plan || 'free';
  const limits = PLAN_LIMITS[currentPlan as 'free' | 'pro' | 'premium'];

  const plans = [
    {
      id: 'free',
      name: 'Gratis',
      price: 'Rp 0',
      period: 'selamanya',
      icon: Star,
      color: 'gray',
      features: ['1 Undangan', 'Maks 50 Tamu', 'Template Dasar', 'Link Standar'],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: formatRupiah(PLAN_PRICES.pro),
      period: 'per bulan',
      icon: Check,
      color: 'rose',
      features: ['10 Undangan', 'Maks 500 Tamu', 'Semua Template Premium', 'Analytics Dasar', 'Export Data (CSV)'],
    },
    {
      id: 'premium',
      name: 'Premium',
      price: formatRupiah(PLAN_PRICES.premium),
      period: 'per bulan',
      icon: Zap,
      color: 'amber',
      features: ['Undangan Unlimited', 'Tamu Unlimited', 'AI Generator (20x)', 'Kirim WhatsApp Massal', 'Custom Domain', 'Prioritas Support'],
    }
  ];

  return (
    <div className="p-6 md:p-8 pt-16 md:pt-8 max-w-5xl mx-auto">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-2xl font-serif font-bold text-gray-900">Langganan & Paket</h1>
        <p className="text-gray-500 text-sm mt-1">Tingkatkan pengalaman membuat undangan digital Anda.</p>
      </div>

      {/* Current Plan Overview */}
      <div className="card p-6 md:p-8 bg-gradient-to-br from-gray-900 to-gray-800 text-white mb-10 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Paket Saat Ini</p>
            <h2 className="text-3xl font-serif font-bold capitalize flex items-center gap-3">
              {currentPlan}
              {currentPlan === 'pro' && <span className="text-rose-400">⭐</span>}
              {currentPlan === 'premium' && <span className="text-amber-400">👑</span>}
            </h2>
            {profile?.plan_expires_at && (
              <p className="text-gray-400 text-sm mt-2">
                Berlaku hingga {new Date(profile.plan_expires_at).toLocaleDateString('id-ID')}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-4 md:justify-end">
            <div className="bg-white/10 rounded-xl p-4 min-w-[120px]">
              <p className="text-gray-400 text-xs mb-1">Sisa Kuota Undangan</p>
              <p className="text-2xl font-bold">{limits.invitations === -1 ? '∞' : profile?.invitation_quota}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 min-w-[120px]">
              <p className="text-gray-400 text-xs mb-1">Sisa AI Credits</p>
              <p className="text-2xl font-bold">{limits.ai_credits === -1 ? '∞' : profile?.ai_credits}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Plans List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          return (
            <div 
              key={plan.id} 
              className={`card p-6 flex flex-col relative ${
                isCurrent 
                  ? 'border-gray-300 ring-1 ring-gray-300 shadow-sm' 
                  : plan.id === 'pro' 
                    ? 'border-rose-200 ring-2 ring-rose-500 shadow-lg shadow-rose-100' 
                    : ''
              }`}
            >
              {isCurrent && (
                <div className="absolute top-0 right-0 bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
                  PAKET AKTIF
                </div>
              )}
              {plan.id === 'pro' && !isCurrent && (
                <div className="absolute top-0 right-0 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl shadow-sm">
                  REKOMENDASI
                </div>
              )}

              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                plan.id === 'pro' ? 'bg-rose-100 text-rose-600' : 
                plan.id === 'premium' ? 'bg-amber-100 text-amber-600' : 
                'bg-gray-100 text-gray-600'
              }`}>
                <plan.icon size={24} />
              </div>

              <h3 className="font-serif font-bold text-xl text-gray-900 mb-1">{plan.name}</h3>
              <div className="mb-6 border-b border-gray-100 pb-6">
                <p className="text-2xl font-bold text-gray-900">
                  {plan.price}
                  <span className="text-sm font-normal text-gray-500 ml-1">/{plan.period}</span>
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check size={16} className={`shrink-0 mt-0.5 ${
                      plan.id === 'pro' ? 'text-rose-500' : 
                      plan.id === 'premium' ? 'text-amber-500' : 
                      'text-green-500'
                    }`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {!isCurrent && (
                <Link 
                  href={`/api/payment/checkout?plan=${plan.id}`}
                  className={`btn w-full justify-center ${
                    plan.id === 'pro' ? 'btn-primary' : 
                    plan.id === 'premium' ? 'bg-gray-900 text-white hover:bg-gray-800' : 
                    'btn-secondary'
                  }`}
                >
                  Pilih Paket {plan.name}
                </Link>
              )}
              {isCurrent && (
                <button disabled className="btn w-full justify-center bg-gray-100 text-gray-400 font-medium">
                  Sedang Aktif
                </button>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-12 text-center text-sm text-gray-500">
        <p>Butuh paket custom untuk Event Organizer? <a href="mailto:contact@undangandigital.id" className="text-rose-500 hover:underline">Hubungi kami</a>.</p>
      </div>
    </div>
  );
}
