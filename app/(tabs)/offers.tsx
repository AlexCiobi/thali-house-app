import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS } from '../../lib/colors'
import { useUserStore } from '../../store/userStore'
import type { Language } from '../../lib/menuData'

interface OfferItem {
  id: string
  emoji: string
  color: string
  badge: string
  title: Record<Language, string>
  description: Record<Language, string>
  actionLabel: string
}

const OFFERS: OfferItem[] = [
  {
    id: '1',
    emoji: '🔥',
    color: '#FF6B00',
    badge: 'HOT DEAL',
    title: {
      en: '20% OFF All Thalis',
      mr: 'सर्व थाळ्यांवर २०% सूट',
      hi: 'सभी थाली पर 20% छूट',
      kn: 'ಎಲ್ಲಾ ಥಾಲಿಗಳಲ್ಲಿ 20% ರಿಯಾಯಿತಿ',
    },
    description: {
      en: 'Dine-in only. Valid Monday to Friday.',
      mr: 'फक्त डाइन-इनसाठी. सोमवार ते शुक्रवार.',
      hi: 'केवल डाइन-इन। सोमवार से शुक्रवार।',
      kn: 'ಡೈನ್-ಇನ್ ಮಾತ್ರ. ಸೋಮವಾರ - ಶುಕ್ರವಾರ.',
    },
    actionLabel: 'Order Now',
  },
  {
    id: '2',
    emoji: '👫',
    color: '#8B1A1A',
    badge: 'COMBO',
    title: {
      en: '₹499 Combo Meal',
      mr: '₹४९९ कॉम्बो जेवण',
      hi: '₹499 कॉम्बो भोजन',
      kn: '₹499 ಕಾಂಬೊ ಊಟ',
    },
    description: {
      en: 'For 2 people. Mon–Fri. Includes thali + beverages.',
      mr: '२ जणांसाठी. सोम-शुक्र. थाळी + पेये.',
      hi: '2 लोगों के लिए। सोम-शुक्र। थाली + पेय।',
      kn: '2 ಜನರಿಗೆ. ಸೋಮ-ಶುಕ್ರ. ಥಾಲಿ + ಪಾನೀಯ.',
    },
    actionLabel: 'Order Now',
  },
  {
    id: '3',
    emoji: '🎂',
    color: '#D4A017',
    badge: 'SPECIAL',
    title: {
      en: 'Birthday Special',
      mr: 'वाढदिवस विशेष',
      hi: 'जन्मदिन विशेष',
      kn: 'ಹುಟ್ಟುಹಬ್ಬ ವಿಶೇಷ',
    },
    description: {
      en: 'Free dessert on your birthday. Show valid ID.',
      mr: 'वाढदिवसाला मोफत गोड पदार्थ. वैध ओळखपत्र दाखवा.',
      hi: 'जन्मदिन पर मुफ्त मिठाई। वैध ID दिखाएं।',
      kn: 'ಹುಟ್ಟುಹಬ್ಬದಂದು ಉಚಿತ ಸಿಹಿ. ವೈಧ ID ತೋರಿಸಿ.',
    },
    actionLabel: 'Learn More',
  },
  {
    id: '4',
    emoji: '⭐',
    color: '#1A1A1A',
    badge: 'COMING SOON',
    title: {
      en: 'Loyalty Program',
      mr: 'लॉयल्टी प्रोग्राम',
      hi: 'लॉयल्टी प्रोग्राम',
      kn: 'ಲಾಯಲ್ಟಿ ಪ್ರೋಗ್ರಾಮ್',
    },
    description: {
      en: 'Coming soon! Earn 1 point per ₹10 spent. Redeem for discounts.',
      mr: 'लवकरच! प्रत्येक ₹१० खर्चावर १ पॉइंट मिळवा.',
      hi: 'जल्द आ रहा है! प्रति ₹10 खर्च पर 1 पॉइंट।',
      kn: 'ಶೀಘ್ರದಲ್ಲೇ! ₹10 ಖರ್ಚಿಗೆ 1 ಪಾಯಿಂಟ್.',
    },
    actionLabel: 'Notify Me',
  },
]

export default function OffersScreen() {
  const { language } = useUserStore()
  const whatsappNumber = process.env.EXPO_PUBLIC_WHATSAPP_NUMBER ?? '919XXXXXXXXX'

  function shareOnWhatsApp(offer: OfferItem) {
    const text = encodeURIComponent(
      `Check out this offer at Thali House: ${offer.title[language]}! ${offer.description[language]}`
    )
    Linking.openURL(`https://wa.me/${whatsappNumber}?text=${text}`)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cream }}>
      <View style={{ padding: 20, paddingBottom: 8 }}>
        <Text
          style={{
            fontSize: 28,
            fontFamily: 'PlayfairDisplay_700Bold',
            color: COLORS.charcoal,
          }}
        >
          Offers & Deals
        </Text>
        <Text style={{ color: '#888', marginTop: 4 }}>Exclusive deals just for you</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {OFFERS.map((offer) => (
          <View
            key={offer.id}
            style={{
              backgroundColor: '#fff',
              borderRadius: 20,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            {/* Color strip */}
            <View style={{ height: 6, backgroundColor: offer.color }} />

            <View style={{ padding: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 32, marginBottom: 8 }}>{offer.emoji}</Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: 'PlayfairDisplay_700Bold',
                      color: COLORS.charcoal,
                    }}
                  >
                    {offer.title[language]}
                  </Text>
                  <Text
                    style={{ color: '#666', fontSize: 13, marginTop: 6, lineHeight: 18 }}
                  >
                    {offer.description[language]}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: offer.color,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 20,
                    marginLeft: 12,
                    alignSelf: 'flex-start',
                  }}
                >
                  <Text
                    style={{ fontSize: 9, fontWeight: '700', color: '#fff', letterSpacing: 0.5 }}
                  >
                    {offer.badge}
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: offer.color,
                    borderRadius: 10,
                    padding: 12,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>
                    {offer.actionLabel}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    borderRadius: 10,
                    padding: 12,
                    alignItems: 'center',
                    borderWidth: 1.5,
                    borderColor: '#25D366',
                  }}
                  onPress={() => shareOnWhatsApp(offer)}
                >
                  <Text style={{ color: '#25D366', fontWeight: '700', fontSize: 13 }}>
                    Share on WhatsApp
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {/* WhatsApp exclusive CTA */}
        <View
          style={{
            backgroundColor: '#25D366',
            borderRadius: 20,
            padding: 24,
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 28 }}>📲</Text>
          <Text
            style={{
              color: '#fff',
              fontWeight: '700',
              fontSize: 18,
              marginTop: 10,
              fontFamily: 'PlayfairDisplay_700Bold',
            }}
          >
            WhatsApp Exclusive Offers
          </Text>
          <Text
            style={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: 13,
              textAlign: 'center',
              marginTop: 6,
              lineHeight: 18,
            }}
          >
            Follow us on WhatsApp for special deals you won't find anywhere else!
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              paddingHorizontal: 28,
              paddingVertical: 12,
              marginTop: 16,
            }}
            onPress={() => Linking.openURL(`https://wa.me/${whatsappNumber}`)}
          >
            <Text style={{ color: '#25D366', fontWeight: '700', fontSize: 15 }}>
              Join WhatsApp
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
