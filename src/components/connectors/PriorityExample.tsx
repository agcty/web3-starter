import { getPriorityConnector } from "@web3-react/core"
import { MetaMask } from "@web3-react/metamask"
import type { Connector } from "@web3-react/types"
import { WalletConnect } from "@web3-react/walletconnect"

import { hooks as metaMaskHooks, metaMask } from "../../connectors/metaMask"
import {
  hooks as walletConnectHooks,
  walletConnect,
} from "../../connectors/walletConnect"

function getName(connector: Connector) {
  if (connector instanceof MetaMask) return "MetaMask"
  if (connector instanceof WalletConnect) return "WalletConnect"

  return "Unknown"
}

const { usePriorityConnector } = getPriorityConnector(
  [metaMask, metaMaskHooks],
  [walletConnect, walletConnectHooks]
)

export default function PriorityExample() {
  const priorityConnector = usePriorityConnector()
  console.log(`Priority Connector: ${getName(priorityConnector)}`)
  return null
}
