import { useEffect, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useAuth } from '../../context/AuthContext'
import { useUserStore } from '../../store/userStore'
import { supabase } from '../../lib/supabase'
import { COLORS } from '../../lib/colors'
import type { Language } from '../../lib/menuData'

interface OrderRecord {
  id: string
  order_number: string
  total: number
  order_status: string
  order_type: string
  created_at: string
}

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'mr', label: 'MR' },
  { code: 'hi', label: 'HI' },
  { code: 'kn', label: 'KN' },
]

export default function AccountScreen() {
  const { session, profile, signOut } = useAuth()
  const { name, phone, language, setLanguage, toggleDarkMode, darkMode } = useUserStore()
  const [orders, setOrders] = useState<OrderRecord[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)

  const displayName = profile?.full_name ?? name ?? 'Guest'
  const displayEmail = profile?.email ?? ''
  const displayPhone = profile?.whatsapp_number ?? phone ?? ''

  useEffect(() => {
    if (session && displayPhone) fetchOrders()
  }, [session, displayPhone])

  async function fetchOrders() {
    setLoadingOrders(true)
    try {
      const { data } = await supabase
        .from('orders')
        .select('id, order_number, total, order_status, order_type, created_at')
        .eq('whatsapp_number', displayPhone.startsWith('+91') ? displayPhone : `+91${displayPhone}`)
        .order('created_at', { ascending: false })
        .limit(10)
      setOrders(data ?? [])
    } catch {
      // fail silently
    } finally {
      setLoadingOrders(false)
    }
  }

  function handleSignOut() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => signOut() },
    ])
  }

  const whatsappNumber = process.env.EXPO_PUBLIC_WHATSAPP_NUMBER ?? '919XXXXXXXXX'

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cream }}>
      <ScrollView
        contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{ fontSize: 28, fontFamily: 'PlayfairDisplay_700Bold', color: COLORS.charcoal }}
        >
          Account
        </Text>

        {/* User card */}
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 20,
            padding: 24,
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: COLORS.saffron,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 30, color: '#fff', fontWeight: '700' }}>
              {displayName[0]?.toUpperCase() ?? '?'}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'PlayfairDisplay_700Bold',
              color: COLORS.charcoal,
              marginTop: 12,
            }}
          >
            {displayName}
          </Text>
          {displayEmail ? (
            <Text style={{ color: '#888', marginTop: 2, fontSize: 13 }}>{displayEmail}</Text>
          ) : null}
          {displayPhone ? (
            <Text style={{ color: '#888', marginTop: 2, fontSize: 13 }}>{displayPhone}</Text>
          ) : null}

          {profile && (
            <View
              style={{
                flexDirection: 'row',
                gap: 32,
                marginTop: 20,
                paddingTop: 16,
                borderTopWidth: 1,
                borderTopColor: '#F0EDE8',
                alignSelf: 'stretch',
                justifyContent: 'center',
              }}
            >
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 22, fontWeight: '700', color: COLORS.saffron }}>
                  {profile.total_orders}
                </Text>
                <Text style={{ fontSize: 12, color: '#888' }}>Orders</Text>
              </View>
              <View style={{ width: 1, backgroundColor: '#F0EDE8' }} />
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 22, fontWeight: '700', color: COLORS.saffron }}>
                  {profile.loyalty_points}
                </Text>
                <Text style={{ fontSize: 12, color: '#888' }}>Points</Text>
              </View>
            </View>
          )}

          {!session && (
            <View
              style={{ flexDirection: 'row', gap: 10, marginTop: 20, alignSelf: 'stretch' }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: COLORS.saffron,
                  borderRadius: 10,
                  padding: 14,
                  alignItems: 'center',
                }}
                onPress={() => router.push('/(auth)/login')}
              >
                <Text style={{ color: '#fff', fontWeight: '700' }}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  borderRadius: 10,
                  padding: 14,
                  alignItems: 'center',
                  borderWidth: 1.5,
                  borderColor: COLORS.saffron,
                }}
                onPress={() => router.push('/(auth)/signup')}
              >
                <Text style={{ color: COLORS.saffron, fontWeight: '700' }}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Order history */}
        <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16 }}>
          <Text
            style={{
              fontWeight: '700',
              fontSize: 16,
              color: COLORS.charcoal,
              marginBottom: 12,
            }}
          >
            Order History
          </Text>
          {!session ? (
            <Text style={{ color: '#888', textAlign: 'center', paddingVertical: 16, fontSize: 13 }}>
              Sign in to view your order history
            </Text>
          ) : loadingOrders ? (
            <ActivityIndicator color={COLORS.saffron} style={{ paddingVertical: 16 }} />
          ) : orders.length === 0 ? (
            <Text style={{ color: '#888', textAlign: 'center', paddingVertical: 16, fontSize: 13 }}>
              No orders yet
            </Text>
          ) : (
            orders.map((order) => (
              <View
                key={order.id}
                style={{
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: '#F0EDE8',
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <View>
                    <Text style={{ fontWeight: '700', color: COLORS.charcoal }}>
                      {order.order_number}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                      {order.order_type} ·{' '}
                      {new Date(order.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontWeight: '700', color: COLORS.saffron }}>
                      ₹{order.total}
                    </Text>
                    <View
                      style={{
                        backgroundColor:
                          order.order_status === 'delivered' ? '#D1FAE5' : '#FEF3C7',
                        borderRadius: 8,
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        marginTop: 4,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: '700',
                          color:
                            order.order_status === 'delivered' ? '#065F46' : '#92400E',
                        }}
                      >
                        {order.order_status?.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Settings */}
        <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16 }}>
          <Text
            style={{
              fontWeight: '700',
              fontSize: 16,
              color: COLORS.charcoal,
              marginBottom: 16,
            }}
          >
            Settings
          </Text>

          {/* Language */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 13, color: '#888', marginBottom: 10 }}>Language</Text>
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
                    backgroundColor: language === lang.code ? COLORS.saffron : '#F5F5F5',
                    borderWidth: 1,
                    borderColor: language === lang.code ? COLORS.saffron : '#E5E5E5',
                  }}
                >
                  <Text
                    style={{
                      fontWeight: '700',
                      fontSize: 12,
                      color: language === lang.code ? '#fff' : COLORS.charcoal,
                    }}
                  >
                    {lang.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Dark mode */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: COLORS.charcoal, fontSize: 15 }}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#E5E5E5', true: COLORS.saffron }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Restaurant info */}
        <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16 }}>
          <Text
            style={{
              fontWeight: '700',
              fontSize: 16,
              color: COLORS.charcoal,
              marginBottom: 4,
            }}
          >
            Restaurant Info
          </Text>
          {[
            {
              icon: '📍',
              label: 'Address',
              value: '123 MG Road, Bengaluru',
              action: () => Linking.openURL('https://maps.google.com/?q=Thali+House+Bengaluru'),
            },
            {
              icon: '🕐',
              label: 'Hours',
              value: '11:00 AM – 11:00 PM',
              action: null,
            },
            {
              icon: '📞',
              label: 'Call Us',
              value: '+91 9XXXXXXXXX',
              action: () => Linking.openURL('tel:+919XXXXXXXXX'),
            },
            {
              icon: '💬',
              label: 'WhatsApp',
              value: 'Chat with us',
              action: () => Linking.openURL(`https://wa.me/${whatsappNumber}`),
            },
            {
              icon: '📋',
              label: 'Contact Page',
              value: 'View full contact info',
              action: () => router.push('/contact'),
            },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              onPress={item.action ?? undefined}
              disabled={!item.action}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: '#F0EDE8',
              }}
            >
              <Text style={{ fontSize: 18 }}>{item.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 11, color: '#888' }}>{item.label}</Text>
                <Text style={{ fontWeight: '600', color: COLORS.charcoal, fontSize: 14 }}>
                  {item.value}
                </Text>
              </View>
              {item.action && (
                <Text style={{ color: '#CCC', fontSize: 18 }}>›</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign out */}
        {session && (
          <TouchableOpacity
            onPress={handleSignOut}
            style={{
              backgroundColor: '#FEE2E2',
              borderRadius: 12,
              padding: 16,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#B91C1C', fontWeight: '700', fontSize: 15 }}>Sign Out</Text>
          </TouchableOpacity>
        )}

        <Text style={{ textAlign: 'center', color: '#CCC', fontSize: 12 }}>
          Thali House v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}
