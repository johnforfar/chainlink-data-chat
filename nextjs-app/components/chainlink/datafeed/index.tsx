"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { useCommoditiesMetadata } from "@/hooks/chainlink/useCommoditiesMetadata"
import { useCurrenciesMetadata } from "@/hooks/chainlink/useCurrenciesMetadata"
import { usePriceFeed } from "@/hooks/chainlink/usePriceFeed"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Commodity, HistoryInfo } from "./commodity"

// Should all be in USD to support currency change
const commoditiesENS = [
  "total-marketcap-usd",
  "btc-usd",
  "eth-usd",
  "usdt-usd",
  "bnb-usd",
  "sol-usd",
  "usdc-usd",
  // "xrp-usd",
  "link-usd",
]

// Should all be in USD to support currency change
const currenciesENS = [
  "eur-usd",
  "gbp-usd",
  "aud-usd",
  ...commoditiesENS.slice(1),
]

// You can also use non-USD price feeds and change the default currency (however all commodities and currencies be denoted in this same default currency)
const defaultCurrency = { name: "USD", price: 1 }

export function DataFeed() {
  const commoditiesMetadata = useCommoditiesMetadata({ commoditiesENS })
  const currenciesMetadata = useCurrenciesMetadata({ currenciesENS })

  const { priceFeed: commodities, dataUpdatedAt } = usePriceFeed({
    priceFeeds: commoditiesMetadata,
  })
  const { priceFeed: extraCurrencies } = usePriceFeed({
    priceFeeds: currenciesMetadata,
  })

  const currencies = [defaultCurrency].concat(extraCurrencies ?? [])

  const [selectedCurrency, setSelectedCurrency] = useState<string>(
    defaultCurrency.name
  )

  const [commodityHistory, setCommodityHistory] = useState<{
    [name: string]: HistoryInfo[]
  }>({})
  useEffect(() => {
    if (!commodities) {
      return
    }

    const history = { ...commodityHistory }
    commodities.forEach((commodity) => {
      if (!history[commodity.name]) {
        history[commodity.name] = []
      }

      history[commodity.name].push({
        date: dataUpdatedAt,
        price: commodity.price,
      })
    })
    setCommodityHistory(history)
  }, [dataUpdatedAt])

  return (
    <div className="w-full">
      <div className="flex place-items-center gap-5">
        <span className="text-2xl max-md:text-base underline">Price Feeds</span>
        <Link className="text-2xl max-md:text-base" href="/ccip">
          Outgoing CCIP messages
        </Link>
        <div className="grow" />
        <div className="flex gap-1 place-items-center max-md:text-sm">
          <span>Currency: </span>
          <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-md:text-sm">
              <SelectGroup>
                {currencies.map((currency, i) => (
                  <SelectItem key={i} value={currency.name}>
                    {currency.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="w-full flex flex-col gap-3 mt-3">
        {commodities?.map((commodity, i) => (
          <Commodity
            key={i}
            commodity={commodity}
            currency={
              currencies.find((c) => c.name === selectedCurrency) ||
              defaultCurrency
            }
            history={commodityHistory[commodity.name] ?? []}
          />
        ))}
      </div>
    </div>
  )
}
