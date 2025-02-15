import { Address } from "viem"

export enum Chains {
  // Mainnet
  Ethereum = 1,
  Optimism = 10,
  BNBChain = 56,
  Gnosis = 100,
  Polygon = 137,
  Kroma = 255,
  ZkSync = 324,
  Metis = 1088,
  Wemix = 1111,
  Base = 8453,
  Mode = 34443,
  Arbitrum = 42161,
  Celo = 42220,
  Avalanche = 43114,
  Linea = 59144,
  Blast = 81457,
  Scroll = 534353,

  // Testnet
  BNBChainTestnet = 97,
  WemixTestnet = 1112,
  KromaSepolia = 2358,
  Fuji = 43113,
  Mumbai = 80001,
  BaseSepolia = 84532,
  ArbitrumSepolia = 421614,
  Sepolia = 11155111,
  OptimismSepolia = 11155420,
}

export interface CCIPDeployment {
  router: Address
  chainSelector: bigint
  feeTokens: {
    link?: Address
    wrappedNative?: Address
  }
}

export const CCIPDeployments = {
  // Mainnet
  [Chains.Arbitrum]: {
    router: "0x141fa059441E0ca23ce184B6A78bafD2A517DdE8",
    chainSelector: BigInt("4949039107694359620"),
    feeTokens: {
      link: "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4",
      wrappedNative: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    },
  },
  [Chains.Avalanche]: {
    router: "0xF4c7E640EdA248ef95972845a62bdC74237805dB",
    chainSelector: BigInt("6433500567565415381"),
    feeTokens: {
      link: "0x5947BB275c521040051D82396192181b413227A3",
      wrappedNative: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
    },
  },
  [Chains.Base]: {
    router: "0x881e3A65B4d4a04dD529061dd0071cf975F58bCD",
    chainSelector: BigInt("15971525489660198786"),
    feeTokens: {
      link: "0x88Fb150BDc53A65fe94Dea0c9BA0a6dAf8C6e196",
      wrappedNative: "0x4200000000000000000000000000000000000006",
    },
  },
  [Chains.Blast]: {
    router: "0x12e0B8E349C6fb7E6E40713E8125C3cF1127ea8C",
    chainSelector: BigInt("4411394078118774322"),
    feeTokens: {
      link: "0x93202eC683288a9EA75BB829c6baCFb2BfeA9013",
      wrappedNative: "0x4300000000000000000000000000000000000004",
    },
  },
  [Chains.BNBChain]: {
    router: "0x34B03Cb9086d7D758AC55af71584F81A598759FE",
    chainSelector: BigInt("11344663589394136015"),
    feeTokens: {
      link: "0x404460C6A5EdE2D891e8297795264fDe62ADBB75",
      wrappedNative: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    },
  },
  [Chains.Celo]: {
    router: "0xfB48f15480926A4ADf9116Dca468bDd2EE6C5F62",
    chainSelector: BigInt("1346049177634351622"),
    feeTokens: {
      link: "0xd07294e6E917e07dfDcee882dd1e2565085C2ae0",
      wrappedNative: "0x2021B12D8138e2D63cF0895eccABC0DFc92416c6",
    },
  },
  [Chains.Ethereum]: {
    router: "0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D",
    chainSelector: BigInt("5009297550715157269"),
    feeTokens: {
      link: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
      wrappedNative: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
  },
  [Chains.Gnosis]: {
    router: "0x4aAD6071085df840abD9Baf1697d5D5992bDadce",
    chainSelector: BigInt("465200170687744372"),
    feeTokens: {
      link: "0xE2e73A1c69ecF83F464EFCE6A5be353a37cA09b2",
      wrappedNative: "0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d",
    },
  },
  [Chains.Kroma]: {
    router: "0xE93E8B0d1b1CEB44350C8758ed1E2799CCee31aB",
    chainSelector: BigInt("3719320017875267166"),
    feeTokens: {
      link: "0xC1F6f7622ad37C3f46cDF6F8AA0344ADE80BF450",
      wrappedNative: "0x4200000000000000000000000000000000000001",
    },
  },
  [Chains.Linea]: {
    router: "0x549FEB73F2348F6cD99b9fc8c69252034897f06C",
    chainSelector: BigInt("4627098889531055414"),
    feeTokens: {
      link: "0xa18152629128738a5c081eb226335FEd4B9C95e9",
      wrappedNative: "0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f",
    },
  },
  [Chains.Metis]: {
    router: "0x7b9FB8717D306e2e08ce2e1Efa81F026bf9AD13c",
    chainSelector: BigInt("8805746078405598895"),
    feeTokens: {
      link: "0xd2FE54D1E5F568eB710ba9d898Bf4bD02C7c0353",
      wrappedNative: "0x75cb093E4D61d2A2e65D8e0BBb01DE8d89b53481",
    },
  },
  [Chains.Mode]: {
    router: "0x24C40f13E77De2aFf37c280BA06c333531589bf1",
    chainSelector: BigInt("7264351850409363825"),
    feeTokens: {
      link: "0x183E3691EfF3524B2315D3703D94F922CbE51F54",
      wrappedNative: "0x4200000000000000000000000000000000000006",
    },
  },
  [Chains.Optimism]: {
    router: "0x3206695CaE29952f4b0c22a169725a865bc8Ce0f",
    chainSelector: BigInt("3734403246176062136"),
    feeTokens: {
      link: "0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6",
      wrappedNative: "0x4200000000000000000000000000000000000006",
    },
  },
  [Chains.Polygon]: {
    router: "0x849c5ED5a80F5B408Dd4969b78c2C8fdf0565Bfe",
    chainSelector: BigInt("4051577828743386545"),
    feeTokens: {
      link: "0xb0897686c545045aFc77CF20eC7A532E3120E0F1",
      wrappedNative: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    },
  },
  [Chains.Scroll]: {
    router: "0x9a55E8Cab6564eb7bbd7124238932963B8Af71DC",
    chainSelector: BigInt("13204309965629103672"),
    feeTokens: {
      link: "0x548C6944cba02B9D1C0570102c89de64D258d3Ac",
      wrappedNative: "0x5300000000000000000000000000000000000004",
    },
  },
  [Chains.Wemix]: {
    router: "0x7798b795Fde864f4Cd1b124a38Ba9619B7F8A442",
    chainSelector: BigInt("5142893604156789321"),
    feeTokens: {
      link: "0x80f1FcdC96B55e459BF52b998aBBE2c364935d69",
      wrappedNative: "0x7D72b22a74A216Af4a002a1095C8C707d6eC1C5f",
    },
  },
  [Chains.ZkSync]: {
    router: "0x748Fd769d81F5D94752bf8B0875E9301d0ba71bB",
    chainSelector: BigInt("1562403441176082196"),
    feeTokens: {
      link: "0x52869bae3E091e36b0915941577F2D47d8d8B534",
      wrappedNative: "0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91",
    },
  },

  // Testnet
  [Chains.Sepolia]: {
    router: "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59",
    chainSelector: BigInt("16015286601757825753"),
    feeTokens: {
      link: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
      wrappedNative: "0x097D90c9d3E0B50Ca60e1ae45F6A81010f9FB534",
    },
  },
  [Chains.OptimismSepolia]: {
    router: "0x114a20a10b43d4115e5aeef7345a1a71d2a60c57",
    chainSelector: BigInt("5224473277236331295"),
    feeTokens: {
      link: "0xE4aB69C077896252FAFBD49EFD26B5D171A32410",
      wrappedNative: "0x4200000000000000000000000000000000000006",
    },
  },
  [Chains.Mumbai]: {
    router: "0x1035CabC275068e0F4b745A29CEDf38E13aF41b1",
    chainSelector: BigInt("12532609583862916517"),
    feeTokens: {
      link: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
      wrappedNative: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
    },
  },
  [Chains.Fuji]: {
    router: "0xF694E193200268f9a4868e4Aa017A0118C9a8177",
    chainSelector: BigInt("14767482510784806043"),
    feeTokens: {
      link: "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846",
      wrappedNative: "0xd00ae08403B9bbb9124bB305C09058E32C39A48c",
    },
  },
  [Chains.BNBChainTestnet]: {
    router: "0xE1053aE1857476f36A3C62580FF9b016E8EE8F6f",
    chainSelector: BigInt("13264668187771770619"),
    feeTokens: {
      link: "0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06",
      wrappedNative: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
    },
  },
  [Chains.ArbitrumSepolia]: {
    router: "0x2a9C5afB0d0e4BAb2BCdaE109EC4b0c4Be15a165",
    chainSelector: BigInt("3478487238524512106"),
    feeTokens: {
      link: "0xb1D4538B4571d411F07960EF2838Ce337FE1E80E",
      wrappedNative: "0xE591bf0A0CF924A0674d7792db046B23CEbF5f34",
    },
  },
  [Chains.BaseSepolia]: {
    router: "0xD3b06cEbF099CE7DA4AcCf578aaebFDBd6e88a93",
    chainSelector: BigInt("10344971235874465080"),
    feeTokens: {
      link: "0xE4aB69C077896252FAFBD49EFD26B5D171A32410",
      wrappedNative: "0x4200000000000000000000000000000000000006",
    },
  },
  [Chains.WemixTestnet]: {
    router: "0xA8C0c11bf64AF62CDCA6f93D3769B88BdD7cb93D",
    chainSelector: BigInt("9284632837123596123"),
    feeTokens: {
      link: "0x3580c7A817cCD41f7e02143BFa411D4EeAE78093",
      wrappedNative: "0xbE3686643c05f00eC46e73da594c78098F7a9Ae7",
    },
  },
  [Chains.KromaSepolia]: {
    router: "0xA8C0c11bf64AF62CDCA6f93D3769B88BdD7cb93D",
    chainSelector: BigInt("5990477251245693094"),
    feeTokens: {
      link: "0xa75cCA5b404ec6F4BB6EC4853D177FE7057085c8",
      wrappedNative: "0x4200000000000000000000000000000000000001",
    },
  },
} as const
