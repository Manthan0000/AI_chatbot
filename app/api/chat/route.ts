import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req) {
  try {
    const { message, history } = await req.json();
    
    // 1. Attempt Gemini
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey && geminiKey.length > 10 && !geminiKey.includes('your_')) {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        const formattedHistory = (history || []).map(msg => ({
          role: msg.role === 'ai' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        }));

        const chat = model.startChat({ history: formattedHistory });
        const result = await chat.sendMessage(message);
        return NextResponse.json({ reply: result.response.text() });
      } catch (geminiError) {
        console.warn('Gemini API failed, falling back...', geminiError.message);
      }
    }

    // 2. Wikipedia Fallback Proxy
    try {
      const cleanMessage = message.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase();
      const words = cleanMessage.split(' ').filter(w => w.length > 3 && !['what','when','where','why','how','tell','about','this','that','some'].includes(w));
      const searchTerms = words.slice(-2).join(' ') || "Artificial Intelligence";

      const wikiRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTerms)}`);
      if (wikiRes.ok) {
        const wikiData = await wikiRes.json();
        if (wikiData.extract) {
          return NextResponse.json({ reply: `(Fallback AI Mode): Here is what I found on Wikipedia about "${searchTerms}"...\n\n${wikiData.extract}` });
        }
      }
    } catch (e) {
      console.error('Wiki Error', e);
    }

    return NextResponse.json({ 
      reply: "I'm currently in lightweight offline mode (Fallback). Please provide a valid Gemini API key in your environment variables for full conversational capabilities!" 
    });

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ reply: 'Failed to process request.' }, { status: 500 });
  }
}
