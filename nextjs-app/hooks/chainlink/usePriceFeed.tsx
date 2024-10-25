import { useQuery } from "@tanstack/react-query"
import { Address, formatUnits } from "viem"
import { usePublicClient } from "wagmi"

export function usePriceFeed<T extends { address: Address }>({
  priceFeeds,
}: {
  priceFeeds: T[] | undefined
}): {
  priceFeed: (T & { price: number })[] | undefined
  dataUpdatedAt: number
} {
  const publicClient = usePublicClient()

  const { data: priceFeed, dataUpdatedAt } = useQuery({
    queryKey: ["priceFeed", priceFeeds ?? [], publicClient],
    queryFn: async () => {
      if (!publicClient || !priceFeeds) {
        return undefined
      }

      const priceFeedData = await publicClient.multicall({
        contracts: priceFeeds.flatMap(
          (feed) =>
            [
              {
                address: feed.address,
                abi: aggregatorV3InterfaceABI,
                functionName: "latestRoundData",
              },
              {
                address: feed.address,
                abi: aggregatorV3InterfaceABI,
                functionName: "decimals",
              },
            ] as const
        ),
        allowFailure: false,
      })

      return priceFeeds.map((feed, i) => {
        const feedData = [
          priceFeedData[i * 2] as [bigint, bigint, bigint, bigint, bigint],
          priceFeedData[i * 2 + 1] as number,
        ] as const
        const [roundId, answer, startedAt, updatedAt, answeredInRound] =
          feedData[0]
        const decimals = feedData[1]

        return {
          ...feed,
          price: parseFloat(formatUnits(answer, decimals)),
        }
      })
    },
    enabled: !!priceFeeds && !!publicClient,
    refetchInterval: 12 * 1000,
  })
  return { priceFeed, dataUpdatedAt }
}

const aggregatorV3InterfaceABI = [
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "description",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint80", name: "_roundId", type: "uint80" }],
    name: "getRoundData",
    outputs: [
      { internalType: "uint80", name: "roundId", type: "uint80" },
      { internalType: "int256", name: "answer", type: "int256" },
      { internalType: "uint256", name: "startedAt", type: "uint256" },
      { internalType: "uint256", name: "updatedAt", type: "uint256" },
      { internalType: "uint80", name: "answeredInRound", type: "uint80" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "latestRoundData",
    outputs: [
      { internalType: "uint80", name: "roundId", type: "uint80" },
      { internalType: "int256", name: "answer", type: "int256" },
      { internalType: "uint256", name: "startedAt", type: "uint256" },
      { internalType: "uint256", name: "updatedAt", type: "uint256" },
      { internalType: "uint80", name: "answeredInRound", type: "uint80" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "version",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const
