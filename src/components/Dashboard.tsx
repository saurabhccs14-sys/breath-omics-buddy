import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Users, 
  Database, 
  Brain, 
  Thermometer, 
  Droplets, 
  Wind,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { PatientList } from './PatientList';
import { MLModelTraining } from './MLModelTraining';
import { RealTimePredictor } from './RealTimePredictor';
import { DataCollection } from './DataCollection';
import { AIAnalyticsCard } from './AIAnalyticsCard';

interface BiomarkerData {
  id: string;
  name: string;
  concentration: number;
  unit: string;
  status: 'normal' | 'elevated' | 'critical';
  diseaseAssociation: string;
  icon: React.ReactNode;
  change: number;
}

export const Dashboard = () => {
  const [biomarkerData, setBiomarkerData] = useState<BiomarkerData[]>([
    {
      id: 'acetone',
      name: 'Acetone',
      concentration: 2.45,
      unit: 'ppm',
      status: 'elevated',
      diseaseAssociation: 'Diabetes, Ketosis',
      icon: <Activity className="w-5 h-5" />,
      change: +12.5
    },
    {
      id: 'ammonia',
      name: 'Ammonia',
      concentration: 1.89,
      unit: 'ppm',
      status: 'normal',
      diseaseAssociation: 'Kidney Disease',
      icon: <Wind className="w-5 h-5" />,
      change: -3.2
    },
    {
      id: 'ethanol',
      name: 'Ethanol',
      concentration: 0.56,
      unit: 'ppm',
      status: 'normal',
      diseaseAssociation: 'Metabolic Disorders',
      icon: <Droplets className="w-5 h-5" />,
      change: +1.8
    },
    {
      id: 'isoprene',
      name: 'Isoprene',
      concentration: 0.34,
      unit: 'ppm',
      status: 'normal',
      diseaseAssociation: 'Lung Function',
      icon: <BarChart3 className="w-5 h-5" />,
      change: -0.5
    }
  ]);

  const [systemStats, setSystemStats] = useState({
    totalPatients: 142,
    activeSessions: 8,
    modelAccuracy: 97.8,
    dataPoints: 15420
  });

  const [aiInsights] = useState([
    {
      id: '1',
      title: 'Acetone Pattern Recognition',
      description: 'Detected recurring acetone elevation pattern consistent with early-stage diabetes indicators. Model suggests 89% correlation with glucose metabolism disruption.',
      confidence: 89,
      severity: 'medium' as const,
      category: 'pattern' as const
    },
    {
      id: '2',
      title: 'Anomaly Detection Alert',
      description: 'Unusual ammonia concentration spike detected in recent samples. This may indicate kidney function irregularities requiring medical attention.',
      confidence: 94,
      severity: 'high' as const,
      category: 'anomaly' as const
    },
    {
      id: '3',
      title: 'Cross-Biomarker Correlation',
      description: 'Strong negative correlation identified between isoprene and acetone levels, suggesting compensatory metabolic pathways activation.',
      confidence: 76,
      severity: 'low' as const,
      category: 'correlation' as const
    }
  ]);

  // Simulate real-time biomarker updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBiomarkerData(prev => prev.map(biomarker => {
        const newConcentration = Math.max(0, biomarker.concentration + (Math.random() - 0.5) * 0.2);
        const change = ((newConcentration - biomarker.concentration) / biomarker.concentration) * 100;
        return {
          ...biomarker,
          concentration: newConcentration,
          change: change,
          status: newConcentration > biomarker.concentration * 1.2 ? 'elevated' : 'normal'
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-surface">
      {/* Header */}
      <div className="bg-card border-b border-border shadow-elevated">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold gradient-text">
                Breath Biomarker Detection System
              </h1>
              <p className="text-muted-foreground mt-1">
                Real-time VOC analysis for disease detection
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="status-indicator bg-success"></div>
                <span className="text-sm font-medium">System Online</span>
              </div>
              <Button variant="outline" size="sm">
                <AlertCircle className="w-4 h-4 mr-2" />
                View Alerts
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="medical-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.totalPatients}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">+12%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="medical-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.activeSessions}</div>
              <p className="text-xs text-muted-foreground">
                Currently collecting data
              </p>
            </CardContent>
          </Card>

          <Card className="medical-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Model Accuracy</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.modelAccuracy}%</div>
              <Progress value={systemStats.modelAccuracy} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="medical-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Data Points</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.dataPoints.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Total breath samples
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="biomarkers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="biomarkers">Live Biomarkers</TabsTrigger>
            <TabsTrigger value="collection">Data Processing</TabsTrigger>
            <TabsTrigger value="training">AI Training</TabsTrigger>
            <TabsTrigger value="prediction">Real-time Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="biomarkers" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {biomarkerData.map((biomarker) => (
                <Card key={biomarker.id} className="medical-card hover:shadow-elevated transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{biomarker.name}</CardTitle>
                    {biomarker.icon}
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold mb-2">
                      {biomarker.concentration.toFixed(2)} <span className="text-sm font-normal">{biomarker.unit}</span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <Badge 
                        variant={biomarker.status === 'elevated' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {biomarker.status}
                      </Badge>
                      <div className={`text-xs font-medium ${biomarker.change > 0 ? 'text-destructive' : 'text-success'}`}>
                        {biomarker.change > 0 ? '+' : ''}{biomarker.change.toFixed(1)}%
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Associated: {biomarker.diseaseAssociation}
                    </div>
                    <Progress 
                      value={Math.min(100, (biomarker.concentration / 5) * 100)} 
                      className="mt-2 h-1" 
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="medical-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Biomarker Trends
                  </CardTitle>
                  <CardDescription>
                    Real-time concentration patterns and anomaly detection
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Trend Analysis</span>
                      <Badge variant="outline">Last 24h</Badge>
                    </div>
                    <div className="h-32 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                      <div className="text-muted-foreground text-sm">Interactive trend visualization</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <div className="font-medium">Peak Detection</div>
                        <div className="text-muted-foreground">3 anomalies found</div>
                      </div>
                      <div>
                        <div className="font-medium">Correlation</div>
                        <div className="text-muted-foreground">Strong acetone-glucose link</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <AIAnalyticsCard 
                insights={aiInsights}
                modelAccuracy={systemStats.modelAccuracy}
                processingTime={156}
              />
            </div>
          </TabsContent>

          <TabsContent value="collection">
            <DataCollection />
          </TabsContent>


          <TabsContent value="training">
            <MLModelTraining />
          </TabsContent>

          <TabsContent value="prediction">
            <RealTimePredictor />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};