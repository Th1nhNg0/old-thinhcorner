const { withContentlayer } = require("next-contentlayer");
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
  },
};
module.exports = withContentlayer(nextConfig);
