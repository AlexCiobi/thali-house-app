import { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useCartStore } from '../../store/cartStore'
import { useUserStore } from '../../store/userStore'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { COLORS } from '../../lib/colors'
import { getItemName } from '../../lib/menuData'
import { TablePicker } from '../../components/TablePicker'

type Step = 1 | 2 | 3
type PaymentMethod = 'cod' | 'razorpay'

const TIME_SLOTS = [
  '11:00', '12:00', '13:00', '14:00', '15:00',
  '16:00', '17:00', '18:00', '19:00', '20:00',
  '21:00', '22:00', '23:00',
]

export default function OrderScreen() {
  const {
    items,
    orderType,
    selectedTable,
    specialInstructions,
    arrivalDate,
    arrivalTime,
    guests,
    setOrderType,
    setTable,
    setInstructions,
    setArrivalDate,
    setArrivalTime,
    setGuests,
    removeItem,
    updateQty,
    clearCart,
    subtotal,
    totalItems,
  } = useCartStore()

  const { profile } = useAuth()
  const { name: storedName, phone: storedPhone, language, addOrderToHistory } = useUserStore()

  const [step, setStep] = useState<Step>(1)
  const [customerName, setCustomerName] = useState(profile?.full_name ?? storedName)
  const [whatsapp, setWhatsapp] = useState(profile?.whatsapp_number ?? storedPhone)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod')
  const [loading, setLoading] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [success, setSuccess] = useState(false)

  const total = subtotal()
  const gst = Math.round(total * 0.05)
  const grandTotal = total + gst
  const razorpayKey = process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID ?? ''
  const razorpayEnabled = !!razorpayKey && razorpayKey !== 'rzp_test_PLACEHOLDER'

  // Empty cart state
  if (items.length === 0 && !success) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: COLORS.cream,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <Text style={{ fontSize: 56 }}>🛒</Text>
        <Text
          style={{
            fontSize: 22,
            fontFamily: 'PlayfairDisplay_700Bold',
            color: COLORS.charcoal,
            marginTop: 16,
            textAlign: 'center',
          }}
        >
          Your cart is empty
        </Text>
        <Text style={{ color: '#888', marginTop: 8, textAlign: 'center' }}>
          Browse the menu and add items to get started
        </Text>
      </SafeAreaView>
    )
  }

  // Success state
  if (success) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: COLORS.cream,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <View
          style={{
            width: 88,
            height: 88,
            borderRadius: 44,
            backgroundColor: '#D1FAE5',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
          }}
        >
          <Text style={{ fontSize: 44 }}>✅</Text>
        </View>
        <Text
          style={{ fontSize: 26, fontFamily: 'PlayfairDisplay_700Bold', color: COLORS.charcoal }}
        >
          Order Placed!
        </Text>
        <Text style={{ fontSize: 15, color: '#888', marginTop: 8 }}>Your order number</Text>
        <Text
          style={{ fontSize: 30, fontWeight: '700', color: COLORS.saffron, marginTop: 4 }}
        >
          {orderNumber}
        </Text>

        {orderType === 'preorder' && (
          <View
            style={{
              backgroundColor: '#FFF3CD',
              borderRadius: 12,
              padding: 16,
              marginTop: 20,
              alignSelf: 'stretch',
            }}
          >
            <Text style={{ fontWeight: '700', color: COLORS.charcoal, marginBottom: 6 }}>
              Pre-Order Details
            </Text>
            <Text style={{ color: '#666' }}>Date: {arrivalDate}</Text>
            <Text style={{ color: '#666' }}>Time: {arrivalTime}</Text>
            <Text style={{ color: '#666' }}>Guests: {guests}</Text>
          </View>
        )}

        <Text style={{ color: '#888', marginTop: 16, textAlign: 'center', lineHeight: 20 }}>
          You'll receive a WhatsApp confirmation shortly.
        </Text>

        <TouchableOpacity
          onPress={() => {
            clearCart()
            setSuccess(false)
            setStep(1)
          }}
          style={{
            backgroundColor: COLORS.saffron,
            borderRadius: 12,
            padding: 16,
            alignSelf: 'stretch',
            alignItems: 'center',
            marginTop: 32,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Order More</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  async function placeOrder() {
    if (!customerName || !whatsapp) {
      Alert.alert('Missing Info', 'Please fill in your name and WhatsApp number')
      return
    }
    if (orderType === 'dine-in' && !selectedTable) {
      Alert.alert('Select Table', 'Please select a table for dine-in orders')
      return
    }
    if (orderType === 'preorder' && (!arrivalDate || !arrivalTime)) {
      Alert.alert('Pre-Order Details', 'Please enter your arrival date and time')
      return
    }

    setLoading(true)
    const num = `TH-${Math.floor(100000 + Math.random() * 900000)}`

    if (paymentMethod === 'razorpay') {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const RazorpayCheckout = require('react-native-razorpay').default
        const options = {
          description: 'Thali House Order',
          currency: 'INR',
          key: razorpayKey,
          amount: grandTotal * 100,
          name: 'Thali House',
          prefill: { contact: whatsapp, name: customerName },
          theme: { color: COLORS.saffron },
        }
        await RazorpayCheckout.open(options)
      } catch (err: unknown) {
        setLoading(false)
        const e = err as { code?: string; description?: string }
        if (e.code !== 'PAYMENT_CANCELLED') {
          Alert.alert('Payment Failed', e.description ?? 'Please try again')
        }
        return
      }
    }

    const orderData: Record<string, unknown> = {
      order_number: num,
      customer_name: customerName,
      whatsapp_number: whatsapp.startsWith('+91') ? whatsapp : `+91${whatsapp}`,
      order_type: orderType,
      items: items.map((i) => ({
        id: i.item.id,
        name: getItemName(i.item, language),
        qty: i.quantity,
        price: i.item.price,
      })),
      subtotal: total,
      total: grandTotal,
      special_instructions: specialInstructions,
      payment_method: paymentMethod,
      payment_status: paymentMethod === 'cod' ? 'pending' : 'paid',
      order_status: 'placed',
    }

    if (orderType === 'dine-in') orderData.table_number = selectedTable
    if (orderType === 'preorder') {
      orderData.arrival_date = arrivalDate
      orderData.arrival_time = arrivalTime
      orderData.guests = guests
    }

    try {
      await supabase.from('orders').insert(orderData)
      addOrderToHistory({
        orderNumber: num,
        items: items.map((i) => ({
          name: getItemName(i.item, language),
          qty: i.quantity,
          price: i.item.price,
        })),
        total: grandTotal,
        date: new Date().toISOString(),
        type: orderType,
      })
      setOrderNumber(num)
      setSuccess(true)
    } catch {
      Alert.alert('Error', 'Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cream }}>
      {/* Header + step indicator */}
      <View
        style={{
          backgroundColor: '#fff',
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#F0EDE8',
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontFamily: 'PlayfairDisplay_700Bold',
            color: COLORS.charcoal,
          }}
        >
          Your Order
        </Text>
        <View style={{ flexDirection: 'row', gap: 6, marginTop: 12 }}>
          {([1, 2, 3] as Step[]).map((s) => (
            <View
              key={s}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                backgroundColor: step >= s ? COLORS.saffron : '#E5E5E5',
              }}
            />
          ))}
        </View>
        <Text style={{ fontSize: 12, color: '#888', marginTop: 6 }}>
          Step {step} of 3 —{' '}
          {step === 1 ? 'Review Items' : step === 2 ? 'Your Details' : 'Payment'}
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── STEP 1: Review items ── */}
        {step === 1 && (
          <View style={{ gap: 10 }}>
            {items.map(({ item, quantity }) => (
              <View
                key={item.id}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 14,
                  padding: 14,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <View
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 2,
                        backgroundColor: item.is_veg ? '#16A34A' : '#DC2626',
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: COLORS.charcoal,
                        flex: 1,
                      }}
                      numberOfLines={1}
                    >
                      {getItemName(item, language)}
                    </Text>
                  </View>
                  <Text style={{ color: COLORS.saffron, fontWeight: '700', marginTop: 4 }}>
                    ₹{item.price} × {quantity} = ₹{item.price * quantity}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <TouchableOpacity
                    onPress={() =>
                      quantity === 1 ? removeItem(item.id) : updateQty(item.id, quantity - 1)
                    }
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      backgroundColor: COLORS.saffron,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ color: '#fff', fontWeight: '700', fontSize: 18 }}>−</Text>
                  </TouchableOpacity>
                  <Text style={{ fontWeight: '700', fontSize: 16, minWidth: 20, textAlign: 'center' }}>
                    {quantity}
                  </Text>
                  <TouchableOpacity
                    onPress={() => updateQty(item.id, quantity + 1)}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      backgroundColor: COLORS.saffron,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ color: '#fff', fontWeight: '700', fontSize: 18 }}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* Price summary */}
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 14,
                padding: 16,
                gap: 8,
                marginTop: 4,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: '#666' }}>Subtotal</Text>
                <Text style={{ fontWeight: '600' }}>₹{total}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: '#666' }}>GST (5%)</Text>
                <Text style={{ fontWeight: '600' }}>₹{gst}</Text>
              </View>
              <View style={{ height: 1, backgroundColor: '#F0EDE8' }} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontWeight: '700', fontSize: 16 }}>Total</Text>
                <Text style={{ fontWeight: '700', fontSize: 16, color: COLORS.saffron }}>
                  ₹{grandTotal}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* ── STEP 2: Details + order type + pre-order ── */}
        {step === 2 && (
          <View style={{ gap: 12 }}>
            {/* Order type */}
            <View style={{ backgroundColor: '#fff', borderRadius: 14, padding: 16 }}>
              <Text
                style={{ fontWeight: '700', fontSize: 15, color: COLORS.charcoal, marginBottom: 12 }}
              >
                Order Type
              </Text>
              {(
                [
                  {
                    type: 'dine-in' as const,
                    icon: '🍽️',
                    label: 'Dine-In',
                    desc: 'Enjoy at the restaurant',
                  },
                  {
                    type: 'takeaway' as const,
                    icon: '🥡',
                    label: 'Takeaway',
                    desc: 'Pick up your order',
                  },
                  {
                    type: 'preorder' as const,
                    icon: '📅',
                    label: 'Pre-Order',
                    desc: 'Schedule for later',
                  },
                ] as const
              ).map(({ type, icon, label, desc }, idx, arr) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setOrderType(type)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    paddingVertical: 12,
                    borderBottomWidth: idx < arr.length - 1 ? 1 : 0,
                    borderBottomColor: '#F0EDE8',
                  }}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      borderWidth: 2,
                      borderColor: orderType === type ? COLORS.saffron : '#CCC',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {orderType === type && (
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: COLORS.saffron,
                        }}
                      />
                    )}
                  </View>
                  <View>
                    <Text style={{ fontWeight: '600', color: COLORS.charcoal }}>
                      {icon} {label}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#888' }}>{desc}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Table picker for dine-in */}
            {orderType === 'dine-in' && (
              <View style={{ backgroundColor: '#fff', borderRadius: 14, padding: 16 }}>
                <Text
                  style={{
                    fontWeight: '700',
                    fontSize: 15,
                    color: COLORS.charcoal,
                    marginBottom: 12,
                  }}
                >
                  Select Table
                </Text>
                <TablePicker selected={selectedTable} onSelect={setTable} />
              </View>
            )}

            {/* Pre-order fields */}
            {orderType === 'preorder' && (
              <View
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 14,
                  padding: 16,
                  gap: 16,
                }}
              >
                <Text
                  style={{ fontWeight: '700', fontSize: 15, color: COLORS.charcoal }}
                >
                  Pre-Order Details
                </Text>

                <View>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '600',
                      color: '#666',
                      marginBottom: 6,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                    }}
                  >
                    Arrival Date
                  </Text>
                  <TextInput
                    value={arrivalDate}
                    onChangeText={setArrivalDate}
                    placeholder="YYYY-MM-DD"
                    style={{
                      backgroundColor: COLORS.cream,
                      borderRadius: 10,
                      padding: 12,
                      fontSize: 15,
                      borderWidth: 1,
                      borderColor: '#E5E5E5',
                      color: COLORS.charcoal,
                    }}
                  />
                </View>

                <View>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '600',
                      color: '#666',
                      marginBottom: 8,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                    }}
                  >
                    Arrival Time
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      {TIME_SLOTS.map((time) => (
                        <TouchableOpacity
                          key={time}
                          onPress={() => setArrivalTime(time)}
                          style={{
                            paddingHorizontal: 14,
                            paddingVertical: 8,
                            borderRadius: 8,
                            backgroundColor:
                              arrivalTime === time ? COLORS.saffron : '#F5F5F5',
                            borderWidth: 1,
                            borderColor:
                              arrivalTime === time ? COLORS.saffron : '#E5E5E5',
                          }}
                        >
                          <Text
                            style={{
                              color: arrivalTime === time ? '#fff' : COLORS.charcoal,
                              fontWeight: '600',
                              fontSize: 13,
                            }}
                          >
                            {time}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>

                <View>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '600',
                      color: '#666',
                      marginBottom: 8,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                    }}
                  >
                    Number of Guests
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 24 }}>
                    <TouchableOpacity
                      onPress={() => guests > 1 && setGuests(guests - 1)}
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 19,
                        backgroundColor: guests > 1 ? COLORS.saffron : '#E5E5E5',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>−</Text>
                    </TouchableOpacity>
                    <Text
                      style={{
                        fontSize: 24,
                        fontWeight: '700',
                        minWidth: 32,
                        textAlign: 'center',
                        color: COLORS.charcoal,
                      }}
                    >
                      {guests}
                    </Text>
                    <TouchableOpacity
                      onPress={() => guests < 20 && setGuests(guests + 1)}
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 19,
                        backgroundColor: guests < 20 ? COLORS.saffron : '#E5E5E5',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

            {/* Customer info */}
            <View style={{ backgroundColor: '#fff', borderRadius: 14, padding: 16, gap: 14 }}>
              <Text style={{ fontWeight: '700', fontSize: 15, color: COLORS.charcoal }}>
                Your Details
              </Text>
              <View>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: '#666',
                    marginBottom: 6,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  Name
                </Text>
                <TextInput
                  value={customerName}
                  onChangeText={setCustomerName}
                  placeholder="Raj Patil"
                  style={{
                    backgroundColor: COLORS.cream,
                    borderRadius: 10,
                    padding: 12,
                    fontSize: 15,
                    borderWidth: 1,
                    borderColor: '#E5E5E5',
                    color: COLORS.charcoal,
                  }}
                />
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: '#666',
                    marginBottom: 6,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  WhatsApp Number
                </Text>
                <TextInput
                  value={whatsapp}
                  onChangeText={setWhatsapp}
                  placeholder="+91 9XXXXXXXXX"
                  keyboardType="phone-pad"
                  style={{
                    backgroundColor: COLORS.cream,
                    borderRadius: 10,
                    padding: 12,
                    fontSize: 15,
                    borderWidth: 1,
                    borderColor: '#E5E5E5',
                    color: COLORS.charcoal,
                  }}
                />
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: '#666',
                    marginBottom: 6,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  Special Instructions (optional)
                </Text>
                <TextInput
                  value={specialInstructions}
                  onChangeText={setInstructions}
                  placeholder="Any dietary restrictions or requests..."
                  multiline
                  numberOfLines={3}
                  style={{
                    backgroundColor: COLORS.cream,
                    borderRadius: 10,
                    padding: 12,
                    fontSize: 15,
                    borderWidth: 1,
                    borderColor: '#E5E5E5',
                    color: COLORS.charcoal,
                    height: 80,
                    textAlignVertical: 'top',
                  }}
                />
              </View>
            </View>
          </View>
        )}

        {/* ── STEP 3: Payment ── */}
        {step === 3 && (
          <View style={{ gap: 12 }}>
            {/* Order summary */}
            <View style={{ backgroundColor: '#fff', borderRadius: 14, padding: 16 }}>
              <Text
                style={{
                  fontWeight: '700',
                  fontSize: 15,
                  color: COLORS.charcoal,
                  marginBottom: 12,
                }}
              >
                Order Summary
              </Text>
              {items.map(({ item, quantity }) => (
                <View
                  key={item.id}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingVertical: 4,
                  }}
                >
                  <Text style={{ color: '#666', flex: 1 }} numberOfLines={1}>
                    {getItemName(item, language)} × {quantity}
                  </Text>
                  <Text style={{ fontWeight: '600' }}>₹{item.price * quantity}</Text>
                </View>
              ))}
              <View style={{ height: 1, backgroundColor: '#F0EDE8', marginVertical: 10 }} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: '#666' }}>GST (5%)</Text>
                <Text style={{ fontWeight: '600' }}>₹{gst}</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 8,
                }}
              >
                <Text style={{ fontWeight: '700', fontSize: 16 }}>Total</Text>
                <Text style={{ fontWeight: '700', fontSize: 16, color: COLORS.saffron }}>
                  ₹{grandTotal}
                </Text>
              </View>
            </View>

            {/* Order info */}
            <View style={{ backgroundColor: '#fff', borderRadius: 14, padding: 16 }}>
              <Text
                style={{
                  fontWeight: '700',
                  fontSize: 15,
                  color: COLORS.charcoal,
                  marginBottom: 10,
                }}
              >
                Order Info
              </Text>
              {[
                [
                  'Type',
                  orderType === 'dine-in'
                    ? '🍽️ Dine-In'
                    : orderType === 'takeaway'
                    ? '🥡 Takeaway'
                    : '📅 Pre-Order',
                ],
                ...(orderType === 'dine-in' ? [['Table', `T${selectedTable}`]] : []),
                ...(orderType === 'preorder'
                  ? [
                      ['Arrival', `${arrivalDate} at ${arrivalTime}`],
                      ['Guests', String(guests)],
                    ]
                  : []),
                ['Name', customerName],
                ['WhatsApp', whatsapp],
              ].map(([key, val]) => (
                <View
                  key={key}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingVertical: 5,
                  }}
                >
                  <Text style={{ color: '#888' }}>{key}</Text>
                  <Text
                    style={{ fontWeight: '600', color: COLORS.charcoal, maxWidth: '60%' }}
                    numberOfLines={1}
                  >
                    {val}
                  </Text>
                </View>
              ))}
            </View>

            {/* Payment method */}
            <View style={{ backgroundColor: '#fff', borderRadius: 14, padding: 16 }}>
              <Text
                style={{
                  fontWeight: '700',
                  fontSize: 15,
                  color: COLORS.charcoal,
                  marginBottom: 12,
                }}
              >
                Payment Method
              </Text>
              {(
                [
                  {
                    key: 'cod' as const,
                    label: '💵 Cash on Delivery',
                    desc: 'Pay when you receive your order',
                  },
                  ...(razorpayEnabled
                    ? [
                        {
                          key: 'razorpay' as const,
                          label: '💳 Pay Online',
                          desc: 'Secure payment via Razorpay',
                        },
                      ]
                    : []),
                ] as { key: PaymentMethod; label: string; desc: string }[]
              ).map((opt, idx, arr) => (
                <TouchableOpacity
                  key={opt.key}
                  onPress={() => setPaymentMethod(opt.key)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    paddingVertical: 12,
                    borderBottomWidth: idx < arr.length - 1 ? 1 : 0,
                    borderBottomColor: '#F0EDE8',
                  }}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      borderWidth: 2,
                      borderColor: paymentMethod === opt.key ? COLORS.saffron : '#CCC',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {paymentMethod === opt.key && (
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: COLORS.saffron,
                        }}
                      />
                    )}
                  </View>
                  <View>
                    <Text style={{ fontWeight: '600', color: COLORS.charcoal }}>{opt.label}</Text>
                    <Text style={{ fontSize: 12, color: '#888' }}>{opt.desc}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom navigation */}
      <View
        style={{
          backgroundColor: '#fff',
          padding: 16,
          borderTopWidth: 1,
          borderTopColor: '#F0EDE8',
          flexDirection: 'row',
          gap: 10,
        }}
      >
        {step > 1 && (
          <TouchableOpacity
            onPress={() => setStep((prev) => (prev - 1) as Step)}
            style={{
              flex: 1,
              padding: 16,
              borderRadius: 12,
              borderWidth: 1.5,
              borderColor: COLORS.saffron,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: COLORS.saffron, fontWeight: '700' }}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => (step < 3 ? setStep((prev) => (prev + 1) as Step) : placeOrder())}
          disabled={loading}
          style={{
            flex: 2,
            padding: 16,
            borderRadius: 12,
            backgroundColor: COLORS.saffron,
            alignItems: 'center',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>
              {step < 3
                ? 'Continue'
                : paymentMethod === 'cod'
                ? `Place Order — ₹${grandTotal}`
                : `Pay ₹${grandTotal} Online`}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
