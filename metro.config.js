const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.unstable_enablePackageExports = false;

defaultConfig.transformer = {
  ...defaultConfig.transformer,
  experimentalImportSupport: true,
  inlineRequires: true,
};

// Add polyfill resolver (use defaultConfig, not config)
defaultConfig.resolver.resolverMainFields = ['react-native', 'browser', 'main'];
defaultConfig.resolver.alias = {
  'crypto': 'react-native-crypto',
  'stream': 'stream-browserify',
  'buffer': '@craftzdog/react-native-buffer',
};

module.exports = defaultConfig;