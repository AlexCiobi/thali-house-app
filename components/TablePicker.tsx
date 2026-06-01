import { View, Text, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../lib/colors';

const OCCUPIED = [3, 7, 12];

export function TablePicker({ selected, onSelect }: { selected: number | null; onSelect: (n: number | null) => void }) {
  return (
    <View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => {
          const occupied = OCCUPIED.includes(n);
          const isSelected = selected === n;
          return (
            <Pressable
              key={n}
              disabled={occupied}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onSelect(isSelected ? null : n); }}
              style={{ width: '18%', aspectRatio: 1, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
                backgroundColor: occupied ? '#FEE2E2' : isSelected ? COLORS.saffron : '#F0FDF4',
                borderWidth: 1, borderColor: occupied ? '#FECACA' : isSelected ? COLORS.saffron : '#BBF7D0' }}
            >
              <Text style={{ fontSize: 11, fontFamily: 'Inter_700Bold', color: occupied ? COLORS.red + '80' : isSelected ? 'white' : COLORS.green }}>
                T{n}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={{ flexDirection: 'row', gap: 16, marginTop: 10 }}>
        {[{ color: '#F0FDF4', border: '#BBF7D0', textColor: COLORS.green, label: 'Available' },
          { color: '#FEE2E2', border: '#FECACA', textColor: COLORS.red, label: 'Occupied' },
          { color: COLORS.saffron, border: COLORS.saffron, textColor: 'white', label: 'Selected' }].map((s) => (
          <View key={s.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <View style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: s.color, borderWidth: 1, borderColor: s.border }} />
            <Text style={{ fontSize: 11, color: COLORS.charcoal + '70' }}>{s.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
