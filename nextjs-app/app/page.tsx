import React from "react"
import { unstable_noStore as noStore } from "next/cache"

import { siteConfig } from "@/config/site"
import { DataFeed } from "@/components/chainlink/datafeed"

export default function IndexPage() {
  noStore()
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          {process.env.NEXT_PUBLIC_SITENAME ?? siteConfig.name}
        </h1>

        <p className="max-w-[700px] text-base text-muted-foreground md:text-lg">
          {process.env.NEXT_PUBLIC_SITEDESCRIPTION ?? siteConfig.description}
        </p>
      </div>
      <div className="flex gap-4">
        <DataFeed />
      </div>
    </section>
  )
}
