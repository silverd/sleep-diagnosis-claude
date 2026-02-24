/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
  },
  // i18n only applies to Pages Router routes (src/pages/).
  // App Router routes in app/ are unaffected and won't receive locale prefixes.
  i18n: {
    locales: ['en', 'zh'],
    defaultLocale: 'en',
  },
}

module.exports = nextConfig
