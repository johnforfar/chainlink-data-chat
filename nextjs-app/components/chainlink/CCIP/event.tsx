"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CCIPDeployments, Chains } from "@/utils/ccip"
import { useQuery } from "@tanstack/react-query"
import { decodeFunctionData, erc20Abi, formatUnits } from "viem"
import * as allChains from "viem/chains"
import { useBlock, usePublicClient, useReadContracts } from "wagmi"

import { LatestCCIPEvents } from "@/hooks/chainlink/useLatestCCIP"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { chains } from "@/components/context/web3-provider"

export function CCIPEvent({
  tx,
  chainId,
}: {
  tx: LatestCCIPEvents[number]
  chainId?: number
}) {
  const publicClient = usePublicClient({ chainId })

  const message = tx.args.message

  const [destinationChain, setDestinationChain] = useState<
    allChains.Chain | undefined
  >(undefined)
  useEffect(() => {
    if (!publicClient) {
      return
    }

    const decodeDestinationChain = async () => {
      const data = await publicClient
        .getTransaction({
          hash: tx.transactionHash,
        })
        .then((tx) => tx.input)
      const functionData = decodeFunctionData({
        abi: RouterABI,
        data: data,
      })
      if (functionData.functionName === "ccipSend") {
        const destinationChainSelector = functionData.args[0]
        const destinationChainId = Object.keys(CCIPDeployments)
          .map(Number)
          .find(
            (chainId) =>
              CCIPDeployments[chainId as Chains].chainSelector ===
              destinationChainSelector
          )
        setDestinationChain(
          Object.values(allChains).find((c) => c.id === destinationChainId)
        )
      }
    }

    decodeDestinationChain().catch(console.error)
  }, [])

  const sourceChain = chains.find((c) => c.id === chainId)

  const { data: feeTokenData } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        abi: erc20Abi,
        address: message.feeToken,
        functionName: "decimals",
        chainId,
      },
      {
        abi: erc20Abi,
        address: message.feeToken,
        functionName: "symbol",
        chainId,
      },
    ],
  })

  const { data: block } = useBlock({ blockNumber: tx.blockNumber, chainId })
  const timeElapsed = block
    ? (BigInt(Math.round(Date.now() / 1000)) - block.timestamp) / BigInt(60) // no one cares about seconds
    : undefined
  const timeAgo = timeElapsed
    ? timeElapsed > BigInt(24 * 60)
      ? `(${timeElapsed / BigInt(24 * 60)}d${((timeElapsed / BigInt(60)) % BigInt(24)).toString().padStart(2, "0")}h${(timeElapsed % BigInt(60)).toString().padStart(2, "0")}m ago)`
      : `(${((timeElapsed / BigInt(60)) % BigInt(24)).toString().padStart(2, "0")}h${(timeElapsed % BigInt(60)).toString().padStart(2, "0")}m ago)`
    : ""

  const { data: tokenTransferInfo } = useQuery({
    queryKey: [
      publicClient,
      message.tokenAmounts.map((t) => {
        return { ...t, amount: t.amount.toString() }
      }),
      chainId ?? 1,
    ],
    queryFn: async () => {
      if (!publicClient) {
        return undefined
      }

      const data = await publicClient.multicall({
        contracts: message.tokenAmounts.flatMap(
          (token) =>
            [
              {
                address: token.token,
                abi: erc20Abi,
                functionName: "decimals",
              },
              {
                address: token.token,
                abi: erc20Abi,
                functionName: "symbol",
              },
            ] as const
        ),
        allowFailure: false,
      })

      return message.tokenAmounts.map((token, i) => {
        const tokenData = [
          data[i * 2] as number,
          data[i * 2 + 1] as string,
        ] as const

        return {
          address: token.token,
          amount: token.amount,
          decimals: tokenData[0],
          symbol: tokenData[1],
        }
      })
    },
    enabled: message.tokenAmounts.length > 0,
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>{message.messageId}</CardTitle>
        <CardDescription>
          Block {tx.blockNumber.toString()} {timeAgo}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col">
        <div>
          <span>Message send to </span>
          <Link
            target="_blank"
            href={
              destinationChain
                ? `${destinationChain.blockExplorers?.default.url}/address/${message.receiver}`
                : "#"
            }
          >
            {message.receiver}{" "}
            {destinationChain ? `(${destinationChain.name})` : ""}
          </Link>
        </div>
        <div>
          <span>Message sent from </span>
          <Link
            target="_blank"
            href={
              sourceChain
                ? `${sourceChain.blockExplorers.default.url}/address/${message.sender}`
                : "#"
            }
          >
            {message.sender} {sourceChain ? `(${sourceChain.name})` : ""}
          </Link>
        </div>
        {feeTokenData && (
          <div>
            <span>Fee </span>
            <Link
              target="_blank"
              href={
                sourceChain
                  ? `${sourceChain.blockExplorers.default.url}/token/${message.feeToken}`
                  : "#"
              }
            >
              {formatUnits(message.feeTokenAmount, feeTokenData[0])}{" "}
              {feeTokenData[1]}
            </Link>
          </div>
        )}
        {tokenTransferInfo && (
          <div>
            <span>Token transfers</span>
            <div className="pl-4">
              {tokenTransferInfo.map((tokenTransfer, i) => (
                <Link
                  key={i}
                  target="_blank"
                  href={
                    sourceChain
                      ? `${sourceChain.blockExplorers.default.url}/token/${tokenTransfer.address}`
                      : "#"
                  }
                >
                  {formatUnits(tokenTransfer.amount, tokenTransfer.decimals)}{" "}
                  {tokenTransfer.symbol}
                </Link>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link
            target="_blank"
            href={
              sourceChain
                ? `${sourceChain.blockExplorers.default.url}/tx/${tx.transactionHash}`
                : "#"
            }
          >
            View on explorer
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

const RouterABI = [
  {
    inputs: [
      { internalType: "address", name: "wrappedNative", type: "address" },
      { internalType: "address", name: "armProxy", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { inputs: [], name: "BadARMSignal", type: "error" },
  { inputs: [], name: "FailedToSendValue", type: "error" },
  { inputs: [], name: "InsufficientFeeTokenAmount", type: "error" },
  { inputs: [], name: "InvalidMsgValue", type: "error" },
  {
    inputs: [{ internalType: "address", name: "to", type: "address" }],
    name: "InvalidRecipientAddress",
    type: "error",
  },
  {
    inputs: [
      { internalType: "uint64", name: "chainSelector", type: "uint64" },
      { internalType: "address", name: "offRamp", type: "address" },
    ],
    name: "OffRampMismatch",
    type: "error",
  },
  { inputs: [], name: "OnlyOffRamp", type: "error" },
  {
    inputs: [
      { internalType: "uint64", name: "destChainSelector", type: "uint64" },
    ],
    name: "UnsupportedDestinationChain",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "messageId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "sourceChainSelector",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "address",
        name: "offRamp",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "calldataHash",
        type: "bytes32",
      },
    ],
    name: "MessageExecuted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint64",
        name: "sourceChainSelector",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "address",
        name: "offRamp",
        type: "address",
      },
    ],
    name: "OffRampAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint64",
        name: "sourceChainSelector",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "address",
        name: "offRamp",
        type: "address",
      },
    ],
    name: "OffRampRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint64",
        name: "destChainSelector",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "address",
        name: "onRamp",
        type: "address",
      },
    ],
    name: "OnRampSet",
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
    inputs: [],
    name: "MAX_RET_BYTES",
    outputs: [{ internalType: "uint16", name: "", type: "uint16" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "acceptOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint64", name: "destChainSelector", type: "uint64" },
          { internalType: "address", name: "onRamp", type: "address" },
        ],
        internalType: "struct Router.OnRamp[]",
        name: "onRampUpdates",
        type: "tuple[]",
      },
      {
        components: [
          {
            internalType: "uint64",
            name: "sourceChainSelector",
            type: "uint64",
          },
          { internalType: "address", name: "offRamp", type: "address" },
        ],
        internalType: "struct Router.OffRamp[]",
        name: "offRampRemoves",
        type: "tuple[]",
      },
      {
        components: [
          {
            internalType: "uint64",
            name: "sourceChainSelector",
            type: "uint64",
          },
          { internalType: "address", name: "offRamp", type: "address" },
        ],
        internalType: "struct Router.OffRamp[]",
        name: "offRampAdds",
        type: "tuple[]",
      },
    ],
    name: "applyRampUpdates",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "destinationChainSelector",
        type: "uint64",
      },
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
    name: "ccipSend",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "getArmProxy",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "destinationChainSelector",
        type: "uint64",
      },
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
    outputs: [{ internalType: "uint256", name: "fee", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getOffRamps",
    outputs: [
      {
        components: [
          {
            internalType: "uint64",
            name: "sourceChainSelector",
            type: "uint64",
          },
          { internalType: "address", name: "offRamp", type: "address" },
        ],
        internalType: "struct Router.OffRamp[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint64", name: "destChainSelector", type: "uint64" },
    ],
    name: "getOnRamp",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint64", name: "chainSelector", type: "uint64" }],
    name: "getSupportedTokens",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getWrappedNative",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint64", name: "chainSelector", type: "uint64" }],
    name: "isChainSupported",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint64", name: "sourceChainSelector", type: "uint64" },
      { internalType: "address", name: "offRamp", type: "address" },
    ],
    name: "isOffRamp",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
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
    inputs: [
      { internalType: "address", name: "tokenAddress", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "recoverTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "bytes32", name: "messageId", type: "bytes32" },
          {
            internalType: "uint64",
            name: "sourceChainSelector",
            type: "uint64",
          },
          { internalType: "bytes", name: "sender", type: "bytes" },
          { internalType: "bytes", name: "data", type: "bytes" },
          {
            components: [
              { internalType: "address", name: "token", type: "address" },
              { internalType: "uint256", name: "amount", type: "uint256" },
            ],
            internalType: "struct Client.EVMTokenAmount[]",
            name: "destTokenAmounts",
            type: "tuple[]",
          },
        ],
        internalType: "struct Client.Any2EVMMessage",
        name: "message",
        type: "tuple",
      },
      { internalType: "uint16", name: "gasForCallExactCheck", type: "uint16" },
      { internalType: "uint256", name: "gasLimit", type: "uint256" },
      { internalType: "address", name: "receiver", type: "address" },
    ],
    name: "routeMessage",
    outputs: [
      { internalType: "bool", name: "success", type: "bool" },
      { internalType: "bytes", name: "retData", type: "bytes" },
      { internalType: "uint256", name: "gasUsed", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "wrappedNative", type: "address" },
    ],
    name: "setWrappedNative",
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
] as const
