import { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withDelay, withTiming } from 'react-native-reanimated';
import { COLORS } from '../../lib/colors';

export default function OnboardingStep1() {
  const logoScale = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textY = useSharedValue(30);

  useEffect(() => {
    logoScale.value = withSpring(1, { damping: 12, stiffness: 100 });
    textOpacity.value = withDelay(600, withTiming(1, { duration: 600 }));
    textY.value = withDelay(600, withSpring(0, { damping: 14 }));
  }, []);

  const logoStyle = useAnimatedStyle(() => ({ transform: [{ scale: logoScale.value }] }));
  const textStyle = useAnimatedStyle(() => ({ opacity: textOpacity.value, transform: [{ translateY: textY.value }] }));

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.charcoal, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <Animated.View style={[logoStyle, { width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.saffron, alignItems: 'center', justifyContent: 'center', marginBottom: 24 }]}>
        <Text style={{ color: 'white', fontSize: 32, fontFamily: 'PlayfairDisplay_700Bold' }}>TH</Text>
      </Animated.View>

      <Animated.View style={textStyle}>
        <Text style={{ color: 'white', fontSize: 32, fontFamily: 'PlayfairDisplay_700Bold', textAlign: 'center', marginBottom: 12 }}>
          Thali <Text style={{ color: COLORS.saffron }}>House</Text>
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, textAlign: 'center', lineHeight: 24 }}>
          The Real Taste of Maharashtra
        </Text>
      </Animated.View>

      <Pressable
        onPress={() => router.push('/onboarding/features')}
        style={{ position: 'absolute', bottom: 60, backgroundColor: COLORS.saffron, paddingHorizontal: 40, paddingVertical: 16, borderRadius: 50 }}
      >
        <Text style={{ color: 'white', fontSize: 16, fontFamily: 'Inter_700Bold' }}>Get Started</Text>
      </Pressable>

      <Pressable onPress={() => router.push('/onboarding/setup')} style={{ position: 'absolute', bottom: 24 }}>
        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Skip</Text>
      </Pressable>
    </View>
  );
}
