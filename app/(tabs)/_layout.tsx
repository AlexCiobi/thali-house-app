import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { COLORS } from '../../lib/colors';
import { useCartStore } from '../../store/cartStore';

function TabIcon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 22 }}>{emoji}</Text>
      <Text style={{ fontSize: 10, fontFamily: 'Inter_600SemiBold', color: focused ? COLORS.saffron : COLORS.charcoal + '80' }}>
        {label}
      </Text>
    </View>
  );
}

function CartTabIcon({ focused }: { focused: boolean }) {
  const totalItems = useCartStore((s) => s.totalItems());
  return (
    <View style={{ alignItems: 'center' }}>
      <View>
        <Text style={{ fontSize: 22 }}>🛒</Text>
        {totalItems > 0 && (
          <View style={{ position: 'absolute', top: -4, right: -8, backgroundColor: COLORS.saffron, borderRadius: 8, width: 16, height: 16, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 9, color: 'white', fontFamily: 'Inter_700Bold' }}>{totalItems}</Text>
          </View>
        )}
      </View>
      <Text style={{ fontSize: 10, fontFamily: 'Inter_600SemiBold', color: focused ? COLORS.saffron : COLORS.charcoal + '80' }}>
        Cart
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.offwhite,
          height: 72,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: COLORS.saffron,
        tabBarInactiveTintColor: COLORS.charcoal + '60',
      }}
    >
      <Tabs.Screen name="index" options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" label="Home" focused={focused} /> }} />
      <Tabs.Screen name="menu" options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🍽️" label="Menu" focused={focused} /> }} />
      <Tabs.Screen name="cart" options={{ tabBarIcon: ({ focused }) => <CartTabIcon focused={focused} /> }} />
      <Tabs.Screen name="reservations" options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="📅" label="Book" focused={focused} /> }} />
      <Tabs.Screen name="profile" options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="👤" label="Profile" focused={focused} /> }} />
    </Tabs>
  );
}
