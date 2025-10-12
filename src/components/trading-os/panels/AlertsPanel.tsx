import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Bell, Plus } from 'lucide-react';

export function AlertsPanel() {
  const { data: alerts } = useQuery({
    queryKey: ['alert-rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('alert_rules')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="p-4 space-y-4">
      <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
        <Plus className="w-4 h-4 mr-2" />
        Create New Alert
      </Button>

      <div className="space-y-2">
        {alerts?.map((alert) => (
          <Card key={alert.id} className="p-3 bg-slate-800/50 border-slate-700">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-white">
                    {alert.symbol}
                  </span>
                  <Badge className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/20">
                    {alert.condition_type}
                  </Badge>
                </div>
                
                <p className="text-xs text-slate-400">
                  {JSON.stringify(alert.conditions)}
                </p>
                
                <div className="flex gap-1 mt-2">
                  {alert.delivery_channels?.map((channel) => (
                    <Badge key={channel} variant="outline" className="text-xs">
                      <Bell className="w-2 h-2 mr-1" />
                      {channel}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
        
        {(!alerts || alerts.length === 0) && (
          <div className="text-center text-slate-400 py-8">
            <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No active alerts</p>
            <p className="text-xs mt-1">Create alerts to monitor market conditions</p>
          </div>
        )}
      </div>
    </div>
  );
}
