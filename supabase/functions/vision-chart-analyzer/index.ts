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
    const { symbol, timeframe, chartImageBase64 } = await req.json();
    const GOOGLE_CLOUD_API_KEY = Deno.env.get('GOOGLE_CLOUD_API_KEY');
    
    if (!GOOGLE_CLOUD_API_KEY) {
      throw new Error('GOOGLE_CLOUD_API_KEY not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Upload chart image to storage
    const chartFileName = `charts/${symbol}_${timeframe}_${Date.now()}.png`;
    const imageBuffer = Uint8Array.from(atob(chartImageBase64), c => c.charCodeAt(0));
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('user-assets')
      .upload(chartFileName, imageBuffer, {
        contentType: 'image/png'
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('user-assets')
      .getPublicUrl(chartFileName);

    // Analyze with Google Vision API
    const visionUrl = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_CLOUD_API_KEY}`;
    
    const visionResponse = await fetch(visionUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [
          {
            image: { content: chartImageBase64 },
            features: [
              { type: 'LABEL_DETECTION', maxResults: 10 },
              { type: 'OBJECT_LOCALIZATION', maxResults: 10 },
              { type: 'TEXT_DETECTION', maxResults: 10 }
            ]
          }
        ]
      })
    });

    const visionData = await visionResponse.json();
    const response = visionData.responses[0];

    // Extract patterns from labels and objects
    const detectedPatterns = [];
    const supportLevels: number[] = [];
    const resistanceLevels: number[] = [];

    // Pattern keywords to look for
    const patternKeywords = {
      'triangle': ['triangle', 'wedge', 'pennant'],
      'head_and_shoulders': ['head', 'shoulder'],
      'double_top': ['double', 'top', 'peak'],
      'double_bottom': ['double', 'bottom', 'trough'],
      'channel': ['channel', 'parallel'],
      'flag': ['flag', 'rectangle']
    };

    // Analyze labels
    if (response.labelAnnotations) {
      for (const label of response.labelAnnotations) {
        const description = label.description.toLowerCase();
        
        for (const [pattern, keywords] of Object.entries(patternKeywords)) {
          if (keywords.some(keyword => description.includes(keyword))) {
            detectedPatterns.push({
              type: pattern,
              confidence: label.score,
              description: label.description
            });
          }
        }
      }
    }

    // Extract price levels from text detection
    if (response.textAnnotations && response.textAnnotations.length > 1) {
      // Skip first annotation (full text)
      for (const text of response.textAnnotations.slice(1)) {
        const num = parseFloat(text.description);
        if (!isNaN(num) && num > 0 && num < 1000000) {
          // Heuristic: upper half = resistance, lower half = support
          const verticalPosition = text.boundingPoly.vertices[0].y;
          if (verticalPosition < 200) {
            resistanceLevels.push(num);
          } else {
            supportLevels.push(num);
          }
        }
      }
    }

    // Store in database
    const { data: patternData, error: dbError } = await supabase
      .from('visual_patterns')
      .insert({
        symbol,
        timeframe,
        timestamp: new Date().toISOString(),
        chart_url: publicUrl,
        detected_patterns: detectedPatterns,
        support_levels: supportLevels.slice(0, 5),
        resistance_levels: resistanceLevels.slice(0, 5),
        trend_lines: [],
        vision_api_response: response
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return new Response(
      JSON.stringify({
        success: true,
        chartUrl: publicUrl,
        patterns: detectedPatterns,
        supportLevels: supportLevels.slice(0, 5),
        resistanceLevels: resistanceLevels.slice(0, 5)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Vision chart analyzer error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
