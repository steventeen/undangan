import { createServerSupabaseClient } from '@/lib/supabase.server';
import { notFound } from 'next/navigation';
import BuilderClient from '@/components/builder/BuilderClient';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BuilderPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  
  const { data: invitation, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !invitation) {
    notFound();
  }

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden bg-gray-50">
      <BuilderClient initialData={invitation} />
    </div>
  );
}
