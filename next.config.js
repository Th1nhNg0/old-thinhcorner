const { withContentlayer } = require("next-contentlayer");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
const { withSentryConfig } = require("@sentry/nextjs");

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
  },
  i18n: {
    locales: ["vi"],
    defaultLocale: "vi",
  },
};
const sentryWebpackPluginOptions = {
  silent: true, // Suppresses all logs
};

module.exports = withSentryConfig(
  withBundleAnalyzer(withContentlayer(nextConfig)),
  sentryWebpackPluginOptions
);
