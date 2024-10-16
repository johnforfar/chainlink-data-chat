import React from "react"

import { DataFeed } from "@/components/chainlink/datafeed"

export default function IndexPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Openmesh SmartCon Demo
        </h1>

        <p className="max-w-[700px] text-base text-muted-foreground md:text-lg">
          Trustless access to Chainlink price feed and CCIP data.
        </p>
      </div>
      <div className="flex gap-4">
        <DataFeed />
      </div>
    </section>
  )
}
