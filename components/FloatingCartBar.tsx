import { View, Text, Pressable } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useCartStore } from '../store/cartStore';
import { COLORS } from '../lib/colors';

export function FloatingCartBar() {
  const totalItems = useCartStore((s) => s.totalItems());
  const subtotal = useCartStore((s) => s.subtotal());

  if (totalItems === 0) return null;

  return (
    <Animated.View entering={FadeInDown.springify()} exiting={FadeOutDown.springify()}
      style={{ position: 'absolute', bottom: 80, left: 16, right: 16, backgroundColor: COLORS.saffron, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: COLORS.saffron, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8 }}>
      <View>
        <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11 }}>{totalItems} item{totalItems > 1 ? 's' : ''} added</Text>
        <Text style={{ color: 'white', fontSize: 18, fontFamily: 'PlayfairDisplay_700Bold' }}>₹{subtotal}</Text>
      </View>
      <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push('/(tabs)/cart'); }}
        style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 }}>
        <Text style={{ color: 'white', fontFamily: 'Inter_700Bold', fontSize: 14 }}>View Cart →</Text>
      </Pressable>
    </Animated.View>
  );
}
