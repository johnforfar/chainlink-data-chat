export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITENAME ?? "Openmesh Chainlink Data Dashboard",
  description:
    process.env.NEXT_PUBLIC_SITEDESCRIPTION ??
    "Trustless access to Chainlink price feed and CCIP data.",
} as const
