import { TouchableOpacity, Text, Linking, StyleSheet } from 'react-native'

export default function WhatsAppFloat() {
  const number = process.env.EXPO_PUBLIC_WHATSAPP_NUMBER ?? '919XXXXXXXXX'

  return (
    <TouchableOpacity
      onPress={() => Linking.openURL(`https://wa.me/${number}`)}
      style={styles.button}
      activeOpacity={0.85}
    >
      <Text style={styles.icon}>💬</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#25D366',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 999,
  },
  icon: {
    fontSize: 24,
  },
})
