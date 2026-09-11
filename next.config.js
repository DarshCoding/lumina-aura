/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Local assets only — no remote image hosts
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

module.exports = nextConfig;
