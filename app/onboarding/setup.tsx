import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useUserStore } from '../../store/userStore';
import { supabase } from '../../lib/supabase';
import { COLORS } from '../../lib/colors';
import type { Language } from '../../lib/menuData';

const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: 'mr', label: 'MR', native: 'मराठी' },
  { code: 'en', label: 'EN', native: 'English' },
];

export default function OnboardingSetup() {
  const { setName, setPhone, setLanguage, setHasOnboarded, language } = useUserStore();
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [selectedLang, setSelectedLang] = useState<Language>(language);
  const [loading, setLoading] = useState(false);

  async function handleDone() {
    if (!nameInput.trim()) { Alert.alert('Name required'); return; }
    if (phoneInput.replace(/\D/g, '').length < 10) { Alert.alert('Valid phone required'); return; }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setLoading(true);
    setName(nameInput.trim());
    setPhone(phoneInput.trim());
    setLanguage(selectedLang);
    try {
      await supabase.from('users').upsert({
        name: nameInput.trim(),
        phone: '+91' + phoneInput.replace(/\D/g, ''),
        language_preference: selectedLang,
      }, { onConflict: 'phone' });
    } catch { /* ignore */ }
    setHasOnboarded(true);
    setLoading(false);
    router.replace('/(tabs)/menu');
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.cream }} contentContainerStyle={{ padding: 28, paddingTop: 60 }}>
      <Text style={{ fontSize: 28, fontFamily: 'PlayfairDisplay_700Bold', color: COLORS.charcoal, marginBottom: 6 }}>
        Let's get started
      </Text>
      <Text style={{ color: COLORS.charcoal + '70', marginBottom: 32, fontSize: 15 }}>Tell us a bit about yourself</Text>

      <Text style={{ fontSize: 14, fontFamily: 'Inter_600SemiBold', color: COLORS.charcoal, marginBottom: 10 }}>Choose Language</Text>
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 28 }}>
        {LANGUAGES.map((l) => (
          <Pressable
            key={l.code}
            onPress={() => { setSelectedLang(l.code); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
            style={{ flex: 1, padding: 12, borderRadius: 12, alignItems: 'center',
              backgroundColor: selectedLang === l.code ? COLORS.saffron : 'white',
              borderWidth: 2, borderColor: selectedLang === l.code ? COLORS.saffron : COLORS.offwhite }}
          >
            <Text style={{ fontSize: 11, fontFamily: 'Inter_700Bold', color: selectedLang === l.code ? 'white' : COLORS.charcoal + '60' }}>{l.label}</Text>
            <Text style={{ fontSize: 12, color: selectedLang === l.code ? 'white' : COLORS.charcoal, marginTop: 2 }}>{l.native}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={{ fontSize: 14, fontFamily: 'Inter_600SemiBold', color: COLORS.charcoal, marginBottom: 8 }}>Your Name</Text>
      <TextInput
        value={nameInput} onChangeText={setNameInput}
        placeholder="Full name"
        style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, fontSize: 15, marginBottom: 20, borderWidth: 1, borderColor: COLORS.offwhite }}
      />

      <Text style={{ fontSize: 14, fontFamily: 'Inter_600SemiBold', color: COLORS.charcoal, marginBottom: 8 }}>WhatsApp Number</Text>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 40 }}>
        <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: COLORS.offwhite }}>
          <Text style={{ fontSize: 15, color: COLORS.charcoal + '80' }}>+91</Text>
        </View>
        <TextInput
          value={phoneInput} onChangeText={setPhoneInput}
          placeholder="88883 77788" keyboardType="phone-pad"
          style={{ flex: 1, backgroundColor: 'white', borderRadius: 12, padding: 16, fontSize: 15, borderWidth: 1, borderColor: COLORS.offwhite }}
        />
      </View>

      <Pressable
        onPress={handleDone}
        disabled={loading}
        style={{ backgroundColor: loading ? COLORS.saffron + '80' : COLORS.saffron, padding: 18, borderRadius: 16, alignItems: 'center' }}
      >
        <Text style={{ color: 'white', fontSize: 16, fontFamily: 'Inter_700Bold' }}>
          {loading ? 'Saving...' : 'Start Ordering →'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}
