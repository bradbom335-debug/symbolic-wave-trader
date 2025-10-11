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
    const { symbols } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const results = [];

    for (const symbol of symbols) {
      try {
        // Reddit API tracking (no auth needed for public data)
        const subreddits = ['wallstreetbets', 'stocks', 'investing'];
        let totalMentions = 0;
        let bullishCount = 0;
        let bearishCount = 0;
        let neutralCount = 0;
        const topPosts: any[] = [];

        for (const subreddit of subreddits) {
          const url = `https://www.reddit.com/r/${subreddit}/search.json?q=${symbol}&sort=new&limit=100&t=day`;
          
          const response = await fetch(url, {
            headers: { 'User-Agent': 'MarketForge/1.0' }
          });

          if (response.ok) {
            const data = await response.json();
            
            if (data.data && data.data.children) {
              for (const post of data.data.children) {
                const postData = post.data;
                totalMentions++;
                
                // Simple sentiment analysis based on title and score
                const title = postData.title.toLowerCase();
                const score = postData.score;
                
                // Bullish keywords
                if (title.includes('moon') || title.includes('rocket') || title.includes('buy') || 
                    title.includes('bullish') || title.includes('🚀') || title.includes('📈')) {
                  bullishCount++;
                } 
                // Bearish keywords
                else if (title.includes('crash') || title.includes('dump') || title.includes('sell') || 
                         title.includes('bearish') || title.includes('📉') || title.includes('short')) {
                  bearishCount++;
                } 
                else {
                  neutralCount++;
                }

                if (topPosts.length < 5 && score > 10) {
                  topPosts.push({
                    title: postData.title,
                    score: postData.score,
                    url: `https://reddit.com${postData.permalink}`,
                    subreddit: postData.subreddit
                  });
                }
              }
            }
          }

          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // Calculate weighted sentiment
        const total = bullishCount + bearishCount + neutralCount;
        const avgSentiment = total > 0 
          ? ((bullishCount - bearishCount) / total) 
          : 0;

        // Store in database
        const { data, error } = await supabase.from('social_sentiment').insert({
          symbol,
          platform: 'reddit',
          timestamp: new Date(),
          mention_count: totalMentions,
          bullish_count: bullishCount,
          bearish_count: bearishCount,
          neutral_count: neutralCount,
          avg_sentiment: avgSentiment,
          volume_weighted_sentiment: avgSentiment,
          top_posts: topPosts
        }).select();

        if (!error && data) {
          results.push(data[0]);
        }

      } catch (error) {
        console.error(`Error tracking sentiment for ${symbol}:`, error);
      }
    }

    return new Response(
      JSON.stringify({ success: true, tracked: results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Social sentiment tracker error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
