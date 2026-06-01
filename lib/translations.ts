import type { Language } from './menuData';

type Strings = {
  greeting: string; openNow: string; closedNow: string;
  orderNow: string; reserveTable: string; viewMenu: string;
  cart: string; cartEmpty: string; placeOrder: string;
  dineIn: string; takeaway: string; preorder: string;
  subtotal: string; total: string; gst: string;
  myReservations: string; newReservation: string; confirm: string;
  name: string; phone: string; date: string; time: string; guests: string;
  occasion: string; orderType: string; specialInstructions: string;
  orderPlaced: string; reservationConfirmed: string;
  searchPlaceholder: string; allItems: string; vegOnly: string; nonVegOnly: string;
  language: string; darkMode: string; notifications: string; orderHistory: string;
  settings: string; aboutUs: string; callUs: string; whatsappUs: string;
  addToCart: string; remove: string; back: string; next: string; skip: string;
};

const translations: Record<Language, Strings> = {
  en: {
    greeting: 'Hello', openNow: 'Open Now', closedNow: 'Closed',
    orderNow: 'Order Now', reserveTable: 'Reserve Table', viewMenu: 'View Menu',
    cart: 'Cart', cartEmpty: 'Your cart is empty', placeOrder: 'Place Order',
    dineIn: 'Dine-In', takeaway: 'Takeaway', preorder: 'Pre-order',
    subtotal: 'Subtotal', total: 'Total', gst: 'GST (5%)',
    myReservations: 'My Reservations', newReservation: 'New Reservation', confirm: 'Confirm',
    name: 'Full Name', phone: 'WhatsApp Number', date: 'Date', time: 'Time', guests: 'Guests',
    occasion: 'Occasion', orderType: 'Order Type', specialInstructions: 'Special Instructions',
    orderPlaced: 'Order Placed!', reservationConfirmed: 'Reservation Confirmed!',
    searchPlaceholder: 'Search dishes...', allItems: 'All', vegOnly: 'Veg', nonVegOnly: 'Non-Veg',
    language: 'Language', darkMode: 'Dark Mode', notifications: 'Notifications', orderHistory: 'Order History',
    settings: 'Settings', aboutUs: 'About Thali House', callUs: 'Call Us', whatsappUs: 'WhatsApp',
    addToCart: 'Add', remove: 'Remove', back: 'Back', next: 'Next', skip: 'Skip',
  },
  mr: {
    greeting: 'नमस्कार', openNow: 'उघडे आहे', closedNow: 'बंद आहे',
    orderNow: 'ऑर्डर करा', reserveTable: 'टेबल बुक करा', viewMenu: 'मेनू पहा',
    cart: 'कार्ट', cartEmpty: 'कार्ट रिकामी आहे', placeOrder: 'ऑर्डर द्या',
    dineIn: 'डाइन-इन', takeaway: 'टेकअवे', preorder: 'प्री-ऑर्डर',
    subtotal: 'उपएकूण', total: 'एकूण', gst: 'जीएसटी (५%)',
    myReservations: 'माझ्या आरक्षणे', newReservation: 'नवीन आरक्षण', confirm: 'पुष्टी करा',
    name: 'पूर्ण नाव', phone: 'व्हॉट्सअ‍ॅप नंबर', date: 'तारीख', time: 'वेळ', guests: 'पाहुणे',
    occasion: 'प्रसंग', orderType: 'ऑर्डर प्रकार', specialInstructions: 'विशेष सूचना',
    orderPlaced: 'ऑर्डर दिली!', reservationConfirmed: 'आरक्षण निश्चित!',
    searchPlaceholder: 'जेवण शोधा...', allItems: 'सर्व', vegOnly: 'शाकाहारी', nonVegOnly: 'मांसाहारी',
    language: 'भाषा', darkMode: 'डार्क मोड', notifications: 'सूचना', orderHistory: 'ऑर्डर इतिहास',
    settings: 'सेटिंग्ज', aboutUs: 'थाळी हाऊस बद्दल', callUs: 'फोन करा', whatsappUs: 'व्हॉट्सअ‍ॅप',
    addToCart: 'जोडा', remove: 'काढा', back: 'मागे', next: 'पुढे', skip: 'वगळा',
  },
  hi: {
    greeting: 'नमस्ते', openNow: 'अभी खुला है', closedNow: 'बंद है',
    orderNow: 'ऑर्डर करें', reserveTable: 'टेबल बुक करें', viewMenu: 'मेनू देखें',
    cart: 'कार्ट', cartEmpty: 'कार्ट खाली है', placeOrder: 'ऑर्डर दें',
    dineIn: 'डाइन-इन', takeaway: 'टेकअवे', preorder: 'प्री-ऑर्डर',
    subtotal: 'उप-कुल', total: 'कुल', gst: 'जीएसटी (5%)',
    myReservations: 'मेरी बुकिंग', newReservation: 'नई बुकिंग', confirm: 'पुष्टि करें',
    name: 'पूरा नाम', phone: 'व्हाट्सएप नंबर', date: 'तारीख', time: 'समय', guests: 'मेहमान',
    occasion: 'अवसर', orderType: 'ऑर्डर प्रकार', specialInstructions: 'विशेष निर्देश',
    orderPlaced: 'ऑर्डर हो गया!', reservationConfirmed: 'बुकिंग पक्की!',
    searchPlaceholder: 'खाना खोजें...', allItems: 'सभी', vegOnly: 'शाकाहारी', nonVegOnly: 'मांसाहारी',
    language: 'भाषा', darkMode: 'डार्क मोड', notifications: 'सूचनाएं', orderHistory: 'ऑर्डर इतिहास',
    settings: 'सेटिंग', aboutUs: 'थाली हाउस के बारे में', callUs: 'कॉल करें', whatsappUs: 'व्हाट्सएप',
    addToCart: 'जोड़ें', remove: 'हटाएं', back: 'वापस', next: 'आगे', skip: 'छोड़ें',
  },
  kn: {
    greeting: 'ನಮಸ್ಕಾರ', openNow: 'ಈಗ ತೆರೆದಿದೆ', closedNow: 'ಮುಚ್ಚಿದೆ',
    orderNow: 'ಆರ್ಡರ್ ಮಾಡಿ', reserveTable: 'ಟೇಬಲ್ ಬುಕ್ ಮಾಡಿ', viewMenu: 'ಮೆನು ನೋಡಿ',
    cart: 'ಕಾರ್ಟ್', cartEmpty: 'ಕಾರ್ಟ್ ಖಾಲಿಯಾಗಿದೆ', placeOrder: 'ಆರ್ಡರ್ ನೀಡಿ',
    dineIn: 'ಡೈನ್-ಇನ್', takeaway: 'ಟೇಕ್‌ಅವೇ', preorder: 'ಪ್ರಿ-ಆರ್ಡರ್',
    subtotal: 'ಉಪ-ಒಟ್ಟು', total: 'ಒಟ್ಟು', gst: 'ಜಿಎಸ್ಟಿ (5%)',
    myReservations: 'ನನ್ನ ಬುಕಿಂಗ್', newReservation: 'ಹೊಸ ಬುಕಿಂಗ್', confirm: 'ದೃಢೀಕರಿಸಿ',
    name: 'ಪೂರ್ಣ ಹೆಸರು', phone: 'ವಾಟ್ಸ್‌ಆಪ್ ಸಂಖ್ಯೆ', date: 'ದಿನಾಂಕ', time: 'ಸಮಯ', guests: 'ಅತಿಥಿಗಳು',
    occasion: 'ಸಂದರ್ಭ', orderType: 'ಆರ್ಡರ್ ವಿಧ', specialInstructions: 'ವಿಶೇಷ ಸೂಚನೆಗಳು',
    orderPlaced: 'ಆರ್ಡರ್ ನೀಡಲಾಗಿದೆ!', reservationConfirmed: 'ಬುಕಿಂಗ್ ಖಚಿತ!',
    searchPlaceholder: 'ಊಟ ಹುಡುಕಿ...', allItems: 'ಎಲ್ಲಾ', vegOnly: 'ಸಸ್ಯಾಹಾರಿ', nonVegOnly: 'ಮಾಂಸಾಹಾರಿ',
    language: 'ಭಾಷೆ', darkMode: 'ಡಾರ್ಕ್ ಮೋಡ್', notifications: 'ಸೂಚನೆಗಳು', orderHistory: 'ಆರ್ಡರ್ ಇತಿಹಾಸ',
    settings: 'ಸೆಟ್ಟಿಂಗ್ಸ್', aboutUs: 'ಥಾಲಿ ಹೌಸ್ ಬಗ್ಗೆ', callUs: 'ಕರೆ ಮಾಡಿ', whatsappUs: 'ವಾಟ್ಸ್‌ಆಪ್',
    addToCart: 'ಸೇರಿಸಿ', remove: 'ತೆಗೆದುಹಾಕಿ', back: 'ಹಿಂದೆ', next: 'ಮುಂದೆ', skip: 'ಬಿಡಿ',
  },
};

export function t(lang: Language, key: keyof Strings): string {
  return translations[lang]?.[key] ?? translations.en[key];
}
