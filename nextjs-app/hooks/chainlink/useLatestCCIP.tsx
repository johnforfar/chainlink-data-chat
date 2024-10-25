import { useQuery } from "@tanstack/react-query"
import { Address, GetContractEventsReturnType } from "viem"
import { arbitrum, base, mainnet, optimism, polygon } from "viem/chains"
import { usePublicClient } from "wagmi"

export type LatestCCIPEvents = GetContractEventsReturnType<
  typeof EVM2EVMOnRampAbi,
  "CCIPSendRequested",
  true
>

export function useLatestCCIP({
  blocks,
  chainId,
}: {
  blocks: bigint
  chainId?: number
}): {
  latestCCIP: LatestCCIPEvents
  dataUpdatedAt: number
} {
  const publicClient = usePublicClient({ chainId })

  const { data: latestCCIP, dataUpdatedAt } = useQuery({
    queryKey: ["priceFeed", publicClient],
    queryFn: async () => {
      if (!publicClient) {
        return undefined
      }

      const blocknumber = await publicClient.getBlockNumber()

      let address: Address | undefined
      switch (chainId) {
        case undefined:
        case mainnet.id:
          address = "0x70B2b3430c41bA19E20F57Cae23c3C619CbCA65D"
          break
        case polygon.id:
          address = "0x9363330c6d807a1393c1fd35893c64d26931CDe6"
          break
        case base.id:
          address = "0xDEA286dc0E01Cb4755650A6CF8d1076b454eA1cb"
          break
        case arbitrum.id:
          address = "0x77b60F85b25fD501E3ddED6C1fe7bF565C08A22A"
          break
        case optimism.id:
          address = "0x6Dbc8D4e5556FD0B82bB0D67c94D0fA1cd288AbD"
          break
        default:
          throw new Error(`Unknown chain ${chainId}`)
      }

      return publicClient
        .getContractEvents({
          abi: EVM2EVMOnRampAbi,
          address: address,
          eventName: "CCIPSendRequested",
          fromBlock: blocknumber - blocks,
          toBlock: blocknumber,
          strict: true,
        })
        .then((events) => events.toReversed())
    },
    enabled: !!publicClient,
    refetchInterval: 12 * 1000,
  })
  return { latestCCIP: latestCCIP as LatestCCIPEvents, dataUpdatedAt }
}

