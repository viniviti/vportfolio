/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // O portfólio prioriza build garantido; lint roda via `npm run lint`.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "vcurriculoweb.vercel.app" },
      { protocol: "https", hostname: "blog-do-vinice.vercel.app" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
