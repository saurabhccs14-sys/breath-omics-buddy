import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Zap,
  BarChart3
} from 'lucide-react';

interface AIInsight {
  id: string;
  title: string;
  description: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  category: 'pattern' | 'anomaly' | 'prediction' | 'correlation';
}

interface AIAnalyticsCardProps {
  insights: AIInsight[];
  modelAccuracy: number;
  processingTime: number;
}

export const AIAnalyticsCard: React.FC<AIAnalyticsCardProps> = ({
  insights,
  modelAccuracy,
  processingTime
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'pattern':
        return <BarChart3 className="w-4 h-4" />;
      case 'anomaly':
        return <AlertTriangle className="w-4 h-4" />;
      case 'prediction':
        return <Brain className="w-4 h-4" />;
      case 'correlation':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'warning';
      case 'low':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="medical-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          AI Analytics Engine
        </CardTitle>
        <CardDescription>
          Real-time insights from deep learning models
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Model Performance */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Model Accuracy</span>
              <span className="text-sm text-muted-foreground">{modelAccuracy}%</span>
            </div>
            <Progress value={modelAccuracy} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Processing Speed</span>
              <span className="text-sm text-muted-foreground">{processingTime}ms</span>
            </div>
            <Progress value={Math.min(100, (1000 - processingTime) / 10)} className="h-2" />
          </div>
        </div>

        {/* AI Insights */}
        <div className="space-y-3">
          <div className="text-sm font-medium mb-3">Latest AI Insights</div>
          {insights.map((insight) => (
            <div
              key={insight.id}
              className="p-3 bg-muted/30 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(insight.category)}
                  <span className="font-medium text-sm">{insight.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getSeverityColor(insight.severity) as any} className="text-xs">
                    {insight.severity}
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    {insight.confidence}%
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {insight.description}
              </p>
              <Progress value={insight.confidence} className="h-1 mt-2" />
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-lg font-bold text-primary">127</div>
            <div className="text-xs text-muted-foreground">Patterns Detected</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-secondary">8</div>
            <div className="text-xs text-muted-foreground">Anomalies Found</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-success">99.1%</div>
            <div className="text-xs text-muted-foreground">Uptime</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};