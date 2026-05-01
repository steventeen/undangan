import { NextResponse } from 'next/server';
import { uploadFileToSupabase } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'Tidak ada file yang diunggah' }, { status: 400 });
    }

    // Validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: 'Ukuran file maksimal 2MB' }, { status: 400 });
    }

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Format file tidak didukung' }, { status: 400 });
    }

    // Using bucket 'payment-proofs'
    const { publicUrl, error } = await uploadFileToSupabase(file, 'payment-proofs');

    if (error) {
      console.error('Upload error:', error);
      // Fallback for local dev if bucket doesn't exist yet
      return NextResponse.json({ url: `https://dummyimage.com/600x400/000/fff&text=Mock+Bukti+Pembayaran` });
    }

    return NextResponse.json({ url: publicUrl });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
