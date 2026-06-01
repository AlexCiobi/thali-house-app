import { View, Text } from 'react-native';
import { COLORS } from '../lib/colors';

function isOpen(): boolean {
  const h = new Date().getHours(), m = new Date().getMinutes();
  return h * 60 + m >= 660 && h * 60 + m < 1380; // 11am–11pm
}

export function RestaurantStatus() {
  const open = isOpen();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: open ? '#16A34A18' : '#DC262618', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
      <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: open ? COLORS.green : COLORS.red }} />
      <Text style={{ fontSize: 12, fontFamily: 'Inter_600SemiBold', color: open ? COLORS.green : COLORS.red }}>
        {open ? 'Open · 11AM–11PM' : 'Closed'}
      </Text>
    </View>
  );
}
