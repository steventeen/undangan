import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase.server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { category, names, style } = body;

    // IF OPENAI KEY IS NOT SET -> Return Mock Data
    if (!OPENAI_API_KEY) {
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockText = `Dengan penuh rasa syukur dan memohon ridho Allah SWT, kami bermaksud menyelenggarakan acara ${category} yang akan dilaksanakan oleh:\n\n${names}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.`;
      
      const mockHashtag = `#${names.replace(/[^a-zA-Z]/g, '')}Moment #${category.toUpperCase()}2026`;
      
      const mockWa = `Assalamualaikum Wr. Wb / Selamat Pagi\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk hadir pada acara ${category} kami: ${names}.\n\nDetail acara dan konfirmasi kehadiran dapat dilihat pada tautan berikut:\n[LINK_UNDANGAN]\n\nKehadiran dan doa restu Anda sangat berarti bagi kami.\n\nTerima kasih.`;

      return NextResponse.json({
        text: mockText,
        hashtag: mockHashtag,
        wa: mockWa
      });
    }

    // IF OPENAI KEY IS SET -> Call OpenAI API
    const prompt = `
      Buatkan konten undangan digital untuk acara ${category} dengan nama ${names}.
      Gaya bahasa: ${style}.
      
      Format output dalam JSON ketat dengan properti:
      "text": Paragraf pembuka undangan (3-4 kalimat).
      "hashtag": 2 ide hashtag unik (misal #BudiSariSah).
      "wa": Pesan broadcast WhatsApp yang sopan dan mengundang, sertakan placeholder [LINK_UNDANGAN].
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: "json_object" }
      })
    });

    const aiData = await response.json();
    const result = JSON.parse(aiData.choices[0].message.content);

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('AI Error:', error);
    return NextResponse.json({ error: 'Gagal membuat konten' }, { status: 500 });
  }
}
