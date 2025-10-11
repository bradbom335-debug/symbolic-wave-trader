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
    const { symbol, signal_type, direction, confidence, key_signals } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Find matching alert rules
    const { data: alertRules, error: rulesError } = await supabase
      .from('alert_rules')
      .select('*')
      .eq('symbol', symbol)
      .eq('is_active', true);

    if (rulesError) throw rulesError;

    const dispatched = [];

    for (const rule of alertRules || []) {
      // Check if signal meets conditions
      if (!meetsConditions(rule.conditions, { signal_type, direction, confidence })) {
        continue;
      }

      // Check for duplicate alerts (don't send same alert twice in 1 hour)
      const { data: recentAlerts } = await supabase
        .from('alert_history')
        .select('id')
        .eq('user_id', rule.user_id)
        .eq('symbol', symbol)
        .eq('delivery_status', 'sent')
        .gte('sent_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
        .limit(1);

      if (recentAlerts && recentAlerts.length > 0) {
        console.log(`Skipping duplicate alert for user ${rule.user_id}`);
        continue;
      }

      // Format message
      const message = formatAlertMessage(symbol, direction, confidence, key_signals);

      // Dispatch to each channel
      for (const channel of rule.delivery_channels) {
        try {
          let delivery_status = 'sent';
          let error_message = null;

          switch (channel) {
            case 'email':
              await sendEmail(rule.user_id, symbol, message, supabase);
              break;
            case 'telegram':
              await sendTelegram(rule.user_id, message);
              break;
            case 'sms':
              await sendSMS(rule.user_id, message);
              break;
            default:
              delivery_status = 'failed';
              error_message = `Unknown channel: ${channel}`;
          }

          // Log alert history
          await supabase.from('alert_history').insert({
            alert_rule_id: rule.id,
            user_id: rule.user_id,
            symbol,
            message,
            delivery_channel: channel,
            delivery_status,
            error_message
          });

          dispatched.push({ rule_id: rule.id, channel, status: delivery_status });

        } catch (error) {
          console.error(`Error sending to ${channel}:`, error);
          
          await supabase.from('alert_history').insert({
            alert_rule_id: rule.id,
            user_id: rule.user_id,
            symbol,
            message,
            delivery_channel: channel,
            delivery_status: 'failed',
            error_message: error.message
          });
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, dispatched }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Alert dispatcher error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function meetsConditions(conditions: any, signal: any): boolean {
  if (conditions.min_confidence && signal.confidence < conditions.min_confidence) {
    return false;
  }
  
  if (conditions.signal_types && !conditions.signal_types.includes(signal.signal_type)) {
    return false;
  }
  
  if (conditions.directions && !conditions.directions.includes(signal.direction)) {
    return false;
  }
  
  return true;
}

function formatAlertMessage(symbol: string, direction: string, confidence: number, key_signals: any): string {
  const emoji = direction === 'bullish' ? '🚀' : direction === 'bearish' ? '📉' : '➡️';
  const confidencePct = (confidence * 100).toFixed(0);
  
  let message = `${emoji} ${symbol} ${direction.toUpperCase()} Signal - ${confidencePct}% Confidence\n\n`;
  
  if (key_signals) {
    message += 'Key Signals:\n';
    for (const [key, value] of Object.entries(key_signals)) {
      message += `• ${key}: ${value}\n`;
    }
  }
  
  message += '\nView full analysis: [Dashboard Link]';
  
  return message;
}

async function sendEmail(userId: string, symbol: string, message: string, supabase: any) {
  // Get user email
  const { data: userData } = await supabase
    .from('users')
    .select('email')
    .eq('id', userId)
    .single();

  if (!userData?.email) {
    throw new Error('User email not found');
  }

  // Call Resend edge function (assuming it exists)
  const resendUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/send-email`;
  await fetch(resendUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
    },
    body: JSON.stringify({
      to: userData.email,
      subject: `Market Alert: ${symbol}`,
      html: message.replace(/\n/g, '<br>')
    })
  });
}

async function sendTelegram(userId: string, message: string) {
  // Telegram bot implementation would go here
  // Requires TELEGRAM_BOT_TOKEN and user's chat ID stored in database
  console.log('Telegram not yet implemented');
}

async function sendSMS(userId: string, message: string) {
  // Twilio implementation would go here
  // Requires TWILIO_API_KEY and user's phone number stored in database
  console.log('SMS not yet implemented');
}
