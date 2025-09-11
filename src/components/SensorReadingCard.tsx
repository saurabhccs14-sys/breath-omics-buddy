import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SensorData {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  target: string;
  icon: React.ReactNode;
}

interface SensorReadingCardProps {
  sensor: SensorData;
}

export const SensorReadingCard: React.FC<SensorReadingCardProps> = ({ sensor }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'bg-destructive text-destructive-foreground';
      case 'warning':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-success text-success-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical':
        return <TrendingUp className="w-3 h-3" />;
      case 'warning':
        return <TrendingDown className="w-3 h-3" />;
      default:
        return <Minus className="w-3 h-3" />;
    }
  };

  const normalizedValue = Math.min((sensor.value / 500) * 100, 100);

  return (
    <Card className="medical-card hover:shadow-glow transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {sensor.icon}
            <CardTitle className="text-lg">{sensor.name}</CardTitle>
          </div>
          <Badge 
            className={`${getStatusColor(sensor.status)} text-xs px-2 py-1`}
          >
            {getStatusIcon(sensor.status)}
            {sensor.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="sensor-reading text-3xl bg-gradient-primary bg-clip-text text-transparent">
            {sensor.value.toFixed(1)}
          </div>
          <div className="text-sm text-muted-foreground font-medium">
            {sensor.unit}
          </div>
        </div>
        
        <Progress 
          value={normalizedValue} 
          className="h-2"
        />
        
        <div className="text-xs text-muted-foreground">
          <div className="font-medium mb-1">Target Compounds:</div>
          <div className="bg-muted rounded p-2">
            {sensor.target}
          </div>
        </div>
        
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Last update:</span>
          <span className="font-medium">2s ago</span>
        </div>
      </CardContent>
    </Card>
  );
};