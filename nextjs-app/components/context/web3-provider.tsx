"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createWeb3Modal } from "@web3modal/wagmi/react"
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config"
import {
  cookieStorage,
  createStorage,
  fallback,
  http,
  WagmiProvider,
} from "wagmi"
import { arbitrum, base, mainnet, optimism, polygon } from "wagmi/chains"

import { siteConfig } from "@/config/site"

export const chains = [mainnet, polygon, base, arbitrum, optimism] as const
export const defaultChain = mainnet

const appName = siteConfig.name
const appDescription = siteConfig.description
const appIcon = "https://openrd.openmesh.network/icon.svg" as const
const appUrl = "https://openmesh.network" as const
const metadata = {
  name: appName,
  description: appDescription,
  url: appUrl,
  icons: [appIcon],
}

const projectId = "9fe09d939172047954f7975a26bc38a2" as const // WalletConnect
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [mainnet.id]: fallback([
      http("https://cloudflare-eth.com"),
      http("https://eth.drpc.org"),
      http("https://eth.llamarpc.com"),
      http("https://rpc.ankr.com/eth"),
    ]),
    [polygon.id]: fallback([
      http("https://polygon-rpc.com"),
      http("https://polygon.drpc.org"),
      http("https://polygon.llamarpc.com"),
      http("https://rpc.ankr.com/polygon"),
    ]),
    [base.id]: fallback([
      http("https://mainnet.base.org"),
      http("https://base.drpc.org"),
      http("https://base.llamarpc.com"),
      http("https://rpc.ankr.com/base"),
    ]),
    [arbitrum.id]: fallback([
      http("https://arb1.arbitrum.io/rpc"),
      http("https://arbitrum.drpc.org"),
      http("https://arbitrum.llamarpc.com"),
      http("https://rpc.ankr.com/arbitrum"),
    ]),
    [optimism.id]: fallback([
      http("https://mainnet.optimism.io"),
      http("https://optimism.drpc.org"),
      http("https://optimism.llamarpc.com"),
      http("https://rpc.ankr.com/optimism"),
    ]),
  },
  auth: {
    email: false,
  },
})

// Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
})

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
