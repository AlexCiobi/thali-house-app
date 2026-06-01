/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        saffron: '#FF6B00',
        maroon: '#8B1A1A',
        gold: '#D4A017',
        cream: '#FDF6EC',
        charcoal: '#1A1A1A',
        brown: '#2C1810',
        offwhite: '#F5F0E8',
      },
      fontFamily: {
        playfair: ['PlayfairDisplay_700Bold'],
        inter: ['Inter_400Regular'],
        'inter-semibold': ['Inter_600SemiBold'],
        'inter-bold': ['Inter_700Bold'],
      },
    },
  },
};
