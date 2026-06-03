const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Resolve @opentelemetry/api — Supabase optional peer dep
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Return empty module for optional packages that aren't installed
  if (moduleName === '@opentelemetry/api') {
    return {
      type: 'empty',
    };
  }

  // Fallback to default resolution
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
