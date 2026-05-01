import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Tidak ada file yang diunggah' }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `thumbnails/${fileName}`;

    const { data, error } = await supabase.storage
      .from('templates') // Assume a bucket named 'templates' exists
      .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('templates')
      .getPublicUrl(filePath);

    return NextResponse.json({ url: publicUrl });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
