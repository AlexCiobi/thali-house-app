import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { COLORS } from '../lib/colors'

const CONTACTS = [
  {
    icon: '📞',
    label: 'Call Us',
    value: '+91 9XXXXXXXXX',
    action: () => Linking.openURL('tel:+919XXXXXXXXX'),
  },
  {
    icon: '💬',
    label: 'WhatsApp',
    value: 'Chat on WhatsApp',
    action: () =>
      Linking.openURL(
        `https://wa.me/${process.env.EXPO_PUBLIC_WHATSAPP_NUMBER ?? '919XXXXXXXXX'}`
      ),
  },
  {
    icon: '✉️',
    label: 'Email',
    value: 'hello@thalihouse.in',
    action: () => Linking.openURL('mailto:hello@thalihouse.in'),
  },
  {
    icon: '📍',
    label: 'Get Directions',
    value: '123 MG Road, Bengaluru',
    action: () => Linking.openURL('https://maps.google.com/?q=Thali+House+Bengaluru'),
  },
]

const HOURS = [
  { day: 'Monday – Friday', time: '11:00 AM – 11:00 PM' },
  { day: 'Saturday', time: '10:00 AM – 11:30 PM' },
  { day: 'Sunday', time: '10:00 AM – 11:00 PM' },
]

export default function ContactScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cream }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 16,
          backgroundColor: '#fff',
          borderBottomWidth: 1,
          borderBottomColor: '#F0EDE8',
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: COLORS.cream,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}
        >
          <Text style={{ fontSize: 18, color: COLORS.charcoal }}>←</Text>
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 20,
            fontFamily: 'PlayfairDisplay_700Bold',
            color: COLORS.charcoal,
          }}
        >
          Contact Us
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Contact buttons */}
        <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16 }}>
          <Text
            style={{
              fontWeight: '700',
              fontSize: 16,
              color: COLORS.charcoal,
              marginBottom: 4,
            }}
          >
            Get in Touch
          </Text>
          {CONTACTS.map((c) => (
            <TouchableOpacity
              key={c.label}
              onPress={c.action}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                paddingVertical: 14,
                borderBottomWidth: 1,
                borderBottomColor: '#F0EDE8',
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: COLORS.cream,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 20 }}>{c.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 11, color: '#888' }}>{c.label}</Text>
                <Text style={{ fontWeight: '600', color: COLORS.charcoal }}>{c.value}</Text>
              </View>
              <Text style={{ color: '#CCC', fontSize: 20 }}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Opening hours */}
        <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16 }}>
          <Text
            style={{
              fontWeight: '700',
              fontSize: 16,
              color: COLORS.charcoal,
              marginBottom: 12,
            }}
          >
            Opening Hours
          </Text>
          {HOURS.map((h) => (
            <View
              key={h.day}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#F0EDE8',
              }}
            >
              <Text style={{ color: '#666', fontSize: 14 }}>{h.day}</Text>
              <Text style={{ fontWeight: '600', color: COLORS.charcoal, fontSize: 14 }}>
                {h.time}
              </Text>
            </View>
          ))}
        </View>

        {/* Address */}
        <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16 }}>
          <Text
            style={{
              fontWeight: '700',
              fontSize: 16,
              color: COLORS.charcoal,
              marginBottom: 10,
            }}
          >
            Address
          </Text>
          <Text style={{ color: '#666', lineHeight: 22, fontSize: 14 }}>
            Thali House{'\n'}
            123 MG Road{'\n'}
            Bengaluru, Karnataka 560001{'\n'}
            India
          </Text>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://maps.google.com/?q=Thali+House+Bengaluru')}
            style={{
              marginTop: 14,
              backgroundColor: COLORS.saffron,
              borderRadius: 10,
              padding: 14,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>
              Open in Maps
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
