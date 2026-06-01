import { ScrollView, View, Text, Pressable, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUserStore } from '../../store/userStore';
import { menuData } from '../../lib/menuData';
import { t } from '../../lib/translations';
import { RestaurantStatus } from '../../components/RestaurantStatus';
import { MenuItemCard } from '../../components/MenuItemCard';
import { FloatingCartBar } from '../../components/FloatingCartBar';
import { COLORS } from '../../lib/colors';

const BESTSELLER_IDS = ['thali-009', 'thali-005', 'thali-002', 'main-007'];

const OFFERS = [
  { id: '1', bg: COLORS.saffron, title: '20% OFF', sub: 'All Thali orders today', emoji: '🔥' },
  { id: '2', bg: COLORS.maroon, title: '₹499 Deal', sub: 'Full meal for 2 · Mon–Fri', emoji: '🍽️' },
];

export default function HomeTab() {
  const { name, language } = useUserStore();
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();
  const bestsellers = BESTSELLER_IDS.map((id) => menuData.find((m) => m.id === id)!).filter(Boolean);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.offwhite }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.saffron} />}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {/* Header */}
        <View style={{ backgroundColor: COLORS.charcoal, paddingTop: insets.top + 16, paddingHorizontal: 20, paddingBottom: 28 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <View>
              <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{t(language, 'greeting')},</Text>
              <Text style={{ color: 'white', fontSize: 22, fontFamily: 'PlayfairDisplay_700Bold' }}>
                {name || 'Guest'} 👋
              </Text>
            </View>
            <RestaurantStatus />
          </View>
          {/* Offer cards */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }} contentContainerStyle={{ gap: 12, paddingRight: 4 }}>
            {OFFERS.map((offer, i) => (
              <Animated.View key={offer.id} entering={FadeInDown.delay(i * 100).springify()}
                style={{ width: 220, borderRadius: 16, padding: 18, backgroundColor: offer.bg }}>
                <Text style={{ fontSize: 28 }}>{offer.emoji}</Text>
                <Text style={{ color: 'white', fontSize: 22, fontFamily: 'PlayfairDisplay_700Bold', marginTop: 4 }}>{offer.title}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 2 }}>{offer.sub}</Text>
              </Animated.View>
            ))}
          </ScrollView>
        </View>

        {/* Quick actions */}
        <View style={{ flexDirection: 'row', gap: 12, margin: 16 }}>
          <Pressable onPress={() => router.push('/(tabs)/menu')}
            style={{ flex: 1, backgroundColor: COLORS.saffron, borderRadius: 14, padding: 16, alignItems: 'center', flexDirection: 'row', gap: 8 }}>
            <Text style={{ fontSize: 20 }}>🍽️</Text>
            <Text style={{ color: 'white', fontFamily: 'Inter_700Bold', fontSize: 14 }}>Order Now</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/(tabs)/reservations')}
            style={{ flex: 1, backgroundColor: COLORS.maroon, borderRadius: 14, padding: 16, alignItems: 'center', flexDirection: 'row', gap: 8 }}>
            <Text style={{ fontSize: 20 }}>📅</Text>
            <Text style={{ color: 'white', fontFamily: 'Inter_700Bold', fontSize: 14 }}>Reserve</Text>
          </Pressable>
        </View>

        {/* Bestsellers */}
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={{ fontSize: 20, fontFamily: 'PlayfairDisplay_700Bold', color: COLORS.charcoal, marginBottom: 14 }}>
            ⭐ Bestsellers
          </Text>
          {bestsellers.map((item, i) => (
            <Animated.View key={item.id} entering={FadeInDown.delay(i * 80).springify()}>
              <MenuItemCard item={item} />
            </Animated.View>
          ))}
          <Pressable onPress={() => router.push('/(tabs)/menu')}
            style={{ backgroundColor: COLORS.saffron + '15', borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 4 }}>
            <Text style={{ color: COLORS.saffron, fontFamily: 'Inter_700Bold' }}>View Full Menu →</Text>
          </Pressable>
        </View>
      </ScrollView>

      <FloatingCartBar />
    </View>
  );
}
