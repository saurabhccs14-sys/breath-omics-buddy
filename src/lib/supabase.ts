import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helper functions
export const authHelpers = {
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Database helper functions
export const dbHelpers = {
  // Patients
  getPatients: async () => {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  createPatient: async (patient: any) => {
    const { data, error } = await supabase
      .from('patients')
      .insert(patient)
      .select()
      .single()
    return { data, error }
  },

  updatePatient: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('patients')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  deletePatient: async (id: string) => {
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', id)
    return { error }
  },

  // Sensor Readings
  getSensorReadings: async (patientId?: string) => {
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
    const { data, error } = await supabase
      .from('sensor_readings')
      .insert(reading)
      .select()
      .single()
    return { data, error }
  },

  // ML Models
  getMLModels: async () => {
    const { data, error } = await supabase
      .from('ml_models')
      .select('*')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  createMLModel: async (model: any) => {
    const { data, error } = await supabase
      .from('ml_models')
      .insert(model)
      .select()
      .single()
    return { data, error }
  },

  // Training Sessions
  getTrainingSessions: async () => {
    const { data, error } = await supabase
      .from('training_sessions')
      .select('*')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  getTrainingSession: async (id: string) => {
    const { data, error } = await supabase
      .from('training_sessions')
      .select('*')
      .eq('id', id)
      .single()
    return { data, error }
  },

  // Predictions
  getPredictions: async (patientId?: string) => {
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
    const { data, error } = await supabase
      .from('data_collections')
      .insert(collection)
      .select()
      .single()
    return { data, error }
  },

  updateDataCollection: async (id: string, updates: any) => {
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
    const { data, error } = await supabase.functions.invoke('ml-training', {
      body: { algorithm, hyperparameters }
    })
    return { data, error }
  },

  predictCondition: async (sensorData: any, patientId: string, modelId: string) => {
    const { data, error } = await supabase.functions.invoke('predict-condition', {
      body: { sensorData, patientId, modelId }
    })
    return { data, error }
  },

  ingestSensorData: async (patientId: string, sessionId: string, sensorData: any, environmentalData?: any, sampleDuration?: number) => {
    const { data, error } = await supabase.functions.invoke('ingest-sensor-data', {
      body: { patientId, sessionId, sensorData, environmentalData, sampleDuration }
    })
    return { data, error }
  }
}

// Real-time subscriptions
export const subscriptions = {
  subscribeTo: (table: string, callback: (payload: any) => void) => {
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