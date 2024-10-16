import "@/styles/globals.css"

import { Metadata, Viewport } from "next"
import localFont from "next/font/local"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import { Web3Provider } from "@/components/context/web3-provider"
import { SiteHeader } from "@/components/site-header"
import { TailwindIndicator } from "@/components/tailwind-indicator"

// Use local copy to avoid having NextJS fetch the file on the Internet during
// build time
const inter = localFont({
  src: "./InterVariable.ttf",
})

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-background antialiased",
            inter.className
          )}
        >
          <Web3Provider>
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <div className="flex-1">{children}</div>
            </div>
            <Toaster />
            <TailwindIndicator />
          </Web3Provider>
        </body>
      </html>
    </>
  )
}
