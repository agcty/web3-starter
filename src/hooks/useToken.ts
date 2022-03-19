import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"
import useSWRImmutable from "swr/immutable"

import GenericERC20Abi from "@abi/GenericERC20.json"
import { GenericERC20 } from "@abi/types"
import { parseBigNumberToFloat } from "@utils"

import { useContract } from "./useContract"

// NOTES: Personally I looked at different projects like wagmi, eth-hooks, useDapp and they all try to build "generalized" ways of fetching data from a contract.
// e.g useContractRead("decimals") or similar hooks
// the problem i have with these hooks is that they are forcing you to use their data fetching logic, often trying to replicate useSWR/react-query logic
// this project is proposing a different way for fetching data from a contract directly:
// strictly separate provider logic (web3-react) from contract logic (ethers) and data fetching logic (swr/react-query/useEffect)
// very often you'll have to pass arguments anyway (like balanceOf(account)) and swr/react-query have proven to be exactly the right solution for this kind of use case
// also, very often you want to transform data in a specific way (e.g BigNumber -> number but format with decimals in mind) and the libraries I've come across don't really accomodate for this kind of logic
// so hooks like a generalized useContractRead hook are really only useful if you don't have to pass arguments (in my experience)
// what I also like about this strict separation is that it easily allows you to switch between data fetching libraries if need be
// one "downside" of using swr for example however, is that you need to be very careful with keys and dependencies, sometimes it feels like data just isn't fetched fast enough which, this is a good pointer that your keys are wrong
// if you do it right however, data fetching happens almost instantly, so if it feels slow and you can't quite figure it out and start thinking there's no way it could work, just know that there is a way, often just needs tinkering with the keys

/**
 *
 * @param address
 * @description Typed convenience hook for interacting with ERC20 tokens.
 * @example
 * const { contract, useBalance, useAllowance} = useToken(address)
 * //
 * const {data: balance} = useBalance(account)
 * const {data: allowance} = useAllowance(account)
 * console.log(balance)
 */
export function useToken(address: string) {
  const contract = useContract<GenericERC20>(address, GenericERC20Abi)
  const { account } = useWeb3React()

  function useAllowance(spender: string, owner = account) {
    const decimals = useDecimals()

    // strictly speaking, the key in this case would need the contract as a dependency as well but it's implicitly taken from the useDecimals hook
    // if decimals isn't ready, allowance isn't fetched but decimals is only ready when contract is ready
    // also, having decimals as a dependency here and return null if not available prevents flickering
    return useSWR(
      decimals ? [`/token/${address}/allowance`, owner, spender] : null,
      async (_, owner, spender) => {
        const allowance = await contract.allowance(owner, spender)
        return parseBigNumberToFloat(allowance, decimals)
      }
    )
  }

  function useDecimals() {
    // never changes so make it immutable
    // only fetch decimals when there is an account which means there must be a provider
    const { data } = useSWRImmutable(
      account ? `/token/${address}/decimals/` : null,
      () => contract.decimals()
    )
    return data
  }

  function useName() {
    // never changes so make it immutable
    const { data } = useSWRImmutable(
      account ? `/token/${address}/name/` : null,
      () => contract.name()
    )
    return data
  }

  // strictly speaking, the key in this case would need the contract as a dependency as well but it's implicitly taken from the useDecimals hook
  // if decimals isn't ready, allowance isn't fetched but decimals is only ready when contract is ready
  function useBalance(owner = account) {
    const decimals = useDecimals()

    return useSWR(
      // needs this decimal check to tell it to only conditionally fetch balance when decimals are ready, otherwise there will be flickering
      decimals ? [`/token/${address}/balance`, owner, decimals] : null,
      async (_, owner, decimals) => {
        const bal = await contract.balanceOf(owner)
        return parseBigNumberToFloat(bal, decimals)
      }
    )
  }

  return {
    useAllowance,
    useBalance,
    useDecimals,
    useName,
    contract,
  }
}

/**
 *
 * @param address
 * @returns SWRResponse<number, any>
 * @description Convenience wrapper around useToken that returns the balance of the token in the current account, if you only need to use the balance and don't care about the rest of the token, use this
 * @example
 * const { data: balance } = useBalance(address)
 */
export function useBalance(address: string) {
  const { useBalance } = useToken(address)
  return useBalance()
}

/**
 *
 * @param address
 * @returns SWRResponse<number, any>
 * @description Convenience wrapper around useToken that returns the allowance of a token, if you only need to use the allowance and don't care about the rest of the token, use this
 * @example
 * const { data: allowance } = useAllowance(address)
 */
export function useAllowance(address: string, spender: string, owner?: string) {
  const { useAllowance } = useToken(address)
  return useAllowance(spender, owner)
}

export function useNativeBalance() {
  const { account, provider } = useWeb3React()

  return useSWR(
    provider ? ["/native/balance/", account] : null,
    async (_, account) => {
      const bal = await provider.getBalance(account)
      return parseBigNumberToFloat(bal, 18)
    }
  )
}
