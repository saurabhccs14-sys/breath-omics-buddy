import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Database, 
  Save, 
  User, 
  FileText,
  Activity,
  Brain,
  Zap,
  Cloud,
  Download,
  BarChart3,
  Sparkles,
  Globe
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const DataCollection = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [apiData, setApiData] = useState({
    endpoint: '',
    apiKey: '',
    format: 'json'
  });
  const [patientData, setPatientData] = useState({
    patientId: '',
    age: '',
    gender: '',
    condition: '',
    notes: ''
  });
  const { toast } = useToast();

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      toast({
        title: "File Selected",
        description: `${file.name} ready for processing`,
      });
    }
  }, [toast]);

  const processData = () => {
    setIsProcessing(true);
    setProcessingProgress(0);
    
    // Simulate AI processing
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          toast({
            title: "Processing Complete",
            description: "Breath biomarker data has been analyzed and integrated.",
          });
          return 100;
        }
        return prev + 3;
      });
    }, 150);

    toast({
      title: "AI Processing Started",
      description: "Analyzing breath biomarker patterns with machine learning models.",
    });
  };

  const fetchApiData = async () => {
    setIsProcessing(true);
    try {
      toast({
        title: "Fetching Data",
        description: "Connecting to external breath analysis APIs...",
      });
      
      // Simulate API call
      setTimeout(() => {
        setIsProcessing(false);
        toast({
          title: "Data Retrieved",
          description: "Successfully imported breath biomarker data from API.",
        });
      }, 2000);
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "Connection Failed",
        description: "Unable to connect to external API. Please check credentials.",
        variant: "destructive"
      });
    }
  };

  const saveSession = () => {
    toast({
      title: "Session Saved",
      description: "Patient data and recordings have been saved to the database.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Patient Information */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Patient Information
          </CardTitle>
          <CardDescription>
            Enter patient details for this data analysis session
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <Label htmlFor="condition">Target Condition</Label>
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
                  <SelectItem value="lung_cancer">Lung Cancer</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Clinical Notes</Label>
            <Textarea
              id="notes"
              placeholder="Patient history, symptoms, medications, lifestyle factors..."
              value={patientData.notes}
              onChange={(e) => setPatientData({...patientData, notes: e.target.value})}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Sources */}
      <Tabs defaultValue="file" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="file" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            File Upload
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            API Integration
          </TabsTrigger>
          <TabsTrigger value="synthetic" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Synthetic Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="file" className="space-y-6">
          <Card className="medical-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Breath Analysis Data
              </CardTitle>
              <CardDescription>
                Import CSV, JSON, or Excel files containing breath biomarker measurements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-primary/20 rounded-lg p-8 text-center space-y-4 hover:border-primary/40 transition-colors">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Drop files here or click to browse</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Supports CSV, JSON, XLSX files up to 50MB
                  </p>
                  <Input
                    type="file"
                    accept=".csv,.json,.xlsx"
                    onChange={handleFileUpload}
                    className="max-w-xs mx-auto"
                  />
                </div>
              </div>

              {uploadedFile && (
                <div className="flex items-center justify-between p-4 bg-success/10 border border-success/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-success" />
                    <div>
                      <div className="font-medium">{uploadedFile.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    Ready to Process
                  </Badge>
                </div>
              )}

              <div className="flex gap-3 justify-center">
                <Button
                  onClick={processData}
                  disabled={!uploadedFile || isProcessing}
                  className="medical-button"
                  size="lg"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  {isProcessing ? 'Processing...' : 'Analyze Data'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card className="medical-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                External API Integration
              </CardTitle>
              <CardDescription>
                Connect to breath analysis devices or cloud platforms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="endpoint">API Endpoint</Label>
                  <Input
                    id="endpoint"
                    placeholder="https://api.breathanalyzer.com/v1/data"
                    value={apiData.endpoint}
                    onChange={(e) => setApiData({...apiData, endpoint: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="Enter your API key"
                    value={apiData.apiKey}
                    onChange={(e) => setApiData({...apiData, apiKey: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="format">Data Format</Label>
                <Select value={apiData.format} onValueChange={(value) => setApiData({...apiData, format: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="xml">XML</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 justify-center">
                <Button
                  onClick={fetchApiData}
                  disabled={!apiData.endpoint || !apiData.apiKey || isProcessing}
                  className="medical-button"
                  size="lg"
                >
                  <Cloud className="w-4 h-4 mr-2" />
                  {isProcessing ? 'Connecting...' : 'Fetch Data'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="synthetic" className="space-y-6">
          <Card className="medical-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                AI-Generated Synthetic Data
              </CardTitle>
              <CardDescription>
                Generate realistic breath biomarker data for testing and validation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Sample Size</Label>
                  <Select defaultValue="100">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="50">50 samples</SelectItem>
                      <SelectItem value="100">100 samples</SelectItem>
                      <SelectItem value="500">500 samples</SelectItem>
                      <SelectItem value="1000">1000 samples</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Noise Level</Label>
                  <Select defaultValue="low">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (5%)</SelectItem>
                      <SelectItem value="medium">Medium (10%)</SelectItem>
                      <SelectItem value="high">High (20%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Disease Distribution</Label>
                  <Select defaultValue="balanced">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="imbalanced">Imbalanced</SelectItem>
                      <SelectItem value="healthy_only">Healthy Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <Button
                  onClick={processData}
                  disabled={isProcessing}
                  className="medical-button"
                  size="lg"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {isProcessing ? 'Generating...' : 'Generate Dataset'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Processing Status */}
      {isProcessing && (
        <Card className="medical-card">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2">
                <div className="status-indicator bg-primary animate-pulse"></div>
                <span className="font-medium">AI Processing in Progress...</span>
              </div>
              <Progress value={processingProgress} className="h-3" />
              <div className="text-sm text-muted-foreground text-center">
                {processingProgress.toFixed(0)}% Complete • Analyzing biomarker patterns
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Data Processing */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Recent Data Processing
          </CardTitle>
          <CardDescription>
            Latest breath biomarker datasets processed by the AI system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { 
                id: 'DS_2024_001', 
                source: 'File Upload', 
                samples: '1,250', 
                conditions: 'Diabetes, Healthy', 
                time: '5 min ago', 
                status: 'Processed',
                accuracy: '96.8%'
              },
              { 
                id: 'DS_2024_002', 
                source: 'API Integration', 
                samples: '2,100', 
                conditions: 'COPD, Asthma, Healthy', 
                time: '12 min ago', 
                status: 'Processing',
                accuracy: 'N/A'
              },
              { 
                id: 'DS_2024_003', 
                source: 'Synthetic Data', 
                samples: '5,000', 
                conditions: 'Multi-class', 
                time: '1 hour ago', 
                status: 'Processed',
                accuracy: '98.2%'
              },
              { 
                id: 'DS_2024_004', 
                source: 'File Upload', 
                samples: '875', 
                conditions: 'Kidney Disease, Healthy', 
                time: '2 hours ago', 
                status: 'Processed',
                accuracy: '94.5%'
              },
            ].map((record) => (
              <div key={record.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">{record.id}</div>
                    <div className="text-sm text-muted-foreground">
                      {record.samples} samples • {record.conditions}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Source: {record.source}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">{record.accuracy}</div>
                    <div className="text-xs text-muted-foreground">accuracy</div>
                  </div>
                  <div className="text-right">
                    <Badge variant={record.status === 'Processed' ? 'default' : 'secondary'}>
                      {record.status}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">{record.time}</div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};