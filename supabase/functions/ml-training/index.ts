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

    const { algorithm, hyperparameters } = await req.json()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Create new training session
    const { data: trainingSession, error: sessionError } = await supabase
      .from('training_sessions')
      .insert({
        session_name: `Training_${Date.now()}`,
        algorithm,
        status: 'running',
        progress: 0,
        hyperparameters,
        created_by: user.id
      })
      .select()
      .single()

    if (sessionError) {
      throw sessionError
    }

    // Simulate ML training process
    const trainModel = async () => {
      // Get training data (sensor readings with patient conditions)
      const { data: trainingData, error: dataError } = await supabase
        .from('sensor_readings')
        .select(`
          *,
          patients!inner(condition, user_id)
        `)
        .eq('patients.user_id', user.id)

      if (dataError || !trainingData || trainingData.length === 0) {
        await supabase
          .from('training_sessions')
          .update({ 
            status: 'failed',
            progress: 0
          })
          .eq('id', trainingSession.id)
        return
      }

      // Feature extraction simulation
      const features = trainingData.map(reading => {
        const sensorData = reading.sensor_data as any
        return {
          s0_mean: sensorData.s0 || 0,
          s1_mean: sensorData.s1 || 0,
          s2_mean: sensorData.s2 || 0,
          s3_mean: sensorData.s3 || 0,
          temp_mean: sensorData.temp || 25,
          humidity_mean: sensorData.humidity || 50,
          label: reading.patients.condition || 'healthy'
        }
      })

      // Simulate training progress
      for (let progress = 10; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        await supabase
          .from('training_sessions')
          .update({ progress })
          .eq('id', trainingSession.id)
      }

      // Simulate model evaluation metrics
      const accuracy = 0.85 + Math.random() * 0.13 // 85-98%
      const precision = 0.82 + Math.random() * 0.15
      const recall = 0.80 + Math.random() * 0.17
      const f1Score = 2 * (precision * recall) / (precision + recall)

      // Feature importance simulation
      const featureImportance = {
        s0_mean: Math.random() * 0.3,
        s1_mean: Math.random() * 0.25,
        s2_mean: Math.random() * 0.2,
        s3_mean: Math.random() * 0.15,
        temp_mean: Math.random() * 0.05,
        humidity_mean: Math.random() * 0.05
      }

      // Confusion matrix simulation
      const labels = [...new Set(features.map(f => f.label))]
      const confusionMatrix = labels.reduce((matrix, label1) => {
        matrix[label1] = labels.reduce((row, label2) => {
          row[label2] = Math.floor(Math.random() * 20) + 1
          return row
        }, {} as Record<string, number>)
        return matrix
      }, {} as Record<string, Record<string, number>>)

      // Create ML model record
      const { data: model } = await supabase
        .from('ml_models')
        .insert({
          name: `${algorithm}_model_${Date.now()}`,
          algorithm,
          version: '1.0',
          hyperparameters,
          training_accuracy: accuracy,
          validation_accuracy: accuracy * 0.95,
          feature_names: Object.keys(featureImportance),
          target_classes: labels,
          status: 'trained',
          created_by: user.id
        })
        .select()
        .single()

      // Update training session
      await supabase
        .from('training_sessions')
        .update({
          model_id: model?.id,
          status: 'completed',
          progress: 100,
          accuracy,
          precision_score: precision,
          recall_score: recall,
          f1_score: f1Score,
          training_data_count: features.length,
          validation_data_count: Math.floor(features.length * 0.2),
          training_time: 45 + Math.floor(Math.random() * 60),
          feature_importance: featureImportance,
          confusion_matrix: confusionMatrix,
          completed_at: new Date().toISOString()
        })
        .eq('id', trainingSession.id)
    }

    // Start training in background
    trainModel().catch(console.error)

    return new Response(
      JSON.stringify({ 
        success: true, 
        sessionId: trainingSession.id,
        message: 'Training started successfully' 
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