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

const priorityWeb3 = getPriorityConnector(
  [metaMask, metaMaskHooks],
  [walletConnect, walletConnectHooks]
)

export function useWeb3React() {
  const { usePriorityWeb3React, usePriorityProvider } = priorityWeb3
  const priorityProvider = usePriorityProvider()
  return usePriorityWeb3React(priorityProvider)
}

export function useAccount() {
  const { usePriorityAccount } = priorityWeb3
  return usePriorityAccount()
}

export function useIsActive() {
  const { usePriorityIsActive } = priorityWeb3
  return usePriorityIsActive()
}

export function useIsActivating() {
  const { usePriorityIsActivating } = priorityWeb3
  return usePriorityIsActivating()
}

export function useChainId() {
  const { usePriorityChainId } = priorityWeb3
  return usePriorityChainId()
}

export function useError() {
  const { usePriorityError } = priorityWeb3
  return usePriorityError()
}

export function useProvider() {
  const { usePriorityProvider } = priorityWeb3
  return usePriorityProvider()
}

export default function PriorityExample() {
  const { usePriorityConnector, usePriorityWeb3React } = priorityWeb3
  const priorityConnector = usePriorityConnector()
  console.log(`Priority Connector: ${getName(priorityConnector)}`)
  return null
}
