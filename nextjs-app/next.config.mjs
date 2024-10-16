/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  rewrites: () => [
    {
      source: "/indexer/:call*",
      destination: "https://dci.plopmenz.com/indexer/:call*",
    },
  ],
  reactStrictMode: true,
  webpack: (webpackConfig) => {
    // For web3modal
    webpackConfig.externals.push("pino-pretty", "lokijs", "encoding")
    return webpackConfig
  },
}

export default nextConfig
