import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Search, 
  Plus, 
  User, 
  Calendar, 
  Activity,
  MoreHorizontal,
  Eye,
  Edit,
  Trash
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  condition: string;
  samples: number;
  lastVisit: string;
  status: 'active' | 'inactive' | 'completed';
}

export const PatientList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  const [patients] = useState<Patient[]>([
    {
      id: 'P001',
      name: 'John Smith',
      age: 45,
      gender: 'Male',
      condition: 'Diabetes',
      samples: 12,
      lastVisit: '2024-01-15',
      status: 'active'
    },
    {
      id: 'P002',
      name: 'Sarah Johnson',
      age: 32,
      gender: 'Female',
      condition: 'Healthy',
      samples: 8,
      lastVisit: '2024-01-14',
      status: 'active'
    },
    {
      id: 'P003',
      name: 'Michael Brown',
      age: 58,
      gender: 'Male',
      condition: 'COPD',
      samples: 15,
      lastVisit: '2024-01-13',
      status: 'completed'
    },
    {
      id: 'P004',
      name: 'Emma Davis',
      age: 28,
      gender: 'Female',
      condition: 'Asthma',
      samples: 6,
      lastVisit: '2024-01-12',
      status: 'active'
    },
    {
      id: 'P005',
      name: 'Robert Wilson',
      age: 67,
      gender: 'Male',
      condition: 'Kidney Disease',
      samples: 9,
      lastVisit: '2024-01-10',
      status: 'inactive'
    }
  ]);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success text-success-foreground';
      case 'inactive':
        return 'bg-warning text-warning-foreground';
      case 'completed':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'diabetes':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'healthy':
        return 'bg-success/10 text-success border-success/20';
      case 'copd':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'asthma':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'kidney disease':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const handlePatientAction = (action: string, patientId: string) => {
    toast({
      title: `${action} Patient`,
      description: `${action} action for patient ${patientId}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <Card className="medical-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Patient Management
              </CardTitle>
              <CardDescription>
                View and manage patient records and breath sample data
              </CardDescription>
            </div>
            <Button className="medical-button">
              <Plus className="w-4 h-4 mr-2" />
              Add Patient
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search patients by name, ID, or condition..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Patient Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="medical-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">142</div>
              <div className="text-xs text-muted-foreground">Total Patients</div>
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-success">87</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">23</div>
              <div className="text-xs text-muted-foreground">Inactive</div>
            </div>
          </CardContent>
        </Card>
        <Card className="medical-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">32</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient List */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle>Patient Records</CardTitle>
          <CardDescription>
            {filteredPatients.length} of {patients.length} patients shown
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{patient.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {patient.id}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{patient.age} years • {patient.gender}</span>
                      <Badge className={`text-xs ${getConditionColor(patient.condition)}`}>
                        {patient.condition}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-lg font-bold">{patient.samples}</div>
                    <div className="text-xs text-muted-foreground">samples</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm font-medium">{patient.lastVisit}</div>
                    <div className="text-xs text-muted-foreground">last visit</div>
                  </div>

                  <Badge className={`${getStatusColor(patient.status)} capitalize`}>
                    {patient.status}
                  </Badge>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handlePatientAction('View', patient.id)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePatientAction('Edit', patient.id)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Patient
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handlePatientAction('Delete', patient.id)}
                        className="text-destructive"
                      >
                        <Trash className="w-4 h-4 mr-2" />
                        Delete Patient
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};