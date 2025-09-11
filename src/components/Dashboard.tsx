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
import { SensorReadingCard } from './SensorReadingCard';
import { PatientList } from './PatientList';
import { MLModelTraining } from './MLModelTraining';
import { RealTimePredictor } from './RealTimePredictor';
import { DataCollection } from './DataCollection';

interface SensorData {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  target: string;
  icon: React.ReactNode;
}

export const Dashboard = () => {
  const [sensorData, setSensorData] = useState<SensorData[]>([
    {
      id: 'mq135',
      name: 'MQ-135',
      value: 245,
      unit: 'ppm',
      status: 'normal',
      target: 'NH₃, CO₂, Benzene',
      icon: <Wind className="w-5 h-5" />
    },
    {
      id: 'mq3',
      name: 'MQ-3',
      value: 189,
      unit: 'ppm',
      status: 'warning',
      target: 'Acetone, Ethanol',
      icon: <Activity className="w-5 h-5" />
    },
    {
      id: 'tgs822',
      name: 'TGS-822',
      value: 156,
      unit: 'ppm',
      status: 'normal',
      target: 'Organic Solvents',
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      id: 'dht11',
      name: 'DHT-11',
      value: 34.2,
      unit: '°C',
      status: 'normal',
      target: 'Temperature',
      icon: <Thermometer className="w-5 h-5" />
    }
  ]);

  const [systemStats, setSystemStats] = useState({
    totalPatients: 142,
    activeSessions: 8,
    modelAccuracy: 97.8,
    dataPoints: 15420
  });

  // Simulate real-time sensor updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData(prev => prev.map(sensor => ({
        ...sensor,
        value: sensor.value + (Math.random() - 0.5) * 10,
        status: Math.random() > 0.8 ? 'warning' : 'normal'
      })));
    }, 2000);

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
        <Tabs defaultValue="sensors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="sensors">Live Sensors</TabsTrigger>
            <TabsTrigger value="collection">Data Collection</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="training">ML Training</TabsTrigger>
            <TabsTrigger value="prediction">Prediction</TabsTrigger>
          </TabsList>

          <TabsContent value="sensors" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sensorData.map((sensor) => (
                <SensorReadingCard
                  key={sensor.id}
                  sensor={sensor}
                />
              ))}
            </div>
            
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Sensor Trends
                </CardTitle>
                <CardDescription>
                  Real-time monitoring of VOC biomarkers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Live sensor chart visualization would appear here
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="collection">
            <DataCollection />
          </TabsContent>

          <TabsContent value="patients">
            <PatientList />
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