import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Play, 
  Square, 
  Download, 
  Upload,
  BarChart3,
  Target,
  Zap,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
}

interface TrainingSession {
  id: string;
  name: string;
  algorithm: string;
  status: 'completed' | 'training' | 'failed';
  accuracy: number;
  trainingTime: string;
  dataPoints: number;
}

export const MLModelTraining = () => {
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [currentModel, setCurrentModel] = useState('XGBoost');
  const { toast } = useToast();

  const [metrics] = useState<ModelMetrics>({
    accuracy: 97.8,
    precision: 96.2,
    recall: 98.1,
    f1Score: 97.1
  });

  const [trainingSessions] = useState<TrainingSession[]>([
    {
      id: 'session_001',
      name: 'XGBoost Multi-class',
      algorithm: 'XGBoost',
      status: 'completed',
      accuracy: 97.8,
      trainingTime: '12m 34s',
      dataPoints: 15420
    },
    {
      id: 'session_002',
      name: 'SVM RBF Kernel',
      algorithm: 'SVM',
      status: 'completed',
      accuracy: 94.6,
      trainingTime: '8m 17s',
      dataPoints: 15420
    },
    {
      id: 'session_003',
      name: 'Random Forest',
      algorithm: 'Random Forest',
      status: 'failed',
      accuracy: 0,
      trainingTime: '0m 0s',
      dataPoints: 15420
    }
  ]);

  const startTraining = () => {
    setIsTraining(true);
    setTrainingProgress(0);
    
    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          toast({
            title: "Training Complete",
            description: "Model training finished successfully with 98.2% accuracy.",
          });
          return 100;
        }
        return prev + 1;
      });
    }, 150);

    toast({
      title: "Training Started",
      description: `Starting ${currentModel} model training on breath biomarker data.`,
    });
  };

  const stopTraining = () => {
    setIsTraining(false);
    setTrainingProgress(0);
    toast({
      title: "Training Stopped",
      description: "Model training has been interrupted.",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'training':
        return <Zap className="w-4 h-4 text-warning animate-pulse" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Training Control Panel */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            ML Model Training
          </CardTitle>
          <CardDescription>
            Train machine learning models for breath biomarker classification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Algorithm Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['XGBoost', 'SVM', 'Random Forest'].map((algorithm) => (
              <Card 
                key={algorithm}
                className={`cursor-pointer transition-all ${
                  currentModel === algorithm 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => setCurrentModel(algorithm)}
              >
                <CardContent className="pt-4 text-center">
                  <div className="font-semibold">{algorithm}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {algorithm === 'XGBoost' && 'Gradient Boosting'}
                    {algorithm === 'SVM' && 'Support Vector'}
                    {algorithm === 'Random Forest' && 'Ensemble Method'}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Training Progress */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <div className={`status-indicator ${isTraining ? 'bg-warning' : 'bg-muted'}`}></div>
              <span className="font-medium">
                {isTraining ? `Training ${currentModel} Model...` : 'Ready to Train'}
              </span>
            </div>
            
            {isTraining && (
              <div className="space-y-2">
                <Progress value={trainingProgress} className="h-3" />
                <div className="text-sm text-muted-foreground">
                  {trainingProgress.toFixed(0)}% Complete • Epoch {Math.floor(trainingProgress / 10) + 1}/10
                </div>
              </div>
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex gap-3 justify-center">
            {!isTraining ? (
              <Button
                onClick={startTraining}
                className="medical-button"
                size="lg"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Training
              </Button>
            ) : (
              <Button
                onClick={stopTraining}
                variant="destructive"
                size="lg"
              >
                <Square className="w-4 h-4 mr-2" />
                Stop Training
              </Button>
            )}
            
            <Button variant="outline" size="lg" disabled={isTraining}>
              <Upload className="w-4 h-4 mr-2" />
              Load Dataset
            </Button>
            
            <Button variant="outline" size="lg" disabled={isTraining}>
              <Download className="w-4 h-4 mr-2" />
              Export Model
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="metrics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="metrics">Model Metrics</TabsTrigger>
          <TabsTrigger value="history">Training History</TabsTrigger>
          <TabsTrigger value="features">Feature Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Model Performance */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Model Performance
                </CardTitle>
                <CardDescription>
                  Current best model: XGBoost Multi-class
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-success/10 rounded-lg">
                    <div className="text-2xl font-bold text-success">{metrics.accuracy}%</div>
                    <div className="text-xs text-muted-foreground">Accuracy</div>
                  </div>
                  <div className="text-center p-3 bg-primary/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{metrics.precision}%</div>
                    <div className="text-xs text-muted-foreground">Precision</div>
                  </div>
                  <div className="text-center p-3 bg-secondary/10 rounded-lg">
                    <div className="text-2xl font-bold text-secondary">{metrics.recall}%</div>
                    <div className="text-xs text-muted-foreground">Recall</div>
                  </div>
                  <div className="text-center p-3 bg-accent/10 rounded-lg">
                    <div className="text-2xl font-bold text-accent">{metrics.f1Score}%</div>
                    <div className="text-xs text-muted-foreground">F1-Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Confusion Matrix */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Confusion Matrix
                </CardTitle>
                <CardDescription>
                  Classification results by condition
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Confusion matrix visualization would appear here
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card className="medical-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Training History
              </CardTitle>
              <CardDescription>
                Previous training sessions and their results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trainingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(session.status)}
                      <div>
                        <div className="font-semibold">{session.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {session.algorithm} • {session.dataPoints.toLocaleString()} samples
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 text-right">
                      <div>
                        <div className="font-bold text-lg">
                          {session.status === 'completed' ? `${session.accuracy}%` : '—'}
                        </div>
                        <div className="text-xs text-muted-foreground">Accuracy</div>
                      </div>
                      <div>
                        <div className="font-medium">{session.trainingTime}</div>
                        <div className="text-xs text-muted-foreground">Duration</div>
                      </div>
                      <Badge 
                        className={
                          session.status === 'completed' ? 'bg-success text-success-foreground' :
                          session.status === 'training' ? 'bg-warning text-warning-foreground' :
                          'bg-destructive text-destructive-foreground'
                        }
                      >
                        {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <Card className="medical-card">
            <CardHeader>
              <CardTitle>Feature Importance</CardTitle>
              <CardDescription>
                Most important sensor readings for classification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'MQ-3 Delta (Acetone)', importance: 95, description: 'Primary diabetes biomarker' },
                  { name: 'MQ-135 Peak (Ammonia)', importance: 87, description: 'Kidney disease indicator' },
                  { name: 'TGS-822 AUC', importance: 73, description: 'Organic compound response' },
                  { name: 'Temperature Normalized', importance: 64, description: 'Environmental correction' },
                  { name: 'Humidity Ratio', importance: 52, description: 'Breath humidity factor' },
                ].map((feature, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{feature.name}</div>
                        <div className="text-xs text-muted-foreground">{feature.description}</div>
                      </div>
                      <div className="text-sm font-bold">{feature.importance}%</div>
                    </div>
                    <Progress value={feature.importance} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};