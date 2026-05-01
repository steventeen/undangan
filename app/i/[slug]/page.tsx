import { createServerSupabaseClient } from '@/lib/supabase.server';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import PublicInvitationClient from '@/components/invitation/PublicInvitationClient';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: invitation } = await supabase
    .from('invitations')
    .select('title, category, event_date, settings')
    .eq('slug', slug)
    .single();

  if (!invitation) {
    return { title: 'Undangan Tidak Ditemukan' };
  }

  // Fallback image if cover_image is not set
  const ogImage = invitation.settings?.cover_image || `${process.env.NEXT_PUBLIC_APP_URL}/og-default.png`;

  return {
    title: invitation.title,
    description: `Anda diundang ke acara ${invitation.category} kami. Silakan buka tautan ini untuk melihat detail undangan.`,
    openGraph: {
      title: invitation.title,
      description: `Merupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: invitation.title,
        },
      ],
      type: 'website',
    },
  };
}

export default async function PublicInvitationPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { to, t } = await searchParams; // to = name, t = unique_token
  
  const supabase = await createServerSupabaseClient();
  
  const { data: invitation, error } = await supabase
    .from('invitations')
    .select('id, title, category, sections, settings, is_published')
    .eq('slug', slug)
    .single();

  if (error || !invitation || !invitation.is_published) {
    notFound();
  }

  // Record a view (fire and forget, don't await)
  supabase.rpc('increment_view_count', { inv_id: invitation.id }).then();

  let guestName = to ? String(to).replace(/-/g, ' ') : null;
  let guestId = null;

  // If token is provided, verify guest and get their name
  if (t) {
    const { data: guest } = await supabase
      .from('guests')
      .select('id, name')
      .eq('invitation_id', invitation.id)
      .eq('unique_token', t)
      .single();
      
    if (guest) {
      guestName = guest.name;
      guestId = guest.id;
      // Mark as clicked
      supabase.from('guests').update({ status: 'clicked', clicked_at: new Date().toISOString() }).eq('id', guest.id).then();
    }
  }

  return (
    <PublicInvitationClient 
      invitation={invitation} 
      guestName={guestName} 
      guestId={guestId} 
    />
  );
}
