import { createContext, useContext, useMemo } from "react"

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

const priorityWeb3 = getPriorityConnector(
  [metaMask, metaMaskHooks],
  [walletConnect, walletConnectHooks]
)

export function useConnector() {
  const { usePriorityConnector } = priorityWeb3
  return usePriorityConnector()
}

export function useWeb3React() {
  const { usePriorityWeb3React, usePriorityProvider } = priorityWeb3
  const priorityProvider = usePriorityProvider()
  return usePriorityWeb3React(priorityProvider)
}

const Web3Contextext = createContext<ReturnType<typeof useWeb3React>>(null)

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const values = useWeb3React()
  return (
    <Web3Contextext.Provider value={values}>{children}</Web3Contextext.Provider>
  )
}

export function useWeb3Context() {
  return useContext(Web3Contextext)
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
  console.log({ provider })

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
