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

const LANGUAGES = [
  { code: 'en' as const, label: 'English' },
  { code: 'mr' as const, label: 'मराठी' },
  { code: 'hi' as const, label: 'हिंदी' },
  { code: 'kn' as const, label: 'ಕನ್ನಡ' },
]

export default function SignupScreen() {
  const { signUp } = useAuth()
  const [fullName, setFullName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [language, setLanguage] = useState<'en' | 'mr' | 'hi' | 'kn'>('en')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup() {
    if (!fullName || !email || !password || !whatsapp) {
      setError('Please fill in all fields')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    setError('')
    const { error } = await signUp(email.trim(), password, {
      full_name: fullName,
      whatsapp_number: whatsapp.startsWith('+91') ? whatsapp : `+91${whatsapp}`,
      language_preference: language,
    })
    setLoading(false)
    if (error) setError(error.message)
    else router.replace('/(tabs)/menu')
  }

  const fields = [
    {
      label: 'Full Name',
      value: fullName,
      setter: setFullName,
      placeholder: 'Raj Patil',
      keyboard: 'default' as const,
      secure: false,
      capitalize: 'words' as const,
    },
    {
      label: 'WhatsApp Number',
      value: whatsapp,
      setter: setWhatsapp,
      placeholder: '9XXXXXXXXX',
      keyboard: 'phone-pad' as const,
      secure: false,
      capitalize: 'none' as const,
    },
    {
      label: 'Email',
      value: email,
      setter: setEmail,
      placeholder: 'you@example.com',
      keyboard: 'email-address' as const,
      secure: false,
      capitalize: 'none' as const,
    },
    {
      label: 'Password',
      value: password,
      setter: setPassword,
      placeholder: '••••••••',
      keyboard: 'default' as const,
      secure: true,
      capitalize: 'none' as const,
    },
  ]

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.cream }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
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
            Create Account
          </Text>
          <Text style={{ fontSize: 14, color: '#888', marginTop: 4 }}>
            Join the Thali House family
          </Text>
        </View>

        <View style={{ gap: 14 }}>
          {fields.map(({ label, value, setter, placeholder, keyboard, secure, capitalize }) => (
            <View key={label}>
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
                {label}
              </Text>
              <TextInput
                value={value}
                onChangeText={setter}
                placeholder={placeholder}
                keyboardType={keyboard}
                autoCapitalize={capitalize}
                secureTextEntry={secure}
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
          ))}

          {/* Language selector */}
          <View>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '600',
                color: COLORS.charcoal,
                marginBottom: 8,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              Preferred Language
            </Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  onPress={() => setLanguage(lang.code)}
                  style={{
                    flex: 1,
                    padding: 10,
                    borderRadius: 8,
                    alignItems: 'center',
                    backgroundColor: language === lang.code ? COLORS.saffron : '#fff',
                    borderWidth: 1,
                    borderColor: language === lang.code ? COLORS.saffron : '#E5E5E5',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '600',
                      color: language === lang.code ? '#fff' : COLORS.charcoal,
                    }}
                  >
                    {lang.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {error ? (
            <View style={{ backgroundColor: '#FEE2E2', borderRadius: 8, padding: 12 }}>
              <Text style={{ color: '#B91C1C', fontSize: 13 }}>{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            onPress={handleSignup}
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
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Create Account</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
            style={{ alignItems: 'center', paddingVertical: 12 }}
          >
            <Text style={{ color: COLORS.charcoal, fontSize: 14 }}>
              Already have an account?{' '}
              <Text style={{ color: COLORS.saffron, fontWeight: '700' }}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
