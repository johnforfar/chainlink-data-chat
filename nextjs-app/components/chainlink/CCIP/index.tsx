"use client"

import { useState } from "react"
import Link from "next/link"
import { arbitrum, base, mainnet, optimism, polygon } from "viem/chains"

import { useLatestCCIP } from "@/hooks/chainlink/useLatestCCIP"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { CCIPEvent } from "./event"

export function CCIP() {
  const [chainId, setChainId] = useState<number>(1)
  const { latestCCIP, dataUpdatedAt } = useLatestCCIP({
    blocks: BigInt(100_000),
    chainId,
  })
  const [shown, setShown] = useState<number>(10)

  return (
    <div className="w-full">
      <div className="flex flex-col">
        <div className="flex place-items-center gap-5">
          <Link className="text-2xl" href="/">
            Price Feeds
          </Link>
          <span className="text-2xl underline">Outgoing CCIP messages</span>
          <div className="grow" />
          <div className="flex gap-1 place-items-center">
            <span>Chain: </span>
            <Select
              value={chainId.toString()}
              onValueChange={(v) => setChainId(parseInt(v))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {[mainnet, polygon, base, arbitrum, optimism].map(
                    (chain, i) => (
                      <SelectItem key={i} value={chain.id.toString()}>
                        {chain.name}
                      </SelectItem>
                    )
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <span className="text-lg font-">
          Last updated:{" "}
          {dataUpdatedAt === 0
            ? "-"
            : new Date(dataUpdatedAt).toLocaleTimeString()}
        </span>
      </div>
      <div className="w-full flex flex-col gap-3 mt-3">
        {latestCCIP
          ?.slice(0, shown)
          .map((tx, i) => <CCIPEvent key={i} tx={tx} chainId={chainId} />)}
      </div>
      <div>
        <Button onClick={() => setShown(shown + 10)}>Show more</Button>
      </div>
    </div>
  )
}
