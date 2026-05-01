import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export const revalidate = 0;

export default async function InvitationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: order, error } = await supabase
    .from('orders')
    .select('*, template:templates(*)')
    .eq('unique_slug', slug)
    .single();

  if (error || !order) notFound();

  if (order.design_status !== 'generated' || !order.final_html_url) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-800 text-center p-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Undangan Sedang Diproses</h1>
          <p className="text-gray-600">Mohon maaf, undangan ini belum selesai dibuat atau masih menunggu verifikasi admin.</p>
        </div>
      </div>
    );
  }

  const html = order.final_html_url;
  const cssCustom = order.template?.css_custom || '';
  const shareMessage = encodeURIComponent(
    `Undangan Pernikahan ${order.event_data?.groom_name} & ${order.event_data?.bride_name}\n\nhttps://undangan.online/inv/${order.unique_slug}`
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        body { margin: 0; padding: 0; font-family: sans-serif; display: flex; justify-content: center; background-color: #f3f4f6; min-height: 100vh; }
        .invitation-wrapper { width: 100%; max-width: 480px; min-height: 100vh; background: white; position: relative; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
        .classic-wedding-container { padding: 40px 20px; text-align: center; background: #fffcfebf; border: 8px solid #fdf5f6; min-height: 100vh; display: flex; flex-direction: column; justify-content: center;}
        .classic-wedding-container h1 { color: #b76e79; font-family: 'Georgia', serif; font-size: 2.5rem; margin-bottom: 10px; }
        .classic-wedding-container .details { margin: 30px 0; font-size: 1.1rem; color: #555; }
        .classic-wedding-container .btn { display: inline-block; padding: 10px 20px; margin: 10px; background: #b76e79; color: white; text-decoration: none; border-radius: 5px; }
        .modern-minimalist-container { padding: 50px; background: #ffffff; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; }
        .modern-minimalist-container .names { font-size: 2rem; font-weight: 300; letter-spacing: 2px; text-align: center; color: #333; }
        .modern-minimalist-container .names span { font-style: italic; font-size: 1.5rem; color: #999; }
        .modern-minimalist-container .divider { border: 0; height: 1px; background: #eee; margin: 30px 0; }
        .modern-minimalist-container .event-info { text-align: center; color: #666; line-height: 1.8; }
        .modern-minimalist-container .maps-link { display: inline-block; margin-top: 20px; color: #000; text-transform: uppercase; font-size: 0.9rem; letter-spacing: 1px; text-decoration: none; border-bottom: 1px solid #000; }
        .rustic-garden-container { padding: 40px; background: #faf8f5; min-height: 100vh; text-align: center; border: 15px solid #dcd3cb; display: flex; flex-direction: column; justify-content: center; }
        .rustic-garden-container h1 { color: #5a6b5d; font-family: 'Courier New', monospace; font-size: 2.2rem; margin: 20px 0;}
        .rustic-garden-container .subtitle { color: #8b7d6b; font-style: italic; margin-bottom: 30px; }
        .rustic-garden-container .btn-rustic { display: inline-block; padding: 12px 25px; margin-top: 20px; border: 2px solid #5a6b5d; color: #5a6b5d; text-decoration: none; text-transform: uppercase; letter-spacing: 1px; }
        .premium-gold-container { padding: 20px; background: #111; min-height: 100vh; display: flex; flex-direction: column; }
        .premium-gold-container .gold-frame { flex: 1; border: 2px solid #d4af37; padding: 40px 20px; text-align: center; display: flex; flex-direction: column; justify-content: center; }
        .premium-gold-container h1 { color: #d4af37; font-family: 'Times New Roman', serif; font-size: 2.8rem; margin-bottom: 15px; }
        .premium-gold-container .invite-text { color: #aaa; margin-bottom: 30px; }
        .premium-gold-container .date-time { color: #fff; font-size: 1.2rem; margin-bottom: 20px; letter-spacing: 2px; }
        .premium-gold-container .venue { color: #ccc; margin-bottom: 40px; }
        .premium-gold-container .btn-gold { display: inline-block; padding: 15px 30px; background: linear-gradient(45deg, #bf953f, #fcf6ba, #b38728, #fbf5b7); color: #000; text-decoration: none; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
        ${cssCustom}
      `}} />
      <div className="invitation-wrapper relative">
        <div dangerouslySetInnerHTML={{ __html: html }} />
        <div className="fixed bottom-6 right-6 z-50">
          <a
            href={`https://wa.me/?text=${shareMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-full shadow-lg transition-transform hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
            Bagikan Undangan
          </a>
        </div>
      </div>
    </>
  );
}
