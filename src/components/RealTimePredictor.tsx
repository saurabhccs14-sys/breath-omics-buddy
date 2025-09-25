import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Brain,
  TrendingUp,
  Pause,
  Play
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PredictionResult {
  condition: string;
  confidence: number;
  probability: number;
  timestamp: string;
}

interface BiomarkerReading {
  compound: string;
  concentration: number;
  normalized: number;
  contribution: number;
  confidence: number;
}

export const RealTimePredictor = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState<PredictionResult | null>(null);
  const [predictionHistory, setPredictionHistory] = useState<PredictionResult[]>([]);
  const [biomarkerReadings, setBiomarkerReadings] = useState<BiomarkerReading[]>([
    { compound: 'Acetone', concentration: 2.45, normalized: 0.73, contribution: 0.42, confidence: 0.89 },
    { compound: 'Ammonia', concentration: 1.89, normalized: 0.82, contribution: 0.38, confidence: 0.94 },
    { compound: 'Ethanol', concentration: 0.56, normalized: 0.65, contribution: 0.15, confidence: 0.76 },
    { compound: 'Isoprene', concentration: 0.34, normalized: 0.58, contribution: 0.05, confidence: 0.68 }
  ]);
  const { toast } = useToast();

  // Simulate real-time predictions
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      // Simulate biomarker concentration updates
      setBiomarkerReadings(prev => prev.map(reading => ({
        ...reading,
        concentration: Math.max(0, reading.concentration + (Math.random() - 0.5) * 0.2),
        normalized: Math.max(0, Math.min(1, reading.normalized + (Math.random() - 0.5) * 0.1)),
        contribution: Math.max(0, Math.min(1, reading.contribution + (Math.random() - 0.5) * 0.08)),
        confidence: Math.max(0.5, Math.min(1, reading.confidence + (Math.random() - 0.5) * 0.05))
      })));

      // Generate prediction
      const conditions = ['Healthy', 'Diabetes', 'Kidney Disease', 'COPD', 'Asthma'];
      const weights = [0.4, 0.25, 0.15, 0.12, 0.08]; // Probability weights
      
      const randomValue = Math.random();
      let cumulativeWeight = 0;
      let predictedCondition = 'Healthy';
      
      for (let i = 0; i < conditions.length; i++) {
        cumulativeWeight += weights[i];
        if (randomValue <= cumulativeWeight) {
          predictedCondition = conditions[i];
          break;
        }
      }

      const confidence = 85 + Math.random() * 13; // 85-98% confidence
      const probability = confidence / 100;

      const newPrediction: PredictionResult = {
        condition: predictedCondition,
        confidence: parseFloat(confidence.toFixed(1)),
        probability: parseFloat(probability.toFixed(3)),
        timestamp: new Date().toLocaleTimeString()
      };

      setCurrentPrediction(newPrediction);
      setPredictionHistory(prev => [newPrediction, ...prev.slice(0, 9)]); // Keep last 10
    }, 3000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const startPrediction = () => {
    setIsRunning(true);
    toast({
      title: "Real-time Prediction Started",
      description: "Now analyzing breath samples for disease markers.",
    });
  };

  const stopPrediction = () => {
    setIsRunning(false);
    toast({
      title: "Prediction Stopped",
      description: "Real-time analysis has been paused.",
    });
  };

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'healthy':
        return 'bg-success text-success-foreground';
      case 'diabetes':
        return 'bg-destructive text-destructive-foreground';
      case 'kidney disease':
        return 'bg-warning text-warning-foreground';
      case 'copd':
        return 'bg-primary text-primary-foreground';
      case 'asthma':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getConditionIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4" />;
      case 'diabetes':
      case 'kidney disease':
      case 'copd':
      case 'asthma':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Prediction Control */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Real-Time Disease Prediction
          </CardTitle>
          <CardDescription>
            Live analysis of breath biomarkers using trained ML models
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <div className={`status-indicator ${isRunning ? 'bg-success' : 'bg-muted'}`}></div>
              <span className="font-medium">
                {isRunning ? 'Analyzing Breath Samples...' : 'Ready for Analysis'}
              </span>
            </div>
            
            <div className="flex gap-3 justify-center">
              {!isRunning ? (
                <Button
                  onClick={startPrediction}
                  className="medical-button"
                  size="lg"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Analysis
                </Button>
              ) : (
                <Button
                  onClick={stopPrediction}
                  variant="outline"
                  size="lg"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pause Analysis
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Prediction */}
        <Card className="medical-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Current Prediction
            </CardTitle>
            <CardDescription>
              Latest breath analysis result
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentPrediction ? (
              <>
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    {getConditionIcon(currentPrediction.condition)}
                    <Badge className={`text-lg px-4 py-2 ${getConditionColor(currentPrediction.condition)}`}>
                      {currentPrediction.condition}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-primary">
                      {currentPrediction.confidence}%
                    </div>
                    <div className="text-sm text-muted-foreground">Confidence Level</div>
                    <Progress value={currentPrediction.confidence} className="h-3" />
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Last updated: {currentPrediction.timestamp}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {isRunning ? "Waiting for breath sample..." : "Start analysis to see predictions"}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Biomarker Analysis */}
        <Card className="medical-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Biomarker Analysis
            </CardTitle>
            <CardDescription>
              Key volatile organic compounds and their diagnostic significance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {biomarkerReadings.map((reading, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-semibold">{reading.compound}</div>
                        <Badge variant="outline" className="text-xs">
                          {(reading.confidence * 100).toFixed(0)}% confidence
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Concentration: {reading.concentration.toFixed(2)} ppm • Normalized: {reading.normalized.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-primary">
                        {(reading.contribution * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground">influence</div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Progress value={reading.contribution * 100} className="h-2" />
                    <Progress value={reading.confidence * 100} className="h-1 opacity-50" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-3 bg-muted/30 rounded-lg">
              <div className="text-sm font-medium mb-2">AI Model Insights</div>
              <div className="text-xs text-muted-foreground">
                The neural network identifies acetone elevation as the primary diagnostic indicator, 
                with ammonia levels providing secondary confirmation. Confidence intervals suggest 
                high reliability in current prediction.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prediction History */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Prediction History
          </CardTitle>
          <CardDescription>
            Recent breath analysis results
          </CardDescription>
        </CardHeader>
        <CardContent>
          {predictionHistory.length > 0 ? (
            <div className="space-y-3">
              {predictionHistory.map((prediction, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    {getConditionIcon(prediction.condition)}
                    <div>
                      <div className="font-semibold">{prediction.condition}</div>
                      <div className="text-xs text-muted-foreground">
                        Probability: {(prediction.probability * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-bold">{prediction.confidence}%</div>
                      <div className="text-xs text-muted-foreground">confidence</div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {prediction.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No predictions yet. Start analysis to see results.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};