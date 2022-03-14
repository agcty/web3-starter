import { useMemo } from "react"

import { getPriorityConnector } from "@web3-react/core"
import { MetaMask } from "@web3-react/metamask"
import { Network } from "@web3-react/network"
import type { Connector } from "@web3-react/types"
import { WalletConnect } from "@web3-react/walletconnect"

import { getAddChainParameters } from "@chains"

import { hooks as metaMaskHooks, metaMask } from "../connectors/metaMask"
import {
  hooks as walletConnectHooks,
  walletConnect,
} from "../connectors/walletConnect"

function getName(connector: Connector) {
  if (connector instanceof MetaMask) return "MetaMask"
  if (connector instanceof WalletConnect) return "WalletConnect"

  return "Unknown"
}

// web3-react will go through this list and try to use the first connector that is available
// that's why this list should be sorted by priority, i.e. if you want to metamask to have a higher priority than walletconnect it should come first
const priorityWeb3 = getPriorityConnector(
  [metaMask, metaMaskHooks],
  [walletConnect, walletConnectHooks]
)

// web3-react v8 is extremely flexible and allows you to use multiple connectors at once
// this is very different from v6, it's a little harder to understand and needs a little more "boilerplate" but is inifinitely more flexible
// in most cases you will only need one connector however, so that's why we are exporting hooks tied to the priority connector
// if your dApp only needs one connector, it is recommended to use the priority connector
// why do we have to re-export all of these things, why can web3-react not just export these already?
// that's a valid question, this however, is a necessary tradeoff between flexibility and ease of use
// web3-react has no way to know which connector is the priority one, or which connectors even exist, so we have to manually tell it
// this is in contrast to the v6 version, where the Web3Provider was basically responsible for this
// practically, this means we'll have to re-export all of these hooks, but it's a very small list
// this is quite common so maybe there is a way to call a setup function with a list of connectors and then web3-react will automatically pick the priority one

export function useConnector() {
  const { usePriorityConnector } = priorityWeb3
  return usePriorityConnector()
}

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

export function useENS() {
  const { usePriorityENSName } = priorityWeb3
  const provider = useProvider()
  return usePriorityENSName(provider)
}

export function useSignerOrProvider() {
  const provider = useProvider()
  console.log(provider)

  return useMemo(() => {
    if (provider?.["getSigner"]) {
      return provider.getSigner()
    } else {
      return provider
    }
  }, [provider])
}

export function useSwitchChain() {
  const connector = useConnector()

  async function switchChain(desiredChain: number) {
    if (connector instanceof WalletConnect || connector instanceof Network) {
      await connector.activate(desiredChain === -1 ? undefined : desiredChain)
    } else {
      await connector.activate(
        desiredChain === -1 ? undefined : getAddChainParameters(desiredChain)
      )
    }
  }

  return switchChain
}
