"use client"

import Image from "next/image"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export interface CommodityInfo {
  name: string
  price: number
}

export interface CurrencyInfo {
  name: string
  price: number
}

export function Commodity({
  commodity,
  currency,
}: {
  commodity: CommodityInfo
  currency: CurrencyInfo
}) {
  return (
    <Card className="w-full">
      <CardHeader className="w-full flex-row gap-2 place-items-center">
        <Image
          alt={commodity.name}
          src={`/${commodity.name.replace(" ", "")}.png`}
          height={30}
          width={30}
        />
        <CardTitle className="text-lg grow md:text-2xl">
          {commodity.name}
        </CardTitle>
        <CardDescription className="text-sm md:text-xl">
          {(commodity.price / currency.price)
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, "$&,")}{" "}
          {currency.name}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
