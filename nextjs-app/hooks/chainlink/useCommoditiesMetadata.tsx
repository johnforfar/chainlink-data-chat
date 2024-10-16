import { useQuery } from "@tanstack/react-query"
import { Address } from "viem"
import { usePublicClient } from "wagmi"

export type CommoditiesENS = string[]

export interface CommoditiesMetadata {
  name: string
  address: Address
}

export function useCommoditiesMetadata({
  commoditiesENS,
}: {
  commoditiesENS: Readonly<CommoditiesENS>
}): CommoditiesMetadata[] | undefined {
  const publicClient = usePublicClient()

  const { data: commoditiesMetadata } = useQuery({
    queryKey: ["commoditiesMetadata", commoditiesENS, publicClient],
    queryFn: async () => {
      if (!publicClient) {
        return undefined
      }

      return await Promise.all(
        commoditiesENS.map(async (ens) => {
          const name = ens.replace("-usd", "").replace("-", " ").toUpperCase()
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
    enabled: !!publicClient,
    staleTime: Infinity,
  })
  return commoditiesMetadata
}
