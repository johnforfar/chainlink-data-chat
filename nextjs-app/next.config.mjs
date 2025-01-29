/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  webpack: (webpackConfig) => {
    // For web3modal
    webpackConfig.externals.push("pino-pretty", "lokijs", "encoding")
    return webpackConfig
  },
  env: {
    POSTGRES_HOST: process.env.POSTGRES_HOST || 'localhost',
    POSTGRES_PORT: process.env.POSTGRES_PORT || '5432',
    BACKEND_PORT: process.env.BACKEND_PORT || '3003',
    BACKEND_HOST: process.env.BACKEND_HOST || '0.0.0.0'
  },
  experimental: {
    serverMinifications: false
  },
  httpAgentOptions: {
    keepAlive: false
  },
  port: parseInt(process.env.BACKEND_PORT || '3003'),
  hostname: process.env.BACKEND_HOST || '0.0.0.0'
}

export default nextConfig
