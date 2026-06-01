import { useState, useMemo } from 'react';
import { View, Text, TextInput, Pressable, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MenuItemCard } from '../../components/MenuItemCard';
import { FloatingCartBar } from '../../components/FloatingCartBar';
import { menuData, type MenuItem } from '../../lib/menuData';
import { useUserStore } from '../../store/userStore';
import { t } from '../../lib/translations';
import { COLORS } from '../../lib/colors';
import type { Language } from '../../lib/menuData';

type Category = 'ALL' | 'THALI' | 'STARTERS' | 'MAIN_COURSE' | 'BREADS' | 'RICE' | 'BEVERAGES' | 'SNACKS';
type VegFilter = 'all' | 'veg' | 'nonveg';

const CATS: { id: Category; emoji: string; label: string }[] = [
  { id: 'ALL', emoji: '🍱', label: 'All' },
  { id: 'THALI', emoji: '🍛', label: 'Thali' },
  { id: 'STARTERS', emoji: '🥘', label: 'Starters' },
  { id: 'MAIN_COURSE', emoji: '🍖', label: 'Mains' },
  { id: 'BREADS', emoji: '🫓', label: 'Breads' },
  { id: 'RICE', emoji: '🍚', label: 'Rice' },
  { id: 'BEVERAGES', emoji: '🥛', label: 'Drinks' },
  { id: 'SNACKS', emoji: '🥜', label: 'Snacks' },
];

export default function MenuTab() {
  const { language } = useUserStore();
  const [activeCategory, setActiveCategory] = useState<Category>('ALL');
  const [vegFilter, setVegFilter] = useState<VegFilter>('all');
  const [search, setSearch] = useState('');
  const insets = useSafeAreaInsets();

  const filtered = useMemo(() => menuData.filter((item) => {
    if (activeCategory !== 'ALL' && item.category !== activeCategory) return false;
    if (vegFilter === 'veg' && !item.is_veg) return false;
    if (vegFilter === 'nonveg' && item.is_veg) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const localName = item[`name_${language}` as `name_${Language}`] ?? item.name_en;
      if (!item.name_en.toLowerCase().includes(q) && !localName.toLowerCase().includes(q)) return false;
    }
    return true;
  }), [activeCategory, vegFilter, search, language]);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.offwhite }}>
      {/* Sticky header */}
      <View style={{ backgroundColor: 'white', paddingTop: insets.top + 12, paddingBottom: 8, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
        {/* Search */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 10, backgroundColor: COLORS.offwhite, borderRadius: 12, paddingHorizontal: 14, gap: 8 }}>
          <Text style={{ fontSize: 16 }}>🔍</Text>
          <TextInput
            value={search} onChangeText={setSearch}
            placeholder={t(language, 'searchPlaceholder')}
            style={{ flex: 1, paddingVertical: 12, fontSize: 14, color: COLORS.charcoal }}
            placeholderTextColor={COLORS.charcoal + '50'}
          />
        </View>

        {/* Category tabs */}
        <FlatList
          data={CATS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(cat) => cat.id}
          contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}
          renderItem={({ item: cat }) => (
            <Pressable
              onPress={() => setActiveCategory(cat.id)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
                backgroundColor: activeCategory === cat.id ? COLORS.saffron : COLORS.offwhite }}
            >
              <Text style={{ fontSize: 14 }}>{cat.emoji}</Text>
              <Text style={{ fontSize: 12, fontFamily: 'Inter_600SemiBold', color: activeCategory === cat.id ? 'white' : COLORS.charcoal + '80' }}>
                {cat.label}
              </Text>
            </Pressable>
          )}
        />

        {/* Veg filter */}
        <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingTop: 8 }}>
          {(['all', 'veg', 'nonveg'] as VegFilter[]).map((f) => (
            <Pressable key={f} onPress={() => setVegFilter(f)}
              style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16,
                backgroundColor: vegFilter === f ? (f === 'veg' ? COLORS.green : f === 'nonveg' ? COLORS.red : COLORS.charcoal) : COLORS.offwhite }}>
              <Text style={{ fontSize: 12, fontFamily: 'Inter_600SemiBold', color: vegFilter === f ? 'white' : COLORS.charcoal + '70' }}>
                {f === 'all' ? t(language, 'allItems') : f === 'veg' ? t(language, 'vegOnly') : t(language, 'nonVegOnly')}
              </Text>
            </Pressable>
          ))}
          <Text style={{ marginLeft: 'auto', fontSize: 12, color: COLORS.charcoal + '50', alignSelf: 'center' }}>
            {filtered.length} items
          </Text>
        </View>
      </View>

      {/* Items list */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MenuItemCard item={item} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingTop: 60 }}>
            <Text style={{ fontSize: 40 }}>🍽️</Text>
            <Text style={{ fontSize: 16, fontFamily: 'PlayfairDisplay_700Bold', color: COLORS.charcoal, marginTop: 12 }}>No items found</Text>
          </View>
        }
      />

      <FloatingCartBar />
    </View>
  );
}