const EVM2EVMOnRampAbi = [
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "linkToken", type: "address" },
          { internalType: "uint64", name: "chainSelector", type: "uint64" },
          { internalType: "uint64", name: "destChainSelector", type: "uint64" },
          { internalType: "uint64", name: "defaultTxGasLimit", type: "uint64" },
          { internalType: "uint96", name: "maxNopFeesJuels", type: "uint96" },
          { internalType: "address", name: "prevOnRamp", type: "address" },
          { internalType: "address", name: "rmnProxy", type: "address" },
          {
            internalType: "address",
            name: "tokenAdminRegistry",
            type: "address",
          },
        ],
        internalType: "struct EVM2EVMOnRamp.StaticConfig",
        name: "staticConfig",
        type: "tuple",
      },
      {
        components: [
          { internalType: "address", name: "router", type: "address" },
          {
            internalType: "uint16",
            name: "maxNumberOfTokensPerMsg",
            type: "uint16",
          },
          { internalType: "uint32", name: "destGasOverhead", type: "uint32" },
          {
            internalType: "uint16",
            name: "destGasPerPayloadByte",
            type: "uint16",
          },
          {
            internalType: "uint32",
            name: "destDataAvailabilityOverheadGas",
            type: "uint32",
          },
          {
            internalType: "uint16",
            name: "destGasPerDataAvailabilityByte",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "destDataAvailabilityMultiplierBps",
            type: "uint16",
          },
          { internalType: "address", name: "priceRegistry", type: "address" },
          { internalType: "uint32", name: "maxDataBytes", type: "uint32" },
          { internalType: "uint32", name: "maxPerMsgGasLimit", type: "uint32" },
          {
            internalType: "uint16",
            name: "defaultTokenFeeUSDCents",
            type: "uint16",
          },
          {
            internalType: "uint32",
            name: "defaultTokenDestGasOverhead",
            type: "uint32",
          },
          { internalType: "bool", name: "enforceOutOfOrder", type: "bool" },
        ],
        internalType: "struct EVM2EVMOnRamp.DynamicConfig",
        name: "dynamicConfig",
        type: "tuple",
      },
      {
        components: [
          { internalType: "bool", name: "isEnabled", type: "bool" },
          { internalType: "uint128", name: "capacity", type: "uint128" },
          { internalType: "uint128", name: "rate", type: "uint128" },
        ],
        internalType: "struct RateLimiter.Config",
        name: "rateLimiterConfig",
        type: "tuple",
      },
      {
        components: [
          { internalType: "address", name: "token", type: "address" },
          {
            internalType: "uint32",
            name: "networkFeeUSDCents",
            type: "uint32",
          },
          {
            internalType: "uint64",
            name: "gasMultiplierWeiPerEth",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "premiumMultiplierWeiPerEth",
            type: "uint64",
          },
          { internalType: "bool", name: "enabled", type: "bool" },
        ],
        internalType: "struct EVM2EVMOnRamp.FeeTokenConfigArgs[]",
        name: "feeTokenConfigs",
        type: "tuple[]",
      },
      {
        components: [
          { internalType: "address", name: "token", type: "address" },
          { internalType: "uint32", name: "minFeeUSDCents", type: "uint32" },
          { internalType: "uint32", name: "maxFeeUSDCents", type: "uint32" },
          { internalType: "uint16", name: "deciBps", type: "uint16" },
          { internalType: "uint32", name: "destGasOverhead", type: "uint32" },
          { internalType: "uint32", name: "destBytesOverhead", type: "uint32" },
          {
            internalType: "bool",
            name: "aggregateRateLimitEnabled",
            type: "bool",
          },
        ],
        internalType: "struct EVM2EVMOnRamp.TokenTransferFeeConfigArgs[]",
        name: "tokenTransferFeeConfigArgs",
        type: "tuple[]",
      },
      {
        components: [
          { internalType: "address", name: "nop", type: "address" },
          { internalType: "uint16", name: "weight", type: "uint16" },
        ],
        internalType: "struct EVM2EVMOnRamp.NopAndWeight[]",
        name: "nopsAndWeights",
        type: "tuple[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      { internalType: "uint256", name: "capacity", type: "uint256" },
      { internalType: "uint256", name: "requested", type: "uint256" },
    ],
    name: "AggregateValueMaxCapacityExceeded",
    type: "error",
  },
  {
    inputs: [
      { internalType: "uint256", name: "minWaitInSeconds", type: "uint256" },
      { internalType: "uint256", name: "available", type: "uint256" },
    ],
    name: "AggregateValueRateLimitReached",
    type: "error",
  },
  { inputs: [], name: "BucketOverfilled", type: "error" },
  { inputs: [], name: "CannotSendZeroTokens", type: "error" },
  { inputs: [], name: "CursedByRMN", type: "error" },
  { inputs: [], name: "ExtraArgOutOfOrderExecutionMustBeTrue", type: "error" },
  {
    inputs: [],
    name: "GetSupportedTokensFunctionalityRemovedCheckAdminRegistry",
    type: "error",
  },
  { inputs: [], name: "InsufficientBalance", type: "error" },
  {
    inputs: [{ internalType: "uint64", name: "chainSelector", type: "uint64" }],
    name: "InvalidChainSelector",
    type: "error",
  },
  { inputs: [], name: "InvalidConfig", type: "error" },
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "uint32", name: "destBytesOverhead", type: "uint32" },
    ],
    name: "InvalidDestBytesOverhead",
    type: "error",
  },
  {
    inputs: [{ internalType: "bytes", name: "encodedAddress", type: "bytes" }],
    name: "InvalidEVMAddress",
    type: "error",
  },
  { inputs: [], name: "InvalidExtraArgsTag", type: "error" },
  {
    inputs: [{ internalType: "address", name: "nop", type: "address" }],
    name: "InvalidNopAddress",
    type: "error",
  },
  { inputs: [], name: "InvalidWithdrawParams", type: "error" },
  { inputs: [], name: "LinkBalanceNotSettled", type: "error" },
  { inputs: [], name: "MaxFeeBalanceReached", type: "error" },
  { inputs: [], name: "MessageGasLimitTooHigh", type: "error" },
  {
    inputs: [
      { internalType: "uint256", name: "maxSize", type: "uint256" },
      { internalType: "uint256", name: "actualSize", type: "uint256" },
    ],
    name: "MessageTooLarge",
    type: "error",
  },
  { inputs: [], name: "MustBeCalledByRouter", type: "error" },
  { inputs: [], name: "NoFeesToPay", type: "error" },
  { inputs: [], name: "NoNopsToPay", type: "error" },
  {
    inputs: [{ internalType: "address", name: "token", type: "address" }],
    name: "NotAFeeToken",
    type: "error",
  },
  { inputs: [], name: "OnlyCallableByAdminOrOwner", type: "error" },
  { inputs: [], name: "OnlyCallableByOwnerOrAdmin", type: "error" },
  { inputs: [], name: "OnlyCallableByOwnerOrAdminOrNop", type: "error" },
  {
    inputs: [{ internalType: "address", name: "token", type: "address" }],
    name: "PriceNotFoundForToken",
    type: "error",
  },
  { inputs: [], name: "RouterMustSetOriginalSender", type: "error" },
  {
    inputs: [{ internalType: "address", name: "token", type: "address" }],
    name: "SourceTokenDataTooLarge",
    type: "error",
  },
  {
    inputs: [
      { internalType: "uint256", name: "capacity", type: "uint256" },
      { internalType: "uint256", name: "requested", type: "uint256" },
      { internalType: "address", name: "tokenAddress", type: "address" },
    ],
    name: "TokenMaxCapacityExceeded",
    type: "error",
  },
  {
    inputs: [
      { internalType: "uint256", name: "minWaitInSeconds", type: "uint256" },
      { internalType: "uint256", name: "available", type: "uint256" },
      { internalType: "address", name: "tokenAddress", type: "address" },
    ],
    name: "TokenRateLimitReached",
    type: "error",
  },
  { inputs: [], name: "TooManyNops", type: "error" },
  { inputs: [], name: "UnsupportedNumberOfTokens", type: "error" },
  {
    inputs: [{ internalType: "address", name: "token", type: "address" }],
    name: "UnsupportedToken",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "AdminSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "uint64",
            name: "sourceChainSelector",
            type: "uint64",
          },
          { internalType: "address", name: "sender", type: "address" },
          { internalType: "address", name: "receiver", type: "address" },
          { internalType: "uint64", name: "sequenceNumber", type: "uint64" },
          { internalType: "uint256", name: "gasLimit", type: "uint256" },
          { internalType: "bool", name: "strict", type: "bool" },
          { internalType: "uint64", name: "nonce", type: "uint64" },
          { internalType: "address", name: "feeToken", type: "address" },
          { internalType: "uint256", name: "feeTokenAmount", type: "uint256" },
          { internalType: "bytes", name: "data", type: "bytes" },
          {
            components: [
              { internalType: "address", name: "token", type: "address" },
              { internalType: "uint256", name: "amount", type: "uint256" },
            ],
            internalType: "struct Client.EVMTokenAmount[]",
            name: "tokenAmounts",
            type: "tuple[]",
          },
          { internalType: "bytes[]", name: "sourceTokenData", type: "bytes[]" },
          { internalType: "bytes32", name: "messageId", type: "bytes32" },
        ],
        indexed: false,
        internalType: "struct Internal.EVM2EVMMessage",
        name: "message",
        type: "tuple",
      },
    ],
    name: "CCIPSendRequested",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          { internalType: "bool", name: "isEnabled", type: "bool" },
          { internalType: "uint128", name: "capacity", type: "uint128" },
          { internalType: "uint128", name: "rate", type: "uint128" },
        ],
        indexed: false,
        internalType: "struct RateLimiter.Config",
        name: "config",
        type: "tuple",
      },
    ],
    name: "ConfigChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          { internalType: "address", name: "linkToken", type: "address" },
          { internalType: "uint64", name: "chainSelector", type: "uint64" },
          { internalType: "uint64", name: "destChainSelector", type: "uint64" },
          { internalType: "uint64", name: "defaultTxGasLimit", type: "uint64" },
          { internalType: "uint96", name: "maxNopFeesJuels", type: "uint96" },
          { internalType: "address", name: "prevOnRamp", type: "address" },
          { internalType: "address", name: "rmnProxy", type: "address" },
          {
            internalType: "address",
            name: "tokenAdminRegistry",
            type: "address",
          },
        ],
        indexed: false,
        internalType: "struct EVM2EVMOnRamp.StaticConfig",
        name: "staticConfig",
        type: "tuple",
      },
      {
        components: [
          { internalType: "address", name: "router", type: "address" },
          {
            internalType: "uint16",
            name: "maxNumberOfTokensPerMsg",
            type: "uint16",
          },
          { internalType: "uint32", name: "destGasOverhead", type: "uint32" },
          {
            internalType: "uint16",
            name: "destGasPerPayloadByte",
            type: "uint16",
          },
          {
            internalType: "uint32",
            name: "destDataAvailabilityOverheadGas",
            type: "uint32",
          },
          {
            internalType: "uint16",
            name: "destGasPerDataAvailabilityByte",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "destDataAvailabilityMultiplierBps",
            type: "uint16",
          },
          { internalType: "address", name: "priceRegistry", type: "address" },
          { internalType: "uint32", name: "maxDataBytes", type: "uint32" },
          { internalType: "uint32", name: "maxPerMsgGasLimit", type: "uint32" },
          {
            internalType: "uint16",
            name: "defaultTokenFeeUSDCents",
            type: "uint16",
          },
          {
            internalType: "uint32",
            name: "defaultTokenDestGasOverhead",
            type: "uint32",
          },
          { internalType: "bool", name: "enforceOutOfOrder", type: "bool" },
        ],
        indexed: false,
        internalType: "struct EVM2EVMOnRamp.DynamicConfig",
        name: "dynamicConfig",
        type: "tuple",
      },
    ],
    name: "ConfigSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          { internalType: "address", name: "token", type: "address" },
          {
            internalType: "uint32",
            name: "networkFeeUSDCents",
            type: "uint32",
          },
          {
            internalType: "uint64",
            name: "gasMultiplierWeiPerEth",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "premiumMultiplierWeiPerEth",
            type: "uint64",
          },
          { internalType: "bool", name: "enabled", type: "bool" },
        ],
        indexed: false,
        internalType: "struct EVM2EVMOnRamp.FeeTokenConfigArgs[]",
        name: "feeConfig",
        type: "tuple[]",
      },
    ],
    name: "FeeConfigSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "nop", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "NopPaid",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "nopWeightsTotal",
        type: "uint256",
      },
      {
        components: [
          { internalType: "address", name: "nop", type: "address" },
          { internalType: "uint16", name: "weight", type: "uint16" },
        ],
        indexed: false,
        internalType: "struct EVM2EVMOnRamp.NopAndWeight[]",
        name: "nopsAndWeights",
        type: "tuple[]",
      },
    ],
    name: "NopsSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
    ],
    name: "OwnershipTransferRequested",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address[]",
        name: "tokens",
        type: "address[]",
      },
    ],
    name: "TokenTransferFeeConfigDeleted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          { internalType: "address", name: "token", type: "address" },
          { internalType: "uint32", name: "minFeeUSDCents", type: "uint32" },
          { internalType: "uint32", name: "maxFeeUSDCents", type: "uint32" },
          { internalType: "uint16", name: "deciBps", type: "uint16" },
          { internalType: "uint32", name: "destGasOverhead", type: "uint32" },
          { internalType: "uint32", name: "destBytesOverhead", type: "uint32" },
          {
            internalType: "bool",
            name: "aggregateRateLimitEnabled",
            type: "bool",
          },
        ],
        indexed: false,
        internalType: "struct EVM2EVMOnRamp.TokenTransferFeeConfigArgs[]",
        name: "transferFeeConfig",
        type: "tuple[]",
      },
    ],
    name: "TokenTransferFeeConfigSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "tokens",
        type: "uint256",
      },
    ],
    name: "TokensConsumed",
    type: "event",
  },
  {
    inputs: [],
    name: "acceptOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "currentRateLimiterState",
    outputs: [
      {
        components: [
          { internalType: "uint128", name: "tokens", type: "uint128" },
          { internalType: "uint32", name: "lastUpdated", type: "uint32" },
          { internalType: "bool", name: "isEnabled", type: "bool" },
          { internalType: "uint128", name: "capacity", type: "uint128" },
          { internalType: "uint128", name: "rate", type: "uint128" },
        ],
        internalType: "struct RateLimiter.TokenBucket",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint64", name: "destChainSelector", type: "uint64" },
      {
        components: [
          { internalType: "bytes", name: "receiver", type: "bytes" },
          { internalType: "bytes", name: "data", type: "bytes" },
          {
            components: [
              { internalType: "address", name: "token", type: "address" },
              { internalType: "uint256", name: "amount", type: "uint256" },
            ],
            internalType: "struct Client.EVMTokenAmount[]",
            name: "tokenAmounts",
            type: "tuple[]",
          },
          { internalType: "address", name: "feeToken", type: "address" },
          { internalType: "bytes", name: "extraArgs", type: "bytes" },
        ],
        internalType: "struct Client.EVM2AnyMessage",
        name: "message",
        type: "tuple",
      },
      { internalType: "uint256", name: "feeTokenAmount", type: "uint256" },
      { internalType: "address", name: "originalSender", type: "address" },
    ],
    name: "forwardFromRouter",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getDynamicConfig",
    outputs: [
      {
        components: [
          { internalType: "address", name: "router", type: "address" },
          {
            internalType: "uint16",
            name: "maxNumberOfTokensPerMsg",
            type: "uint16",
          },
          { internalType: "uint32", name: "destGasOverhead", type: "uint32" },
          {
            internalType: "uint16",
            name: "destGasPerPayloadByte",
            type: "uint16",
          },
          {
            internalType: "uint32",
            name: "destDataAvailabilityOverheadGas",
            type: "uint32",
          },
          {
            internalType: "uint16",
            name: "destGasPerDataAvailabilityByte",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "destDataAvailabilityMultiplierBps",
            type: "uint16",
          },
          { internalType: "address", name: "priceRegistry", type: "address" },
          { internalType: "uint32", name: "maxDataBytes", type: "uint32" },
          { internalType: "uint32", name: "maxPerMsgGasLimit", type: "uint32" },
          {
            internalType: "uint16",
            name: "defaultTokenFeeUSDCents",
            type: "uint16",
          },
          {
            internalType: "uint32",
            name: "defaultTokenDestGasOverhead",
            type: "uint32",
          },
          { internalType: "bool", name: "enforceOutOfOrder", type: "bool" },
        ],
        internalType: "struct EVM2EVMOnRamp.DynamicConfig",
        name: "dynamicConfig",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getExpectedNextSequenceNumber",
    outputs: [{ internalType: "uint64", name: "", type: "uint64" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint64", name: "destChainSelector", type: "uint64" },
      {
        components: [
          { internalType: "bytes", name: "receiver", type: "bytes" },
          { internalType: "bytes", name: "data", type: "bytes" },
          {
            components: [
              { internalType: "address", name: "token", type: "address" },
              { internalType: "uint256", name: "amount", type: "uint256" },
            ],
            internalType: "struct Client.EVMTokenAmount[]",
            name: "tokenAmounts",
            type: "tuple[]",
          },
          { internalType: "address", name: "feeToken", type: "address" },
          { internalType: "bytes", name: "extraArgs", type: "bytes" },
        ],
        internalType: "struct Client.EVM2AnyMessage",
        name: "message",
        type: "tuple",
      },
    ],
    name: "getFee",
    outputs: [
      { internalType: "uint256", name: "feeTokenAmount", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "token", type: "address" }],
    name: "getFeeTokenConfig",
    outputs: [
      {
        components: [
          {
            internalType: "uint32",
            name: "networkFeeUSDCents",
            type: "uint32",
          },
          {
            internalType: "uint64",
            name: "gasMultiplierWeiPerEth",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "premiumMultiplierWeiPerEth",
            type: "uint64",
          },
          { internalType: "bool", name: "enabled", type: "bool" },
        ],
        internalType: "struct EVM2EVMOnRamp.FeeTokenConfig",
        name: "feeTokenConfig",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getNopFeesJuels",
    outputs: [{ internalType: "uint96", name: "", type: "uint96" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getNops",
    outputs: [
      {
        components: [
          { internalType: "address", name: "nop", type: "address" },
          { internalType: "uint16", name: "weight", type: "uint16" },
        ],
        internalType: "struct EVM2EVMOnRamp.NopAndWeight[]",
        name: "nopsAndWeights",
        type: "tuple[]",
      },
      { internalType: "uint256", name: "weightsTotal", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint64", name: "", type: "uint64" },
      { internalType: "contract IERC20", name: "sourceToken", type: "address" },
    ],
    name: "getPoolBySourceToken",
    outputs: [{ internalType: "contract IPoolV1", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "sender", type: "address" }],
    name: "getSenderNonce",
    outputs: [{ internalType: "uint64", name: "", type: "uint64" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getStaticConfig",
    outputs: [
      {
        components: [
          { internalType: "address", name: "linkToken", type: "address" },
          { internalType: "uint64", name: "chainSelector", type: "uint64" },
          { internalType: "uint64", name: "destChainSelector", type: "uint64" },
          { internalType: "uint64", name: "defaultTxGasLimit", type: "uint64" },
          { internalType: "uint96", name: "maxNopFeesJuels", type: "uint96" },
          { internalType: "address", name: "prevOnRamp", type: "address" },
          { internalType: "address", name: "rmnProxy", type: "address" },
          {
            internalType: "address",
            name: "tokenAdminRegistry",
            type: "address",
          },
        ],
        internalType: "struct EVM2EVMOnRamp.StaticConfig",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint64", name: "", type: "uint64" }],
    name: "getSupportedTokens",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "getTokenLimitAdmin",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "token", type: "address" }],
    name: "getTokenTransferFeeConfig",
    outputs: [
      {
        components: [
          { internalType: "uint32", name: "minFeeUSDCents", type: "uint32" },
          { internalType: "uint32", name: "maxFeeUSDCents", type: "uint32" },
          { internalType: "uint16", name: "deciBps", type: "uint16" },
          { internalType: "uint32", name: "destGasOverhead", type: "uint32" },
          { internalType: "uint32", name: "destBytesOverhead", type: "uint32" },
          {
            internalType: "bool",
            name: "aggregateRateLimitEnabled",
            type: "bool",
          },
          { internalType: "bool", name: "isEnabled", type: "bool" },
        ],
        internalType: "struct EVM2EVMOnRamp.TokenTransferFeeConfig",
        name: "tokenTransferFeeConfig",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "linkAvailableForPayment",
    outputs: [{ internalType: "int256", name: "", type: "int256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "payNops",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newAdmin", type: "address" }],
    name: "setAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "router", type: "address" },
          {
            internalType: "uint16",
            name: "maxNumberOfTokensPerMsg",
            type: "uint16",
          },
          { internalType: "uint32", name: "destGasOverhead", type: "uint32" },
          {
            internalType: "uint16",
            name: "destGasPerPayloadByte",
            type: "uint16",
          },
          {
            internalType: "uint32",
            name: "destDataAvailabilityOverheadGas",
            type: "uint32",
          },
          {
            internalType: "uint16",
            name: "destGasPerDataAvailabilityByte",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "destDataAvailabilityMultiplierBps",
            type: "uint16",
          },
          { internalType: "address", name: "priceRegistry", type: "address" },
          { internalType: "uint32", name: "maxDataBytes", type: "uint32" },
          { internalType: "uint32", name: "maxPerMsgGasLimit", type: "uint32" },
          {
            internalType: "uint16",
            name: "defaultTokenFeeUSDCents",
            type: "uint16",
          },
          {
            internalType: "uint32",
            name: "defaultTokenDestGasOverhead",
            type: "uint32",
          },
          { internalType: "bool", name: "enforceOutOfOrder", type: "bool" },
        ],
        internalType: "struct EVM2EVMOnRamp.DynamicConfig",
        name: "dynamicConfig",
        type: "tuple",
      },
    ],
    name: "setDynamicConfig",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "token", type: "address" },
          {
            internalType: "uint32",
            name: "networkFeeUSDCents",
            type: "uint32",
          },
          {
            internalType: "uint64",
            name: "gasMultiplierWeiPerEth",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "premiumMultiplierWeiPerEth",
            type: "uint64",
          },
          { internalType: "bool", name: "enabled", type: "bool" },
        ],
        internalType: "struct EVM2EVMOnRamp.FeeTokenConfigArgs[]",
        name: "feeTokenConfigArgs",
        type: "tuple[]",
      },
    ],
    name: "setFeeTokenConfig",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "nop", type: "address" },
          { internalType: "uint16", name: "weight", type: "uint16" },
        ],
        internalType: "struct EVM2EVMOnRamp.NopAndWeight[]",
        name: "nopsAndWeights",
        type: "tuple[]",
      },
    ],
    name: "setNops",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "bool", name: "isEnabled", type: "bool" },
          { internalType: "uint128", name: "capacity", type: "uint128" },
          { internalType: "uint128", name: "rate", type: "uint128" },
        ],
        internalType: "struct RateLimiter.Config",
        name: "config",
        type: "tuple",
      },
    ],
    name: "setRateLimiterConfig",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "token", type: "address" },
          { internalType: "uint32", name: "minFeeUSDCents", type: "uint32" },
          { internalType: "uint32", name: "maxFeeUSDCents", type: "uint32" },
          { internalType: "uint16", name: "deciBps", type: "uint16" },
          { internalType: "uint32", name: "destGasOverhead", type: "uint32" },
          { internalType: "uint32", name: "destBytesOverhead", type: "uint32" },
          {
            internalType: "bool",
            name: "aggregateRateLimitEnabled",
            type: "bool",
          },
        ],
        internalType: "struct EVM2EVMOnRamp.TokenTransferFeeConfigArgs[]",
        name: "tokenTransferFeeConfigArgs",
        type: "tuple[]",
      },
      {
        internalType: "address[]",
        name: "tokensToUseDefaultFeeConfigs",
        type: "address[]",
      },
    ],
    name: "setTokenTransferFeeConfig",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "to", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "typeAndVersion",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "feeToken", type: "address" },
      { internalType: "address", name: "to", type: "address" },
    ],
    name: "withdrawNonLinkFees",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const
