import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, TrendingUp, AlertTriangle, Target, Zap, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const Analysis = () => {
  const [symbol, setSymbol] = useState('AAPL');
  const [analysisData, setAnalysisData] = useState(null);

  // Mock analysis data
  const stockAnalysis = {
    symbol: 'AAPL',
    currentPrice: 178.50,
    aiScore: 87.5,
    sentiment: 'Bullish',
    riskLevel: 'Medium',
    targetPrice: 195.00,
    confidence: 92.3
  };

  const technicalData = [
    { name: 'RSI', value: 68, optimal: 50 },
    { name: 'MACD', value: 1.2, optimal: 0 },
    { name: 'BB%', value: 0.75, optimal: 0.5 },
    { name: 'Stoch', value: 72, optimal: 50 },
    { name: 'Williams', value: -28, optimal: -50 },
    { name: 'CCI', value: 110, optimal: 0 }
  ];

  const aiInsights = [
    {
      type: 'bullish',
      title: 'Strong Neural Signal Detected',
      description: 'AI models indicate 87% probability of upward movement in next 5-10 trading days',
      confidence: 87,
      timeframe: '5-10 days'
    },
    {
      type: 'warning',
      title: 'Quantum Resistance Level',
      description: 'Price approaching significant resistance at $185. Potential consolidation expected',
      confidence: 73,
      timeframe: '2-3 days'
    },
    {
      type: 'opportunity',
      title: 'Optimal Entry Window',
      description: 'Current price levels present favorable risk/reward ratio for long positions',
      confidence: 91,
      timeframe: 'Immediate'
    }
  ];

  const sentimentData = [
    { source: 'Social Media', score: 82, volume: 15420 },
    { source: 'News Articles', score: 76, volume: 342 },
    { source: 'Analyst Reports', score: 89, volume: 23 },
    { source: 'Options Flow', score: 71, volume: 8934 },
    { source: 'Insider Trading', score: 85, volume: 12 }
  ];

  const radarData = [
    { subject: 'Technical', A: 87, fullMark: 100 },
    { subject: 'Fundamental', A: 82, fullMark: 100 },
    { subject: 'Sentiment', A: 79, fullMark: 100 },
    { subject: 'Momentum', A: 91, fullMark: 100 },
    { subject: 'Volume', A: 74, fullMark: 100 },
    { subject: 'Volatility', A: 68, fullMark: 100 }
  ];

  const priceTargets = [
    { timeframe: '1 Week', target: 182.50, probability: 78 },
    { timeframe: '1 Month', target: 195.00, probability: 67 },
    { timeframe: '3 Months', target: 210.00, probability: 54 },
    { timeframe: '6 Months', target: 225.00, probability: 42 }
  ];

  return (
    <div className="space-y-6">
      {/* Search and Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI-Powered Stock Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Enter stock symbol (e.g., AAPL)"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              className="max-w-xs"
            />
            <Button className="bg-gradient-neural hover:bg-gradient-neural/90">
              Analyze
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stockAnalysis.aiScore}</div>
              <div className="text-sm text-muted-foreground">AI Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">${stockAnalysis.currentPrice}</div>
              <div className="text-sm text-muted-foreground">Current Price</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-resonance">${stockAnalysis.targetPrice}</div>
              <div className="text-sm text-muted-foreground">Target Price</div>
            </div>
            <div className="text-center">
              <Badge variant="default" className="bg-resonance/20 text-resonance">
                {stockAnalysis.sentiment}
              </Badge>
              <div className="text-sm text-muted-foreground mt-1">Sentiment</div>
            </div>
            <div className="text-center">
              <Badge variant="outline" className="border-temporal text-temporal">
                {stockAnalysis.riskLevel}
              </Badge>
              <div className="text-sm text-muted-foreground mt-1">Risk Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stockAnalysis.confidence}%</div>
              <div className="text-sm text-muted-foreground">Confidence</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
          <TabsTrigger value="targets">Price Targets</TabsTrigger>
          <TabsTrigger value="radar">Radar Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiInsights.map((insight, index) => (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {insight.type === 'bullish' && <TrendingUp className="h-4 w-4 text-resonance" />}
                      {insight.type === 'warning' && <AlertTriangle className="h-4 w-4 text-temporal" />}
                      {insight.type === 'opportunity' && <Target className="h-4 w-4 text-primary" />}
                      <CardTitle className="text-sm">{insight.title}</CardTitle>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {insight.confidence}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                  <div className="text-xs text-primary font-medium">
                    Timeframe: {insight.timeframe}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="technical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Technical Indicators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={technicalData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="name" className="text-xs fill-muted-foreground" />
                    <YAxis className="text-xs fill-muted-foreground" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }}
                    />
                    <Bar dataKey="value" fill="hsl(var(--primary))" />
                    <Bar dataKey="optimal" fill="hsl(var(--muted))" opacity={0.3} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sentiment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Multi-Source Sentiment Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sentimentData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="font-medium">{item.source}</div>
                      <Badge 
                        variant={item.score >= 70 ? "default" : "destructive"}
                        className={item.score >= 70 ? "bg-resonance/20 text-resonance" : "bg-chaos/20 text-chaos"}
                      >
                        {item.score}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Volume: {item.volume.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="targets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-temporal" />
                AI-Generated Price Targets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {priceTargets.map((target, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="font-medium">{target.timeframe}</div>
                      <div className="text-2xl font-bold text-temporal">${target.target}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Probability</div>
                      <Badge variant="outline" className="border-primary text-primary">
                        {target.probability}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="radar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Multi-Dimensional Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis domain={[0, 100]} />
                    <Radar
                      name="Analysis Score"
                      dataKey="A"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analysis;