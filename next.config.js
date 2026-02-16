/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! PERIGO !!
    // Isso permite que o build complete com sucesso mesmo se
    // o seu projeto tiver erros de TypeScript.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Também ignora erros de linting durante o build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;