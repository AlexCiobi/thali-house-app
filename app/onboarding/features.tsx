import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { COLORS } from '../../lib/colors';

const FEATURES = [
  { icon: '🍽️', title: 'Order Online', desc: 'Browse our full menu and order for dine-in, takeaway, or pre-order' },
  { icon: '📅', title: 'Reserve Tables', desc: 'Book your favourite table in seconds' },
  { icon: '🎁', title: 'Exclusive Offers', desc: 'Get daily deals and loyalty rewards' },
];

export default function OnboardingFeatures() {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.cream, padding: 28, justifyContent: 'center' }}>
      <Text style={{ fontSize: 28, fontFamily: 'PlayfairDisplay_700Bold', color: COLORS.charcoal, marginBottom: 8, textAlign: 'center' }}>
        Why Thali House?
      </Text>
      <Text style={{ color: COLORS.charcoal + '80', textAlign: 'center', marginBottom: 40, fontSize: 15 }}>
        Ichalkaranji's most loved thali restaurant
      </Text>

      {FEATURES.map((f, i) => (
        <Animated.View
          key={f.title}
          entering={FadeInDown.delay(i * 120).springify()}
          style={{ flexDirection: 'row', gap: 16, marginBottom: 24, backgroundColor: 'white', padding: 18, borderRadius: 16 }}
        >
          <Text style={{ fontSize: 32 }}>{f.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontFamily: 'Inter_700Bold', color: COLORS.charcoal, marginBottom: 4 }}>{f.title}</Text>
            <Text style={{ fontSize: 13, color: COLORS.charcoal + '70', lineHeight: 20 }}>{f.desc}</Text>
          </View>
        </Animated.View>
      ))}

      <Pressable
        onPress={() => router.push('/onboarding/setup')}
        style={{ backgroundColor: COLORS.saffron, padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 8 }}
      >
        <Text style={{ color: 'white', fontSize: 16, fontFamily: 'Inter_700Bold' }}>Continue</Text>
      </Pressable>
    </View>
  );
}
