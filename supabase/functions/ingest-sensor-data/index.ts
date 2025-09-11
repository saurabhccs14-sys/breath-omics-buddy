import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { patientId, sessionId, sensorData, environmentalData, sampleDuration } = await req.json()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Verify patient belongs to user
    const { data: patient } = await supabase
      .from('patients')
      .select('*')
      .eq('id', patientId)
      .eq('user_id', user.id)
      .single()

    if (!patient) {
      return new Response(JSON.stringify({ error: 'Patient not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Validate sensor data format
    const requiredFields = ['s0', 's1', 's2', 's3', 'temp', 'humidity']
    const missingSensorFields = requiredFields.filter(field => !(field in sensorData))
    
    if (missingSensorFields.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: `Missing sensor fields: ${missingSensorFields.join(', ')}`,
          requiredFields 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Basic data validation
    const sensorValues = [sensorData.s0, sensorData.s1, sensorData.s2, sensorData.s3]
    const invalidSensors = sensorValues.some(val => 
      typeof val !== 'number' || val < 0 || val > 1023
    )

    if (invalidSensors) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid sensor values. Must be numbers between 0-1023' 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Temperature and humidity validation
    if (typeof sensorData.temp !== 'number' || sensorData.temp < -40 || sensorData.temp > 85) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid temperature. Must be between -40°C and 85°C' 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (typeof sensorData.humidity !== 'number' || sensorData.humidity < 0 || sensorData.humidity > 100) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid humidity. Must be between 0% and 100%' 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Store sensor reading
    const { data: sensorReading, error: insertError } = await supabase
      .from('sensor_readings')
      .insert({
        patient_id: patientId,
        session_id: sessionId,
        sensor_data: sensorData,
        environmental_data: environmentalData || {},
        sample_duration: sampleDuration || 5
      })
      .select()
      .single()

    if (insertError) {
      throw insertError
    }

    // Update data collection progress if session exists
    const { data: collection } = await supabase
      .from('data_collections')
      .select('*')
      .eq('patient_id', patientId)
      .eq('collection_id', sessionId)
      .eq('created_by', user.id)
      .single()

    if (collection) {
      const newSampleCount = (collection.samples_collected || 0) + 1
      const progress = Math.min(100, Math.floor((newSampleCount / 100) * 100)) // Assume 100 samples target

      await supabase
        .from('data_collections')
        .update({
          samples_collected: newSampleCount,
          progress: progress,
          ...(progress >= 100 && { 
            status: 'completed',
            completed_at: new Date().toISOString()
          })
        })
        .eq('id', collection.id)
    }

    // Basic anomaly detection
    const anomalies = []
    
    // Check for sensor spikes
    if (sensorValues.some(val => val > 900)) {
      anomalies.push('High sensor reading detected')
    }
    
    // Check for unusual temperature
    if (sensorData.temp > 40 || sensorData.temp < 30) {
      anomalies.push('Unusual breath temperature')
    }
    
    // Check for unusual humidity
    if (sensorData.humidity < 60 || sensorData.humidity > 95) {
      anomalies.push('Unusual breath humidity')
    }

    return new Response(
      JSON.stringify({
        success: true,
        sensorReadingId: sensorReading.id,
        timestamp: sensorReading.created_at,
        anomalies: anomalies.length > 0 ? anomalies : null,
        dataQuality: {
          sensorRange: sensorValues.every(val => val >= 0 && val <= 1023),
          temperatureRange: sensorData.temp >= 30 && sensorData.temp <= 40,
          humidityRange: sensorData.humidity >= 60 && sensorData.humidity <= 95
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})