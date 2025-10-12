import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';

export function NewsPanel() {
  const { data: news, isLoading } = useQuery({
    queryKey: ['market-news'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('market_news')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 60000, // Refresh every minute
  });

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="p-3 bg-slate-800/50 border-slate-700">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3 mt-2" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      {news?.map((article) => {
        const sentiment = article.sentiment_score || 0;
        const isPositive = sentiment > 0.1;
        const isNegative = sentiment < -0.1;
        
        return (
          <Card key={article.id} className="p-3 bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-slate-500">
                    {article.source}
                  </span>
                  {sentiment !== 0 && (
                    <Badge 
                      className={`text-xs ${
                        isPositive 
                          ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                          : isNegative
                          ? 'bg-red-500/10 text-red-400 border-red-500/20'
                          : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                      }`}
                    >
                      {isPositive ? (
                        <TrendingUp className="w-2 h-2 mr-1" />
                      ) : isNegative ? (
                        <TrendingDown className="w-2 h-2 mr-1" />
                      ) : null}
                      {(sentiment * 100).toFixed(0)}%
                    </Badge>
                  )}
                </div>
                
                <h3 className="text-sm font-medium text-white mb-1 line-clamp-2">
                  {article.title}
                </h3>
                
                <p className="text-xs text-slate-400 line-clamp-2 mb-2">
                  {article.description}
                </p>
                
                {article.symbols && article.symbols.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {article.symbols.slice(0, 3).map((symbol) => (
                      <Badge key={symbol} variant="outline" className="text-xs border-blue-500/30 text-blue-400">
                        {symbol}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <a 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </Card>
        );
      })}
      
      {(!news || news.length === 0) && (
        <div className="text-center text-slate-400 py-8">
          No news available
        </div>
      )}
    </div>
  );
}
