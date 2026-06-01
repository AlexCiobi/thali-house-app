import { View, Text, ScrollView, Pressable, Switch, Linking, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useUserStore } from '../../store/userStore';
import { t } from '../../lib/translations';
import { COLORS } from '../../lib/colors';

function SettingRow({ icon, label, value, onPress, right }: { icon: string; label: string; value?: string; onPress?: () => void; right?: React.ReactNode }) {
  return (
    <Pressable onPress={onPress}
      style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.offwhite }}>
      <Text style={{ fontSize: 20, width: 32 }}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: COLORS.charcoal }}>{label}</Text>
        {value && <Text style={{ fontSize: 12, color: COLORS.charcoal + '60', marginTop: 2 }}>{value}</Text>}
      </View>
      {right ?? <Text style={{ color: COLORS.charcoal + '40', fontSize: 18 }}>›</Text>}
    </Pressable>
  );
}

export default function ProfileTab() {
  const insets = useSafeAreaInsets();
  const { name, phone, language, orderHistory, darkMode, toggleDarkMode } = useUserStore();
  const initials = name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.offwhite }} contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 40 }}>
      {/* Avatar header */}
      <View style={{ alignItems: 'center', paddingVertical: 28, backgroundColor: COLORS.charcoal, marginBottom: 16 }}>
        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.saffron, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
          <Text style={{ color: 'white', fontSize: 28, fontFamily: 'PlayfairDisplay_700Bold' }}>{initials}</Text>
        </View>
        <Text style={{ color: 'white', fontSize: 20, fontFamily: 'PlayfairDisplay_700Bold' }}>{name || 'Guest'}</Text>
        <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 4 }}>+91 {phone}</Text>
      </View>

      {/* Order history */}
      <View style={{ backgroundColor: 'white', borderRadius: 16, marginHorizontal: 16, marginBottom: 12, overflow: 'hidden' }}>
        <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 13, color: COLORS.charcoal + '60', padding: 14, letterSpacing: 0.5 }}>RECENT ORDERS</Text>
        {orderHistory.length === 0 ? (
          <Text style={{ color: COLORS.charcoal + '50', fontSize: 13, padding: 14, paddingTop: 0 }}>No orders yet</Text>
        ) : orderHistory.slice(0, 3).map((order) => (
          <View key={order.orderNumber} style={{ padding: 14, borderTopWidth: 1, borderTopColor: COLORS.offwhite }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text style={{ fontFamily: 'Inter_700Bold', color: COLORS.saffron, fontSize: 13 }}>{order.orderNumber}</Text>
              <Text style={{ fontSize: 16, fontFamily: 'PlayfairDisplay_700Bold', color: COLORS.charcoal }}>₹{order.total}</Text>
            </View>
            <Text style={{ color: COLORS.charcoal + '60', fontSize: 12 }}>
              {order.items.length} item{order.items.length > 1 ? 's' : ''} · {new Date(order.date).toLocaleDateString()} · {order.type}
            </Text>
          </View>
        ))}
      </View>

      {/* Settings */}
      <View style={{ backgroundColor: 'white', borderRadius: 16, marginHorizontal: 16, marginBottom: 12, overflow: 'hidden' }}>
        <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 13, color: COLORS.charcoal + '60', padding: 14, letterSpacing: 0.5 }}>SETTINGS</Text>
        <SettingRow icon="🌐" label={t(language, 'language')} value={['Marathi', 'Hindi', 'English', 'Kannada'][['mr','hi','en','kn'].indexOf(language)]} onPress={() => router.push('/onboarding/setup')} />
        <SettingRow icon="🌙" label={t(language, 'darkMode')} right={<Switch value={darkMode} onValueChange={toggleDarkMode} trackColor={{ true: COLORS.saffron }} />} />
      </View>

      {/* About */}
      <View style={{ backgroundColor: 'white', borderRadius: 16, marginHorizontal: 16, marginBottom: 12, overflow: 'hidden' }}>
        <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 13, color: COLORS.charcoal + '60', padding: 14, letterSpacing: 0.5 }}>THALI HOUSE</Text>
        <SettingRow icon="📍" label="Address" value="Bavaskar Building, RB Road, Ichalkaranji" onPress={() => Linking.openURL('https://maps.google.com/?q=Ichalkaranji')} />
        <SettingRow icon="⏰" label="Hours" value="11:00 AM – 11:00 PM, Every Day" />
        <SettingRow icon="📞" label={t(language, 'callUs')} value="+91 88883 77788" onPress={() => Linking.openURL('tel:+918888377788')} />
        <SettingRow icon="💬" label={t(language, 'whatsappUs')} value="Chat with us" onPress={() => Linking.openURL('https://wa.me/918888377788')} />
        <SettingRow icon="⭐" label="Rate the App" onPress={() => Alert.alert('Thank you!', 'Rating coming soon')} />
      </View>

      <Text style={{ textAlign: 'center', color: COLORS.charcoal + '40', fontSize: 12, marginTop: 8 }}>
        Thali House v1.0.0
      </Text>
    </ScrollView>
  );
}
