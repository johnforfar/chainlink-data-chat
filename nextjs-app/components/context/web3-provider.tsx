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
import { mainnet } from "wagmi/chains"

import { siteConfig } from "@/config/site"

export const chains = [mainnet] as const
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
      http("https://eth.llamarpc.com"),
      http("https://eth.drpc.org"),
      http("https://rpc.ankr.com/eth"),
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
