import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Session, User } from '@supabase/supabase-js'

export interface CustomerProfile {
  id: string
  auth_id: string
  full_name: string
  email: string
  whatsapp_number: string
  phone: string
  language_preference: 'mr' | 'hi' | 'en' | 'kn'
  total_orders: number
  loyalty_points: number
}

interface AuthContextType {
  session: Session | null
  user: User | null
  profile: CustomerProfile | null
  loading: boolean
  signUp: (
    email: string,
    password: string,
    data: { full_name: string; whatsapp_number: string; language_preference: string }
  ) => Promise<{ error: Error | null }>
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<CustomerProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(authId: string) {
    try {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', authId)
        .single()
      setProfile(data)
    } catch {
      // Profile may not exist yet
    } finally {
      setLoading(false)
    }
  }

  async function refreshProfile() {
    if (user) await fetchProfile(user.id)
  }

  async function signUp(
    email: string,
    password: string,
    data: { full_name: string; whatsapp_number: string; language_preference: string }
  ) {
    const { data: authData, error } = await supabase.auth.signUp({ email, password })
    if (error) return { error: error as Error }
    if (authData.user) {
      await supabase.from('users').insert({
        auth_id: authData.user.id,
        email,
        full_name: data.full_name,
        whatsapp_number: data.whatsapp_number,
        language_preference: data.language_preference,
        total_orders: 0,
        loyalty_points: 0,
      })
    }
    return { error: null }
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: (error as Error | null) }
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{ session, user, profile, loading, signUp, signIn, signOut, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
