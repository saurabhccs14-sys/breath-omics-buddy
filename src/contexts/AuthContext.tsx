import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { authHelpers } from '@/lib/supabase'
import { toast } from '@/hooks/use-toast'

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial user
    authHelpers.getCurrentUser().then((user) => {
      setUser(user as User)
      setLoading(false)
    })

    // Listen for auth changes
    const authListener = authHelpers.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Handle cleanup for different return types (demo vs real)
    return () => {
      try {
        if (authListener && typeof authListener === 'object') {
          if ('data' in authListener && authListener.data?.subscription?.unsubscribe) {
            authListener.data.subscription.unsubscribe()
          } else if ('unsubscribe' in authListener && typeof authListener.unsubscribe === 'function') {
            authListener.unsubscribe()
          }
        }
      } catch (error) {
        // Ignore cleanup errors in demo mode
        console.log('Auth cleanup error (safe to ignore in demo mode):', error)
      }
    }
  }, [])

  const signUp = async (email: string, password: string) => {
    const { error } = await authHelpers.signUp(email, password)
    if (error) {
      toast({
        title: "Sign Up Failed",
        description: error.message,
        variant: "destructive"
      })
      throw error
    } else {
      toast({
        title: "Success!",
        description: "Please check your email to confirm your account."
      })
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await authHelpers.signIn(email, password)
    if (error) {
      toast({
        title: "Sign In Failed",
        description: error.message,
        variant: "destructive"
      })
      throw error
    } else {
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in."
      })
    }
  }

  const signOut = async () => {
    const { error } = await authHelpers.signOut()
    if (error) {
      toast({
        title: "Sign Out Failed",
        description: error.message,
        variant: "destructive"
      })
      throw error
    } else {
      toast({
        title: "Signed out",
        description: "You have been successfully signed out."
      })
    }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}