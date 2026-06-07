const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Force Metro to transform packages that ship raw source with private class fields
config.resolver.transformIgnorePatterns = [
  'node_modules/(?!(react-native|@react-native|expo|@expo|@unimodules|unimodules|react-native-reanimated|react-native-worklets|react-native-worklets-core|nativewind|react-native-css-interop|@supabase|isows|ws)/)',
];

module.exports = withNativeWind(config, { input: './global.css' });
