import { commoditiesENS } from "@/components/chainlink/datafeed"

export const commoditiesMetadata = commoditiesENS.map(ens => ({
  name: ens.replace("-usd", "").toUpperCase(),
  address: `${ens}.data.eth`
})) 