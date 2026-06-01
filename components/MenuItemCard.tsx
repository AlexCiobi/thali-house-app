import { View, Text, Image, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useCartStore } from '../store/cartStore';
import { useUserStore } from '../store/userStore';
import { getItemName, getItemDescription, type MenuItem } from '../lib/menuData';
import { COLORS } from '../lib/colors';

export function MenuItemCard({ item }: { item: MenuItem }) {
  const { language } = useUserStore();
  const { addItem, updateQty, items } = useCartStore();
  const qty = items.find((ci) => ci.item.id === item.id)?.quantity ?? 0;
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  function handleAdd() {
    scale.value = withSpring(0.92, { damping: 8 }, () => { scale.value = withSpring(1); });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addItem(item);
  }

  return (
    <Animated.View style={[animStyle, { backgroundColor: 'white', borderRadius: 16, marginBottom: 12, flexDirection: 'row', overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 }]}>
      <Image source={{ uri: item.image_url }} style={{ width: 90, height: 90 }} resizeMode="cover" />
      <View style={{ flex: 1, padding: 12, justifyContent: 'space-between' }}>
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <View style={{ width: 12, height: 12, borderRadius: 2, borderWidth: 1.5, borderColor: item.is_veg ? COLORS.green : COLORS.red, alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: item.is_veg ? COLORS.green : COLORS.red }} />
            </View>
            <Text style={{ fontSize: 13, fontFamily: 'Inter_600SemiBold', color: COLORS.charcoal, flex: 1 }} numberOfLines={2}>
              {getItemName(item, language)}
            </Text>
          </View>
          <Text style={{ fontSize: 11, color: COLORS.charcoal + '60', lineHeight: 16 }} numberOfLines={2}>
            {getItemDescription(item, language)}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
          <Text style={{ fontSize: 18, fontFamily: 'PlayfairDisplay_700Bold', color: COLORS.saffron }}>₹{item.price}</Text>
          {qty === 0 ? (
            <Pressable onPress={handleAdd} style={{ backgroundColor: COLORS.saffron + '18', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: COLORS.saffron + '40' }}>
              <Text style={{ color: COLORS.saffron, fontSize: 13, fontFamily: 'Inter_700Bold' }}>Add</Text>
            </Pressable>
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Pressable onPress={() => { updateQty(item.id, -1); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.saffron + '20', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: COLORS.saffron, fontSize: 18, lineHeight: 20 }}>−</Text>
              </Pressable>
              <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 15, color: COLORS.charcoal, minWidth: 16, textAlign: 'center' }}>{qty}</Text>
              <Pressable onPress={() => { addItem(item); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.saffron, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: 'white', fontSize: 18, lineHeight: 20 }}>+</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  );
}
