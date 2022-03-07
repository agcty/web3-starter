import useSWR from "swr"
import useSWRImmutable from "swr/immutable"

import GenericERC20Abi from "@abi/GenericERC20.json"
import { GenericERC20 } from "@abi/types"
import { useAccount, useWeb3React } from "@hooks/useWeb3React"
import { parseBigNumberToFloat } from "@utils"

import { useContract } from "./useContract"

export function useToken(address: string) {
  const contract = useContract<GenericERC20>(address, GenericERC20Abi)
  const account = useAccount()

  function useAllowance(spender: string, owner = account) {
    const decimals = useDecimals()

    return useSWR(
      decimals ? [`/token/${address}/allowance`, spender, owner] : null,
      async (_, spender, owner) => {
        const allowance = await contract.allowance(owner, spender)
        return parseBigNumberToFloat(allowance, decimals)
      }
    )
  }

  function useDecimals() {
    // never changes so make it immutable
    const { data } = useSWRImmutable(`/token/${address}/decimals/`, () =>
      contract.decimals()
    )
    return data
  }

  function useName() {
    // never changes so make it immutable
    const { data } = useSWRImmutable(`/token/${address}/name/`, () =>
      contract.name()
    )
    return data
  }

  function useBalance(owner = account) {
    const decimals = useDecimals()

    // needs this decimal check to tell it to only conditionally fetch balance when decimals are ready, otherwise there will be flickering
    return useSWR(
      () => (decimals ? [`/token/${address}/balance`, owner, decimals] : null),
      async (_, owner) => {
        const bal = await contract.balanceOf(owner)
        return parseBigNumberToFloat(bal, decimals)
      }
    )
  }

  // there might be a way to use a proxy that allows us to retrieve some data without uneeded rerenders
  return {
    useAllowance,
    useBalance,
    useDecimals,
    useName,
    contract,
  }
}

// that is some very funky circular thing but this actually beautifully allows us to use useBalance in standalone fashion
export function useBalance(address: string) {
  const { useBalance } = useToken(address)
  return useBalance()
}

export function useNativeBalance() {
  const { library, account } = useWeb3React()

  return useSWR(
    library ? ["/movr/balance/", account] : null,
    async (_, account) => {
      const bal = await library.getBalance(account)
      return parseBigNumberToFloat(bal, 18)
    }
  )
}

// same goes for this
export function useAllowance(address: string, spender: string, owner?: string) {
  const { useAllowance } = useToken(address)
  return useAllowance(spender, owner)
}
