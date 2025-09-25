import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if we have Supabase credentials, otherwise use demo mode
const isDemo = !supabaseUrl || !supabaseAnonKey

// Create a mock client for demo mode or real client for production
export const supabase = isDemo 
  ? createClient('https://demo.supabase.co', 'demo-key', {
      auth: { persistSession: false }
    })
  : createClient(supabaseUrl, supabaseAnonKey)

// Demo mode flag
export const isDemoMode = isDemo

// Auth helper functions
export const authHelpers = {
  signUp: async (email: string, password: string) => {
    if (isDemoMode) {
      // Mock successful signup for demo
      return { 
        data: { 
          user: { id: 'demo-user', email, created_at: new Date().toISOString() },
          session: null 
        }, 
        error: null 
      }
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  },

  signIn: async (email: string, password: string) => {
    if (isDemoMode) {
      // Mock successful signin for demo
      return { 
        data: { 
          user: { id: 'demo-user', email, created_at: new Date().toISOString() },
          session: { access_token: 'demo-token', user: { id: 'demo-user', email } }
        }, 
        error: null 
      }
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  signOut: async () => {
    if (isDemoMode) {
      return { error: null }
    }
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  getCurrentUser: async () => {
    if (isDemoMode) {
      return { 
        id: 'demo-user', 
        email: 'demo@example.com', 
        created_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        role: 'authenticated'
      } as any
    }
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    if (isDemoMode) {
      // Mock auth state for demo
      setTimeout(() => {
        callback('SIGNED_IN', { 
          access_token: 'demo-token', 
          user: { 
            id: 'demo-user', 
            email: 'demo@example.com',
            created_at: new Date().toISOString(),
            app_metadata: {},
            user_metadata: {},
            aud: 'authenticated',
            role: 'authenticated'
          } 
        })
      }, 100)
      return { data: { subscription: { unsubscribe: () => {} } } }
    }
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Mock data for demo mode
const mockPatients = [
  { id: '1', name: 'John Doe', patient_id: 'P001', age: 45, gender: 'male', condition: 'diabetes', created_at: '2024-01-15' },
  { id: '2', name: 'Jane Smith', patient_id: 'P002', age: 32, gender: 'female', condition: 'healthy', created_at: '2024-01-16' },
  { id: '3', name: 'Robert Johnson', patient_id: 'P003', age: 58, gender: 'male', condition: 'copd', created_at: '2024-01-17' },
  { id: '4', name: 'Emily Davis', patient_id: 'P004', age: 41, gender: 'female', condition: 'kidney', created_at: '2024-01-18' }
]

const mockSensorReadings = [
  { id: '1', patient_id: '1', sensor_data: { acetone: 2.45, ammonia: 1.2, ethanol: 0.8 }, timestamp: '2024-01-20T10:30:00Z' },
  { id: '2', patient_id: '2', sensor_data: { acetone: 1.1, ammonia: 0.9, ethanol: 0.5 }, timestamp: '2024-01-20T11:00:00Z' }
]

// Database helper functions
export const dbHelpers = {
  // Patients
  getPatients: async () => {
    if (isDemoMode) {
      return { data: mockPatients, error: null }
    }
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  createPatient: async (patient: any) => {
    if (isDemoMode) {
      const newPatient = { ...patient, id: Date.now().toString(), created_at: new Date().toISOString() }
      mockPatients.unshift(newPatient)
      return { data: newPatient, error: null }
    }
    const { data, error } = await supabase
      .from('patients')
      .insert(patient)
      .select()
      .single()
    return { data, error }
  },

  updatePatient: async (id: string, updates: any) => {
    if (isDemoMode) {
      const patientIndex = mockPatients.findIndex(p => p.id === id)
      if (patientIndex >= 0) {
        mockPatients[patientIndex] = { ...mockPatients[patientIndex], ...updates }
        return { data: mockPatients[patientIndex], error: null }
      }
      return { data: null, error: { message: 'Patient not found' } }
    }
    const { data, error } = await supabase
      .from('patients')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  deletePatient: async (id: string) => {
    if (isDemoMode) {
      const patientIndex = mockPatients.findIndex(p => p.id === id)
      if (patientIndex >= 0) {
        mockPatients.splice(patientIndex, 1)
      }
      return { error: null }
    }
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', id)
    return { error }
  },

  // Sensor Readings
  getSensorReadings: async (patientId?: string) => {
    if (isDemoMode) {
      let data = mockSensorReadings
      if (patientId) {
        data = data.filter(reading => reading.patient_id === patientId)
      }
      return { data, error: null }
    }
    let query = supabase
      .from('sensor_readings')
      .select(`
        *,
        patients (name, patient_id, condition)
      `)
      .order('timestamp', { ascending: false })

    if (patientId) {
      query = query.eq('patient_id', patientId)
    }

    const { data, error } = await query
    return { data, error }
  },

  createSensorReading: async (reading: any) => {
    if (isDemoMode) {
      const newReading = { ...reading, id: Date.now().toString(), timestamp: new Date().toISOString() }
      mockSensorReadings.unshift(newReading)
      return { data: newReading, error: null }
    }
    const { data, error } = await supabase
      .from('sensor_readings')
      .insert(reading)
      .select()
      .single()
    return { data, error }
  },

  // ML Models
  getMLModels: async () => {
    if (isDemoMode) {
      const mockModels = [
        { id: '1', name: 'XGBoost Classifier', algorithm: 'xgboost', accuracy: 0.978, status: 'active', created_at: '2024-01-15' },
        { id: '2', name: 'Random Forest', algorithm: 'random_forest', accuracy: 0.962, status: 'training', created_at: '2024-01-16' }
      ]
      return { data: mockModels, error: null }
    }
    const { data, error } = await supabase
      .from('ml_models')
      .select('*')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  createMLModel: async (model: any) => {
    if (isDemoMode) {
      const newModel = { ...model, id: Date.now().toString(), created_at: new Date().toISOString() }
      return { data: newModel, error: null }
    }
    const { data, error } = await supabase
      .from('ml_models')
      .insert(model)
      .select()
      .single()
    return { data, error }
  },

  // Training Sessions
  getTrainingSessions: async () => {
    if (isDemoMode) {
      const mockSessions = [
        { id: '1', model_name: 'Diabetes Detection v2.1', status: 'completed', accuracy: 0.978, progress: 100, created_at: '2024-01-15' },
        { id: '2', model_name: 'Multi-class Classifier', status: 'training', accuracy: 0.892, progress: 75, created_at: '2024-01-20' }
      ]
      return { data: mockSessions, error: null }
    }
    const { data, error } = await supabase
      .from('training_sessions')
      .select('*')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  getTrainingSession: async (id: string) => {
    if (isDemoMode) {
      const mockSession = { id, model_name: 'Demo Model', status: 'completed', accuracy: 0.978, progress: 100, created_at: '2024-01-15' }
      return { data: mockSession, error: null }
    }
    const { data, error } = await supabase
      .from('training_sessions')
      .select('*')
      .eq('id', id)
      .single()
    return { data, error }
  },

  // Predictions
  getPredictions: async (patientId?: string) => {
    if (isDemoMode) {
      const mockPredictions = [
        { id: '1', patient_id: '1', condition: 'diabetes', confidence: 0.94, timestamp: '2024-01-20T10:30:00Z' },
        { id: '2', patient_id: '2', condition: 'healthy', confidence: 0.87, timestamp: '2024-01-20T11:00:00Z' }
      ]
      let data = mockPredictions
      if (patientId) {
        data = data.filter(pred => pred.patient_id === patientId)
      }
      return { data, error: null }
    }
    let query = supabase
      .from('predictions')
      .select(`
        *,
        patients (name, patient_id),
        ml_models (name, algorithm)
      `)
      .order('timestamp', { ascending: false })

    if (patientId) {
      query = query.eq('patient_id', patientId)
    }

    const { data, error } = await query
    return { data, error }
  },

  // Data Collections
  getDataCollections: async () => {
    if (isDemoMode) {
      const mockCollections = [
        { id: '1', patient_id: '1', status: 'completed', samples_collected: 150, progress: 100, created_at: '2024-01-15' },
        { id: '2', patient_id: '2', status: 'in_progress', samples_collected: 75, progress: 50, created_at: '2024-01-20' }
      ]
      return { data: mockCollections, error: null }
    }
    const { data, error } = await supabase
      .from('data_collections')
      .select(`
        *,
        patients (name, patient_id)
      `)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  createDataCollection: async (collection: any) => {
    if (isDemoMode) {
      const newCollection = { ...collection, id: Date.now().toString(), created_at: new Date().toISOString() }
      return { data: newCollection, error: null }
    }
    const { data, error } = await supabase
      .from('data_collections')
      .insert(collection)
      .select()
      .single()
    return { data, error }
  },

  updateDataCollection: async (id: string, updates: any) => {
    if (isDemoMode) {
      return { data: { id, ...updates }, error: null }
    }
    const { data, error } = await supabase
      .from('data_collections')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  }
}

// Edge function helpers
export const edgeFunctions = {
  trainModel: async (algorithm: string, hyperparameters: any) => {
    if (isDemoMode) {
      // Simulate training process
      return { 
        data: { 
          sessionId: Date.now().toString(), 
          status: 'started',
          algorithm,
          hyperparameters 
        }, 
        error: null 
      }
    }
    const { data, error } = await supabase.functions.invoke('ml-training', {
      body: { algorithm, hyperparameters }
    })
    return { data, error }
  },

  predictCondition: async (sensorData: any, patientId: string, modelId: string) => {
    if (isDemoMode) {
      // Mock prediction based on sensor data
      const conditions = ['healthy', 'diabetes', 'kidney_disease', 'copd', 'asthma']
      const prediction = conditions[Math.floor(Math.random() * conditions.length)]
      const confidence = 0.85 + Math.random() * 0.1
      return { 
        data: { 
          prediction, 
          confidence: parseFloat(confidence.toFixed(3)),
          timestamp: new Date().toISOString(),
          sensorData 
        }, 
        error: null 
      }
    }
    const { data, error } = await supabase.functions.invoke('predict-condition', {
      body: { sensorData, patientId, modelId }
    })
    return { data, error }
  },

  ingestSensorData: async (patientId: string, sessionId: string, sensorData: any, environmentalData?: any, sampleDuration?: number) => {
    if (isDemoMode) {
      // Mock successful ingestion
      return { 
        data: { 
          success: true,
          sensorReadingId: Date.now().toString(),
          timestamp: new Date().toISOString(),
          patientId,
          sessionId 
        }, 
        error: null 
      }
    }
    const { data, error } = await supabase.functions.invoke('ingest-sensor-data', {
      body: { patientId, sessionId, sensorData, environmentalData, sampleDuration }
    })
    return { data, error }
  }
}

// Real-time subscriptions
export const subscriptions = {
  subscribeTo: (table: string, callback: (payload: any) => void) => {
    if (isDemoMode) {
      // Mock subscription for demo
      return {
        unsubscribe: () => {},
        subscribe: () => {}
      }
    }
    return supabase
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        callback
      )
      .subscribe()
  },

  subscribeToTrainingSession: (sessionId: string, callback: (payload: any) => void) => {
    if (isDemoMode) {
      // Mock training session updates
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        callback({
          new: { id: sessionId, progress, status: progress >= 100 ? 'completed' : 'training' }
        })
        if (progress >= 100) clearInterval(interval)
      }, 1000)
      return {
        unsubscribe: () => clearInterval(interval),
        subscribe: () => {}
      }
    }
    return supabase
      .channel(`training_session_${sessionId}`)
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'training_sessions',
          filter: `id=eq.${sessionId}`
        },
        callback
      )
      .subscribe()
  },

  subscribeToSensorReadings: (patientId: string, callback: (payload: any) => void) => {
    if (isDemoMode) {
      // Mock sensor reading updates
      const interval = setInterval(() => {
        callback({
          new: { 
            id: Date.now().toString(),
            patient_id: patientId, 
            sensor_data: { 
              acetone: 1 + Math.random() * 2, 
              ammonia: 0.5 + Math.random() * 1.5 
            },
            timestamp: new Date().toISOString()
          }
        })
      }, 5000)
      return {
        unsubscribe: () => clearInterval(interval),
        subscribe: () => {}
      }
    }
    return supabase
      .channel(`sensor_readings_${patientId}`)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'sensor_readings',
          filter: `patient_id=eq.${patientId}`
        },
        callback
      )
      .subscribe()
  }
}