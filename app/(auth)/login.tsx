import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native'
import { router } from 'expo-router'
import { useAuth } from '../../context/AuthContext'
import { COLORS } from '../../lib/colors'

export default function LoginScreen() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }
    setLoading(true)
    setError('')
    const { error } = await signIn(email.trim(), password)
    setLoading(false)
    if (error) setError(error.message)
    else router.replace('/(tabs)/menu')
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.cream }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
        {/* Logo */}
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: COLORS.saffron,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 32 }}>🍛</Text>
          </View>
          <Text
            style={{
              fontSize: 28,
              fontFamily: 'PlayfairDisplay_700Bold',
              color: COLORS.charcoal,
            }}
          >
            Welcome Back
          </Text>
          <Text style={{ fontSize: 14, color: '#888', marginTop: 4 }}>
            Sign in to your Thali House account
          </Text>
        </View>

        {/* Form */}
        <View style={{ gap: 16 }}>
          <View>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '600',
                color: COLORS.charcoal,
                marginBottom: 6,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              style={{
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 14,
                fontSize: 16,
                borderWidth: 1,
                borderColor: '#E5E5E5',
                color: COLORS.charcoal,
              }}
            />
          </View>

          <View>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '600',
                color: COLORS.charcoal,
                marginBottom: 6,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              Password
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              style={{
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 14,
                fontSize: 16,
                borderWidth: 1,
                borderColor: '#E5E5E5',
                color: COLORS.charcoal,
              }}
            />
          </View>

          {error ? (
            <View style={{ backgroundColor: '#FEE2E2', borderRadius: 8, padding: 12 }}>
              <Text style={{ color: '#B91C1C', fontSize: 13 }}>{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            style={{
              backgroundColor: COLORS.saffron,
              borderRadius: 12,
              padding: 16,
              alignItems: 'center',
              marginTop: 8,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Sign In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(auth)/signup')}
            style={{ alignItems: 'center', paddingVertical: 12 }}
          >
            <Text style={{ color: COLORS.charcoal, fontSize: 14 }}>
              Don't have an account?{' '}
              <Text style={{ color: COLORS.saffron, fontWeight: '700' }}>Sign Up</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace('/(tabs)/menu')}
            style={{ alignItems: 'center', paddingVertical: 8 }}
          >
            <Text style={{ color: '#888', fontSize: 13 }}>Continue as guest</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
