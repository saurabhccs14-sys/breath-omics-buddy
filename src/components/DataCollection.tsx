import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Square, 
  Save, 
  User, 
  Calendar, 
  Timer,
  FileText,
  Activity,
  Database
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const DataCollection = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [patientData, setPatientData] = useState({
    patientId: '',
    age: '',
    gender: '',
    condition: '',
    notes: ''
  });
  const { toast } = useToast();

  const startRecording = () => {
    setIsRecording(true);
    setRecordingProgress(0);
    
    // Simulate recording progress
    const interval = setInterval(() => {
      setRecordingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRecording(false);
          toast({
            title: "Recording Complete",
            description: "Breath sample has been collected and saved.",
          });
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    toast({
      title: "Recording Started",
      description: "Please have the patient exhale into the sensor chamber.",
    });
  };

  const stopRecording = () => {
    setIsRecording(false);
    setRecordingProgress(0);
    toast({
      title: "Recording Stopped",
      description: "Data collection has been terminated.",
    });
  };

  const saveSession = () => {
    toast({
      title: "Session Saved",
      description: "Patient data and recordings have been saved to the database.",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Patient Information */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Patient Information
          </CardTitle>
          <CardDescription>
            Enter patient details for this data collection session
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientId">Patient ID</Label>
              <Input
                id="patientId"
                placeholder="P001"
                value={patientData.patientId}
                onChange={(e) => setPatientData({...patientData, patientId: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="35"
                value={patientData.age}
                onChange={(e) => setPatientData({...patientData, age: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={patientData.gender} onValueChange={(value) => setPatientData({...patientData, gender: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Select value={patientData.condition} onValueChange={(value) => setPatientData({...patientData, condition: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="healthy">Healthy Control</SelectItem>
                  <SelectItem value="diabetes">Diabetes</SelectItem>
                  <SelectItem value="kidney">Kidney Disease</SelectItem>
                  <SelectItem value="copd">COPD</SelectItem>
                  <SelectItem value="asthma">Asthma</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes about the patient or session..."
              value={patientData.notes}
              onChange={(e) => setPatientData({...patientData, notes: e.target.value})}
            />
          </div>
        </CardContent>
      </Card>

      {/* Recording Controls */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Data Recording
          </CardTitle>
          <CardDescription>
            Control breath sample collection and monitoring
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Recording Status */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <div className={`status-indicator ${isRecording ? 'bg-destructive' : 'bg-muted'}`}></div>
              <span className="font-medium">
                {isRecording ? 'Recording in Progress' : 'Ready to Record'}
              </span>
            </div>
            
            {isRecording && (
              <div className="space-y-2">
                <Progress value={recordingProgress} className="h-3" />
                <div className="text-sm text-muted-foreground">
                  {recordingProgress.toFixed(0)}% Complete
                </div>
              </div>
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex gap-3 justify-center">
            {!isRecording ? (
              <Button
                onClick={startRecording}
                className="medical-button"
                size="lg"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Recording
              </Button>
            ) : (
              <Button
                onClick={stopRecording}
                variant="destructive"
                size="lg"
              >
                <Square className="w-4 h-4 mr-2" />
                Stop Recording
              </Button>
            )}
            
            <Button
              onClick={saveSession}
              variant="outline"
              size="lg"
              disabled={isRecording}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Session
            </Button>
          </div>

          {/* Session Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">5</div>
              <div className="text-xs text-muted-foreground">Samples Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">12.5</div>
              <div className="text-xs text-muted-foreground">Avg Duration (s)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">98.2%</div>
              <div className="text-xs text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Collections */}
      <Card className="medical-card lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Recent Collections
          </CardTitle>
          <CardDescription>
            Latest breath samples collected from patients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { id: 'P001_S03', patient: 'P001', condition: 'Diabetes', time: '2 min ago', status: 'Processed' },
              { id: 'P005_S01', patient: 'P005', condition: 'Healthy', time: '5 min ago', status: 'Processing' },
              { id: 'P003_S02', patient: 'P003', condition: 'COPD', time: '8 min ago', status: 'Processed' },
              { id: 'P007_S01', patient: 'P007', condition: 'Kidney Disease', time: '12 min ago', status: 'Processed' },
            ].map((record) => (
              <div key={record.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{record.id}</div>
                    <div className="text-xs text-muted-foreground">
                      Patient {record.patient} • {record.condition}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xs text-muted-foreground">{record.time}</div>
                  <Badge variant={record.status === 'Processed' ? 'default' : 'secondary'}>
                    {record.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};