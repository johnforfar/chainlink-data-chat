"use client"

import { useState } from "react"

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

import { Commodity } from "./commodity"

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

  const commodities = usePriceFeed({ priceFeeds: commoditiesMetadata })
  const extraCurrencies = usePriceFeed({ priceFeeds: currenciesMetadata })

  const currencies = [defaultCurrency].concat(extraCurrencies ?? [])

  const [selectedCurrency, setSelectedCurrency] = useState<string>(
    defaultCurrency.name
  )

  return (
    <div className="w-full">
      <div className="flex place-items-center">
        <span className="text-2xl grow">Chainlink Price Feeds</span>
        <div className="flex gap-1 place-items-center">
          <span>Currency: </span>
          <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
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
          />
        ))}
      </div>
    </div>
  )
}
