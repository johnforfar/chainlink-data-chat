import { useQuery } from "@tanstack/react-query"
import { Address } from "viem"
import { usePublicClient } from "wagmi"

export type CurrenciesENS = string[]

export interface CurrenciesMetadata {
  name: string
  address: Address
}

export function useCurrenciesMetadata({
  currenciesENS,
}: {
  currenciesENS: Readonly<CurrenciesENS>
}): CurrenciesMetadata[] | undefined {
  const publicClient = usePublicClient()

  const { data: currenciesMetadata } = useQuery({
    queryKey: ["currenciesMetadata", currenciesENS, publicClient],
    queryFn: async () => {
      if (!publicClient) {
        return undefined
      }

      return await Promise.all(
        currenciesENS.map(async (ens) => {
          const name = ens.replace("-usd", "").toUpperCase()
          const address = await publicClient.getEnsAddress({
            name: `${ens}.data.eth`,
          })
          if (!address) {
            throw new Error(
              `ENS ${ens}.data.eth does not resolve to an address`
            )
          }
          return { name, address }
        })
      )
    },
    staleTime: Infinity,
  })
  return currenciesMetadata
}
