import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Database, Network, Zap } from 'lucide-react';

export function AIMemoryPanel() {
  return (
    <div className="p-4 space-y-4">
      {/* Memory Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-slate-400">Active Context</span>
          </div>
          <div className="text-xl font-bold text-white">2.4K</div>
          <div className="text-xs text-slate-500">tokens</div>
        </Card>

        <Card className="p-3 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-slate-400">Stored Memory</span>
          </div>
          <div className="text-xl font-bold text-white">156</div>
          <div className="text-xs text-slate-500">sessions</div>
        </Card>

        <Card className="p-3 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Network className="w-4 h-4 text-green-400" />
            <span className="text-xs text-slate-400">Connections</span>
          </div>
          <div className="text-xl font-bold text-white">847</div>
          <div className="text-xs text-slate-500">nodes</div>
        </Card>

        <Card className="p-3 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-orange-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-slate-400">Efficiency</span>
          </div>
          <div className="text-xl font-bold text-white">94%</div>
          <div className="text-xs text-slate-500">compression</div>
        </Card>
      </div>

      {/* Recent Memories */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Recent Memories</h3>
        <div className="space-y-2">
          {[
            { title: 'Market Analysis: AAPL', tags: ['technical', 'bullish'], timestamp: '2 hours ago' },
            { title: 'Trading Strategy: Options', tags: ['strategy', 'derivatives'], timestamp: '5 hours ago' },
            { title: 'Risk Assessment: Portfolio', tags: ['risk', 'analysis'], timestamp: '1 day ago' },
          ].map((memory, i) => (
            <Card key={i} className="p-3 bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm font-medium text-white">{memory.title}</span>
                <span className="text-xs text-slate-500">{memory.timestamp}</span>
              </div>
              <div className="flex gap-1">
                {memory.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs border-purple-500/30 text-purple-400">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Memory Health */}
      <Card className="p-3 bg-slate-800/50 border-slate-700">
        <h3 className="text-sm font-semibold text-white mb-3">System Health</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Retention Quality</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400" style={{ width: '92%' }} />
              </div>
              <span className="text-green-400 font-medium">92%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Context Utilization</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: '87%' }} />
              </div>
              <span className="text-blue-400 font-medium">87%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Response Speed</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-400" style={{ width: '96%' }} />
              </div>
              <span className="text-purple-400 font-medium">96%</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
