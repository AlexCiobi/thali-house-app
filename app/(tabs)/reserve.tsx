import { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert, Modal } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useReservationStore } from '../../store/reservationStore';
import { useUserStore } from '../../store/userStore';
import { supabase } from '../../lib/supabase';
import { TablePicker } from '../../components/TablePicker';
import { t } from '../../lib/translations';
import { COLORS } from '../../lib/colors';

type Occasion = 'none' | 'birthday' | 'anniversary' | 'business' | 'other';
const OCCASIONS: { id: Occasion; emoji: string; label: string }[] = [
  { id: 'none', emoji: '🍽️', label: 'Normal' },
  { id: 'birthday', emoji: '🎂', label: 'Birthday' },
  { id: 'anniversary', emoji: '💑', label: 'Anniversary' },
  { id: 'business', emoji: '💼', label: 'Business' },
  { id: 'other', emoji: '✨', label: 'Other' },
];

function getTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 11; h <= 22; h++) {
    for (const m of [0, 30]) {
      if (h === 22 && m === 30) continue;
      const h12 = h > 12 ? h - 12 : h;
      slots.push(`${h12}:${m === 0 ? '00' : '30'} ${h < 12 ? 'AM' : 'PM'}`);
    }
  }
  return slots;
}

export default function ReservationsTab() {
  const insets = useSafeAreaInsets();
  const { reservations, addReservation, cancelReservation } = useReservationStore();
  const { name, phone, language } = useUserStore();
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [occasion, setOccasion] = useState<Occasion>('none');
  const [preferredTable, setPreferredTable] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleConfirm() {
    if (!date || !time) { Alert.alert('Date and time required'); return; }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSubmitting(true);
    const ref = `TH-RES-${Math.floor(10000 + Math.random() * 90000)}`;
    try {
      await supabase.from('reservations').insert({
        booking_ref: ref, customer_name: name,
        whatsapp_number: '+91' + phone.replace(/\D/g, ''),
        date, time, guest_count: guests, occasion,
        preferred_table: preferredTable, status: 'pending',
      });
    } catch { /* ignore */ }
    addReservation({ bookingRef: ref, date, time, guestCount: guests, occasion, preferredTable, status: 'pending', createdAt: new Date().toISOString() });
    setSubmitting(false);
    setShowModal(false);
    setStep(1);
    setDate(''); setTime(''); setGuests(2); setOccasion('none'); setPreferredTable(null);
    Alert.alert('Reservation Confirmed!', `Ref: ${ref}\n${date} at ${time} for ${guests} guests`);
  }

  const upcoming = reservations.filter((r) => r.status !== 'cancelled' && new Date(r.date) >= new Date());
  const past = reservations.filter((r) => r.status === 'cancelled' || new Date(r.date) < new Date());

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.offwhite }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: insets.top + 16, paddingBottom: 60 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <Text style={{ fontSize: 24, fontFamily: 'PlayfairDisplay_700Bold', color: COLORS.charcoal }}>
            {t(language, 'myReservations')}
          </Text>
          <Pressable onPress={() => { setShowModal(true); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }}
            style={{ backgroundColor: COLORS.saffron, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10 }}>
            <Text style={{ color: 'white', fontFamily: 'Inter_700Bold', fontSize: 13 }}>+ New</Text>
          </Pressable>
        </View>

        {reservations.length === 0 ? (
          <View style={{ alignItems: 'center', paddingTop: 60 }}>
            <Text style={{ fontSize: 50 }}>📅</Text>
            <Text style={{ fontSize: 18, fontFamily: 'PlayfairDisplay_700Bold', color: COLORS.charcoal, marginTop: 12, marginBottom: 6 }}>No reservations yet</Text>
            <Text style={{ color: COLORS.charcoal + '60', textAlign: 'center', marginBottom: 24 }}>Book your table now and we'll have it ready for you</Text>
            <Pressable onPress={() => setShowModal(true)}
              style={{ backgroundColor: COLORS.saffron, borderRadius: 14, paddingHorizontal: 28, paddingVertical: 14 }}>
              <Text style={{ color: 'white', fontFamily: 'Inter_700Bold' }}>Reserve a Table</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {upcoming.length > 0 && <Text style={{ fontFamily: 'Inter_600SemiBold', color: COLORS.charcoal + '60', fontSize: 12, marginBottom: 10, letterSpacing: 1 }}>UPCOMING</Text>}
            {upcoming.map((r, i) => (
              <Animated.View key={r.bookingRef} entering={FadeInDown.delay(i * 80).springify()}
                style={{ backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: COLORS.saffron }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ fontFamily: 'Inter_700Bold', color: COLORS.saffron, fontSize: 13 }}>{r.bookingRef}</Text>
                  <View style={{ backgroundColor: COLORS.saffron + '15', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
                    <Text style={{ fontSize: 11, color: COLORS.saffron, fontFamily: 'Inter_600SemiBold' }}>{r.status.toUpperCase()}</Text>
                  </View>
                </View>
                <Text style={{ fontSize: 16, fontFamily: 'PlayfairDisplay_700Bold', color: COLORS.charcoal, marginBottom: 4 }}>
                  {r.date} · {r.time}
                </Text>
                <Text style={{ color: COLORS.charcoal + '70', fontSize: 13 }}>{r.guestCount} guests · {r.occasion !== 'none' ? r.occasion : 'Regular visit'}</Text>
                {r.preferredTable && <Text style={{ color: COLORS.charcoal + '60', fontSize: 12, marginTop: 4 }}>Preferred: T{r.preferredTable}</Text>}
                <Pressable onPress={() => Alert.alert('Cancel?', 'Are you sure?', [{ text: 'Yes', onPress: () => cancelReservation(r.bookingRef), style: 'destructive' }, { text: 'No' }])}
                  style={{ marginTop: 10, alignSelf: 'flex-start' }}>
                  <Text style={{ color: COLORS.red, fontSize: 12, fontFamily: 'Inter_600SemiBold' }}>Cancel</Text>
                </Pressable>
              </Animated.View>
            ))}
            {past.length > 0 && (
              <>
                <Text style={{ fontFamily: 'Inter_600SemiBold', color: COLORS.charcoal + '60', fontSize: 12, marginBottom: 10, marginTop: 8, letterSpacing: 1 }}>PAST</Text>
                {past.slice(0, 3).map((r) => (
                  <View key={r.bookingRef} style={{ backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 10, opacity: 0.6 }}>
                    <Text style={{ fontFamily: 'Inter_700Bold', color: COLORS.charcoal + '60', fontSize: 12 }}>{r.bookingRef}</Text>
                    <Text style={{ fontSize: 14, color: COLORS.charcoal, marginTop: 4 }}>{r.date} · {r.time} · {r.guestCount} guests</Text>
                  </View>
                ))}
              </>
            )}
          </>
        )}
      </ScrollView>

      <Modal visible={showModal} animationType="slide" presentationStyle="pageSheet">
        <View style={{ flex: 1, backgroundColor: COLORS.offwhite }}>
          <View style={{ backgroundColor: 'white', padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 20, fontFamily: 'PlayfairDisplay_700Bold', color: COLORS.charcoal }}>New Reservation</Text>
            <Pressable onPress={() => setShowModal(false)}>
              <Text style={{ fontSize: 24, color: COLORS.charcoal + '60' }}>✕</Text>
            </Pressable>
          </View>

          <View style={{ flexDirection: 'row', padding: 16, gap: 6 }}>
            {[1, 2, 3].map((s) => (
              <View key={s} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: s <= step ? COLORS.saffron : COLORS.offwhite }} />
            ))}
          </View>

          <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
            {step === 1 && (
              <View>
                <Text style={{ fontFamily: 'Inter_600SemiBold', color: COLORS.charcoal, marginBottom: 8 }}>Date</Text>
                <TextInput value={date} onChangeText={setDate} placeholder="YYYY-MM-DD"
                  style={{ backgroundColor: 'white', borderRadius: 12, padding: 14, fontSize: 15, marginBottom: 16 }} />
                <Text style={{ fontFamily: 'Inter_600SemiBold', color: COLORS.charcoal, marginBottom: 8 }}>Time</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                  {getTimeSlots().map((slot) => (
                    <Pressable key={slot} onPress={() => { setTime(slot); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                      style={{ paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, backgroundColor: time === slot ? COLORS.saffron : 'white' }}>
                      <Text style={{ fontSize: 13, fontFamily: 'Inter_600SemiBold', color: time === slot ? 'white' : COLORS.charcoal + '80' }}>{slot}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
                <Text style={{ fontFamily: 'Inter_600SemiBold', color: COLORS.charcoal, marginTop: 16, marginBottom: 8 }}>Guests</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, justifyContent: 'center' }}>
                  <Pressable onPress={() => setGuests((n) => Math.max(1, n - 1))}
                    style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.offwhite, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 24 }}>−</Text>
                  </Pressable>
                  <Text style={{ fontSize: 32, fontFamily: 'PlayfairDisplay_700Bold', color: COLORS.charcoal, minWidth: 48, textAlign: 'center' }}>{guests}</Text>
                  <Pressable onPress={() => setGuests((n) => Math.min(20, n + 1))}
                    style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.saffron, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 24, color: 'white' }}>+</Text>
                  </Pressable>
                </View>
              </View>
            )}

            {step === 2 && (
              <View>
                <Text style={{ fontFamily: 'Inter_600SemiBold', color: COLORS.charcoal, marginBottom: 12 }}>Occasion</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                  {OCCASIONS.map((occ) => (
                    <Pressable key={occ.id} onPress={() => setOccasion(occ.id)}
                      style={{ width: '30%', padding: 14, borderRadius: 12, alignItems: 'center', borderWidth: 2,
                        borderColor: occasion === occ.id ? COLORS.saffron : COLORS.offwhite,
                        backgroundColor: occasion === occ.id ? COLORS.saffron + '10' : 'white' }}>
                      <Text style={{ fontSize: 24, marginBottom: 4 }}>{occ.emoji}</Text>
                      <Text style={{ fontSize: 11, fontFamily: 'Inter_600SemiBold', color: occasion === occ.id ? COLORS.saffron : COLORS.charcoal + '70' }}>{occ.label}</Text>
                    </Pressable>
                  ))}
                </View>
                <Text style={{ fontFamily: 'Inter_600SemiBold', color: COLORS.charcoal, marginTop: 20, marginBottom: 12 }}>Preferred Table (optional)</Text>
                <TablePicker selected={preferredTable} onSelect={setPreferredTable} />
              </View>
            )}

            {step === 3 && (
              <View>
                <Text style={{ fontFamily: 'Inter_600SemiBold', color: COLORS.charcoal, marginBottom: 16 }}>Confirm Details</Text>
                {[
                  { label: 'Name', value: name || '—' },
                  { label: 'Phone', value: '+91 ' + phone },
                  { label: 'Date', value: date },
                  { label: 'Time', value: time },
                  { label: 'Guests', value: `${guests} people` },
                  { label: 'Occasion', value: occasion },
                  { label: 'Table', value: preferredTable ? `T${preferredTable}` : 'Any available' },
                ].map((row) => (
                  <View key={row.label} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.offwhite }}>
                    <Text style={{ color: COLORS.charcoal + '60', fontSize: 14 }}>{row.label}</Text>
                    <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: COLORS.charcoal }}>{row.value}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={{ flexDirection: 'row', gap: 12, marginTop: 28 }}>
              {step > 1 && (
                <Pressable onPress={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
                  style={{ flex: 1, backgroundColor: COLORS.offwhite, borderRadius: 14, padding: 16, alignItems: 'center' }}>
                  <Text style={{ fontFamily: 'Inter_700Bold', color: COLORS.charcoal }}>Back</Text>
                </Pressable>
              )}
              <Pressable
                onPress={() => step < 3 ? setStep((s) => (s + 1) as 1 | 2 | 3) : handleConfirm()}
                disabled={submitting}
                style={{ flex: 2, backgroundColor: COLORS.saffron, borderRadius: 14, padding: 16, alignItems: 'center' }}>
                <Text style={{ color: 'white', fontFamily: 'Inter_700Bold', fontSize: 15 }}>
                  {step < 3 ? 'Next →' : submitting ? 'Confirming...' : t(language, 'confirm')}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
