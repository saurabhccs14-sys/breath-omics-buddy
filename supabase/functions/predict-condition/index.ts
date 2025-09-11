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

    const { sensorData, patientId, modelId } = await req.json()

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

    // Get model details
    const { data: model } = await supabase
      .from('ml_models')
      .select('*')
      .eq('id', modelId)
      .eq('created_by', user.id)
      .single()

    if (!model) {
      return new Response(JSON.stringify({ error: 'Model not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Store sensor reading
    const { data: sensorReading } = await supabase
      .from('sensor_readings')
      .insert({
        patient_id: patientId,
        session_id: `prediction_${Date.now()}`,
        sensor_data: sensorData,
        sample_duration: 5
      })
      .select()
      .single()

    // Feature extraction (simulated)
    const features = {
      s0_mean: sensorData.s0 || 0,
      s1_mean: sensorData.s1 || 0,
      s2_mean: sensorData.s2 || 0,
      s3_mean: sensorData.s3 || 0,
      temp_mean: sensorData.temp || 25,
      humidity_mean: sensorData.humidity || 50
    }

    // Simulate ML prediction
    const targetClasses = model.target_classes || ['healthy', 'diabetes', 'copd']
    
    // Simple rule-based prediction simulation
    let predictedCondition = 'healthy'
    let confidence = 0.5
    const probabilityScores: Record<string, number> = {}

    // Simulate prediction based on sensor values
    if (features.s0_mean > 600 || features.s1_mean > 500) {
      predictedCondition = 'diabetes'
      confidence = 0.75 + Math.random() * 0.2
    } else if (features.s2_mean > 400 || features.s3_mean > 700) {
      predictedCondition = 'copd'
      confidence = 0.70 + Math.random() * 0.25
    } else {
      predictedCondition = 'healthy'
      confidence = 0.60 + Math.random() * 0.3
    }

    // Generate probability scores
    let remainingProb = 1.0 - confidence
    for (const cls of targetClasses) {
      if (cls === predictedCondition) {
        probabilityScores[cls] = confidence
      } else {
        const prob = Math.random() * remainingProb
        probabilityScores[cls] = prob
        remainingProb -= prob
      }
    }

    // Normalize probabilities
    const totalProb = Object.values(probabilityScores).reduce((sum, prob) => sum + prob, 0)
    for (const cls in probabilityScores) {
      probabilityScores[cls] = probabilityScores[cls] / totalProb
    }

    // Simulate sensor contributions (feature importance for this prediction)
    const sensorContributions = {
      s0: Math.random() * 0.3,
      s1: Math.random() * 0.25,
      s2: Math.random() * 0.2,
      s3: Math.random() * 0.15,
      temp: Math.random() * 0.05,
      humidity: Math.random() * 0.05
    }

    // Store prediction
    const { data: prediction } = await supabase
      .from('predictions')
      .insert({
        patient_id: patientId,
        model_id: modelId,
        sensor_reading_id: sensorReading?.id,
        predicted_condition: predictedCondition,
        confidence,
        probability_scores: probabilityScores,
        sensor_contributions: sensorContributions
      })
      .select()
      .single()

    return new Response(
      JSON.stringify({
        success: true,
        prediction: {
          condition: predictedCondition,
          confidence,
          probabilityScores,
          sensorContributions,
          timestamp: new Date().toISOString()
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