import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const GOOGLE_CLOUD_API_KEY = Deno.env.get('GOOGLE_CLOUD_API_KEY');
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Find old AI agent sessions (> 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const { data: oldSessions, error: fetchError } = await supabase
      .from('ai_agent_sessions')
      .select('*')
      .lt('started_at', thirtyDaysAgo.toISOString())
      .is('archived', null)
      .limit(100);

    if (fetchError) throw fetchError;

    const archived = [];

    for (const session of oldSessions || []) {
      try {
        // Compress session data using AI
        const compressed = await compressSessionData(session, LOVABLE_API_KEY!);
        
        // Calculate sizes
        const originalSize = JSON.stringify(session).length;
        const compressedSize = JSON.stringify(compressed).length;
        const compressionRatio = compressedSize / originalSize;

        // Create GCS filename
        const date = new Date(session.started_at);
        const gcsPath = `memory-archives/${date.getFullYear()}/${date.getMonth() + 1}/${session.id}.json.gz`;
        
        // Upload to Google Cloud Storage
        const gcsUrl = await uploadToGCS(gcsPath, compressed, GOOGLE_CLOUD_API_KEY!);

        // Store archive record
        const { error: archiveError } = await supabase
          .from('memory_archives')
          .insert({
            session_id: session.id,
            original_size_bytes: originalSize,
            compressed_size_bytes: compressedSize,
            compression_ratio: compressionRatio,
            gcs_url: gcsUrl,
            metadata: {
              session_type: session.session_type,
              started_at: session.started_at,
              ended_at: session.ended_at
            }
          });

        if (!archiveError) {
          // Mark session as archived (don't delete, just flag)
          await supabase
            .from('ai_agent_sessions')
            .update({ archived: true })
            .eq('id', session.id);

          archived.push(session.id);
        }

      } catch (error) {
        console.error(`Error archiving session ${session.id}:`, error);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        archived: archived.length,
        sessions: archived
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Memory archiver error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function compressSessionData(session: any, apiKey: string) {
  // Use AI to compress and summarize session data
  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        {
          role: 'system',
          content: 'You are a data compression assistant. Compress the given session data by extracting only the most important facts and insights. Use a "dumbbell" pattern: preserve critical beginning context and final outcomes, while heavily summarizing the middle.'
        },
        {
          role: 'user',
          content: `Compress this AI session data:\n${JSON.stringify(session)}`
        }
      ],
      stream: false
    })
  });

  const data = await response.json();
  const compressed = data.choices[0]?.message?.content || '{}';
  
  try {
    return JSON.parse(compressed);
  } catch {
    return { compressed_text: compressed };
  }
}

async function uploadToGCS(path: string, data: any, apiKey: string): Promise<string> {
  // Google Cloud Storage JSON API upload
  const bucket = 'marketforge-memory-archive';
  const uploadUrl = `https://storage.googleapis.com/upload/storage/v1/b/${bucket}/o?uploadType=media&name=${encodeURIComponent(path)}`;

  // Compress with gzip
  const jsonString = JSON.stringify(data);
  const encoder = new TextEncoder();
  const uint8Array = encoder.encode(jsonString);
  
  // Simple gzip compression using CompressionStream API
  const compressedStream = new Response(uint8Array).body!
    .pipeThrough(new CompressionStream('gzip'));
  
  const compressedData = await new Response(compressedStream).arrayBuffer();

  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/gzip',
    },
    body: compressedData
  });

  if (!response.ok) {
    throw new Error(`GCS upload failed: ${response.statusText}`);
  }

  return `https://storage.googleapis.com/${bucket}/${path}`;
}
