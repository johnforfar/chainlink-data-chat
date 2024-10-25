"use client"

import { useMemo } from "react"
import Image from "next/image"
import { AxisOptions, Chart } from "react-charts"

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

export interface HistoryInfo {
  date: number
  price: number
}

export function Commodity({
  commodity,
  currency,
  history,
}: {
  commodity: CommodityInfo
  currency: CurrencyInfo
  history: HistoryInfo[]
}) {
  const primaryAxis = useMemo(
    (): AxisOptions<HistoryInfo> => ({
      getValue: (item) => item.date,
      show: false,
    }),
    []
  )

  const secondaryAxes = useMemo(
    (): AxisOptions<HistoryInfo>[] => [
      {
        getValue: (item) => item.price,
        show: false,
      },
    ],
    []
  )

  return (
    <Card className="w-full max-md:w-[90vw]">
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
        <div className="h-10 w-52 pointer-events-none max-md:hidden">
          {history.length && (
            <Chart
              options={{
                data: [
                  {
                    data: history,
                  },
                ],
                primaryAxis,
                secondaryAxes,
                tooltip: { show: false },
              }}
            />
          )}
        </div>
        <CardDescription className="text-sm md:text-xl flex flex-col text-right">
          <span>
            {(commodity.price / currency.price)
              .toFixed(2)
              .replace(/\d(?=(\d{3})+\.)/g, "$&,")}{" "}
            {currency.name}
          </span>
          <span className="text-xs md:text-sm">
            Last updated:{" "}
            {new Date(
              history.at(-1)?.date ?? new Date().getTime()
            ).toLocaleTimeString()}
          </span>
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
