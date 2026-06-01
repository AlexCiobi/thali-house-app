import { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import Animated, { FadeIn, FadeInDown, SlideInRight } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useCartStore, type OrderType } from '../../store/cartStore';
import { useUserStore } from '../../store/userStore';
import { supabase } from '../../lib/supabase';
import { TablePicker } from '../../components/TablePicker';
import { t } from '../../lib/translations';
import { COLORS } from '../../lib/colors';

function generateOrderNumber() {
  return `TH-${Math.floor(100000 + Math.random() * 900000)}`;
}

export default function CartTab() {
  const insets = useSafeAreaInsets();
  const { items, orderType, selectedTable, specialInstructions, setOrderType, setTable, setInstructions, updateQty, clearCart, subtotal, totalItems } = useCartStore();
  const { name, phone, language, addOrderToHistory } = useUserStore();
  const [submitting, setSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [success, setSuccess] = useState(false);

  const gst = Math.round(subtotal() * 0.05);
  const total = subtotal() + gst;

  const ORDER_TYPES: { id: OrderType; emoji: string; label: string }[] = [
    { id: 'dine-in', emoji: '🍽️', label: t(language, 'dineIn') },
    { id: 'takeaway', emoji: '🥡', label: t(language, 'takeaway') },
    { id: 'preorder', emoji: '⏰', label: t(language, 'preorder') },
  ];

  async function handlePlaceOrder() {
    if (items.length === 0) return;
    if (orderType === 'dine-in' && !selectedTable) { Alert.alert('Select a table'); return; }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSubmitting(true);
    const num = generateOrderNumber();
    setOrderNumber(num);
    try {
      await supabase.from('orders').insert({
        order_number: num,
        customer_name: name,
        whatsapp_number: '+91' + phone.replace(/\D/g, ''),
        order_type: orderType,
        table_number: orderType === 'dine-in' ? selectedTable : null,
        items: items.map((ci) => ({ id: ci.item.id, name: ci.item.name_en, qty: ci.quantity, price: ci.item.price })),
        subtotal: subtotal(),
        special_instructions: specialInstructions,
        payment_method: 'cod',
        status: 'pending',
      });
    } catch { /* ignore */ }
    addOrderToHistory({ orderNumber: num, items: items.map((ci) => ({ name: ci.item.name_en, qty: ci.quantity, price: ci.item.price })), total, date: new Date().toISOString(), type: orderType });
    clearCart();
    setSubmitting(false);
    setSuccess(true);
  }

  if (success) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.offwhite, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <Animated.View entering={FadeIn.springify()}>
          <View style={{ width: 90, height: 90, borderRadius: 45, backgroundColor: '#DCFCE7', alignItems: 'center', justifyContent: 'center', marginBottom: 20, alignSelf: 'center' }}>
            <Text style={{ fontSize: 44 }}>✅</Text>
          </View>
          <Text style={{ fontSize: 26, fontFamily: 'PlayfairDisplay_700Bold', color: COLORS.charcoal, textAlign: 'center', marginBottom: 8 }}>
            {t(language, 'orderPlaced')}
          </Text>
          <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 20, marginVertical: 20, alignItems: 'center', width: '100%' }}>
            <Text style={{ color: COLORS.charcoal + '60', fontSize: 12, marginBottom: 4 }}>Order Number</Text>
            <Text style={{ fontSize: 22, fontFamily: 'PlayfairDisplay_700Bold', color: COLORS.saffron }}>{orderNumber}</Text>
          </View>
          <Text style={{ color: COLORS.charcoal + '60', textAlign: 'center', fontSize: 13, marginBottom: 24 }}>
            We'll confirm your order on WhatsApp
          </Text>
          <Pressable onPress={() => setSuccess(false)}
            style={{ backgroundColor: COLORS.saffron, borderRadius: 14, padding: 16, alignItems: 'center' }}>
            <Text style={{ color: 'white', fontFamily: 'Inter_700Bold', fontSize: 15 }}>Order More</Text>
          </Pressable>
        </Animated.View>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.offwhite, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <Text style={{ fontSize: 60, marginBottom: 16 }}>🛒</Text>
        <Text style={{ fontSize: 20, fontFamily: 'PlayfairDisplay_700Bold', color: COLORS.charcoal, marginBottom: 8 }}>
          {t(language, 'cartEmpty')}
        </Text>
        <Text style={{ color: COLORS.charcoal + '60', textAlign: 'center', fontSize: 14 }}>
          Browse our menu and add your favourite dishes
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.offwhite }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: insets.top + 16, paddingBottom: 160 }}>
        <Text style={{ fontSize: 24, fontFamily: 'PlayfairDisplay_700Bold', color: COLORS.charcoal, marginBottom: 16 }}>
          {t(language, 'cart')} ({totalItems()})
        </Text>

        {/* Cart items */}
        <View style={{ backgroundColor: 'white', borderRadius: 16, marginBottom: 16, overflow: 'hidden' }}>
          {items.map((ci, i) => (
            <Animated.View key={ci.item.id} entering={SlideInRight.delay(i * 60)}
              style={{ flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: i < items.length - 1 ? 1 : 0, borderBottomColor: COLORS.offwhite }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: COLORS.charcoal }}>{ci.item.name_en}</Text>
                <Text style={{ color: COLORS.saffron, fontSize: 13, marginTop: 2 }}>₹{ci.item.price} × {ci.quantity} = ₹{ci.item.price * ci.quantity}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Pressable onPress={() => { updateQty(ci.item.id, -1); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                  style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.offwhite, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 16, color: COLORS.charcoal }}>−</Text>
                </Pressable>
                <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 15, minWidth: 20, textAlign: 'center' }}>{ci.quantity}</Text>
                <Pressable onPress={() => { updateQty(ci.item.id, 1); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                  style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.saffron, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 16, color: 'white' }}>+</Text>
                </Pressable>
              </View>
            </Animated.View>
          ))}
        </View>

        {/* Order type */}
        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: COLORS.charcoal, marginBottom: 10 }}>
          {t(language, 'orderType')}
        </Text>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
          {ORDER_TYPES.map((ot) => (
            <Pressable key={ot.id} onPress={() => setOrderType(ot.id)}
              style={{ flex: 1, padding: 12, borderRadius: 12, alignItems: 'center', borderWidth: 2,
                borderColor: orderType === ot.id ? COLORS.saffron : COLORS.offwhite,
                backgroundColor: orderType === ot.id ? COLORS.saffron + '10' : 'white' }}>
              <Text style={{ fontSize: 22, marginBottom: 4 }}>{ot.emoji}</Text>
              <Text style={{ fontSize: 11, fontFamily: 'Inter_600SemiBold', color: orderType === ot.id ? COLORS.saffron : COLORS.charcoal + '70' }}>
                {ot.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Table picker */}
        {orderType === 'dine-in' && (
          <Animated.View entering={FadeInDown.springify()} style={{ backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 16 }}>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: COLORS.charcoal, marginBottom: 12 }}>Select Table</Text>
            <TablePicker selected={selectedTable} onSelect={setTable} />
          </Animated.View>
        )}

        {/* Special instructions */}
        <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: COLORS.charcoal, marginBottom: 10 }}>
            {t(language, 'specialInstructions')}
          </Text>
          <TextInput
            value={specialInstructions} onChangeText={setInstructions}
            placeholder="Allergies, preferences..."
            multiline numberOfLines={3}
            style={{ backgroundColor: COLORS.offwhite, borderRadius: 10, padding: 12, fontSize: 14, color: COLORS.charcoal, minHeight: 80, textAlignVertical: 'top' }}
          />
        </View>

        {/* Price summary */}
        <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 8 }}>
          {[
            { label: t(language, 'subtotal'), value: `₹${subtotal()}` },
            { label: t(language, 'gst'), value: `₹${gst}` },
          ].map((row) => (
            <View key={row.label} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
              <Text style={{ color: COLORS.charcoal + '70', fontSize: 14 }}>{row.label}</Text>
              <Text style={{ fontSize: 14, fontFamily: 'Inter_600SemiBold', color: COLORS.charcoal }}>{row.value}</Text>
            </View>
          ))}
          <View style={{ height: 1, backgroundColor: COLORS.offwhite, marginVertical: 8 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 16, color: COLORS.charcoal }}>{t(language, 'total')}</Text>
            <Text style={{ fontSize: 20, fontFamily: 'PlayfairDisplay_700Bold', color: COLORS.saffron }}>₹{total}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Place order button */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, paddingBottom: insets.bottom + 16, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: COLORS.offwhite }}>
        <Pressable onPress={handlePlaceOrder} disabled={submitting}
          style={{ backgroundColor: submitting ? COLORS.saffron + '80' : COLORS.saffron, borderRadius: 16, padding: 18, alignItems: 'center' }}>
          <Text style={{ color: 'white', fontFamily: 'Inter_700Bold', fontSize: 16 }}>
            {submitting ? 'Placing Order...' : `${t(language, 'placeOrder')} — ₹${total}`}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
