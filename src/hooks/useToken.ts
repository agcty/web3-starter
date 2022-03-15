import useSWR from "swr"
import useSWRImmutable from "swr/immutable"

import GenericERC20Abi from "@abi/GenericERC20.json"
import { GenericERC20 } from "@abi/types"
import { useAccount, useProvider } from "@hooks/useWeb3React"
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
// one "downside" of using swr for example however, is that you need to be very careful with keys and dependencies, sometimes you feel like the data just isn't fetched fast enough which most likely is due to a key issue
// if you do it right however, data fetching happens almost instantly, so if it feels slow and you can't quite figure it out and start thinking there's no way it could work, just know that there is a way, just needs some tinkering here and there
// these hooks that directly fetch data from the contract are a good (if not only) solution if you are not able to fetch data from a graphql endpoint (e.g as provided by the graph), if you have the choice, you should use the graphql endpoint

export function useToken(address: string) {
  const contract = useContract<GenericERC20>(address, GenericERC20Abi)
  const account = useAccount()

  function useAllowance(spender: string, owner = account) {
    const decimals = useDecimals()

    // strictly speaking, the key in this case would need the contract as a dependency as well but it's implicitly taken from the useDecimals hook
    // if decimals isn't ready, allowance isn't fetched but decimals is only ready when contract is ready
    return useSWR(
      decimals ? [`/token/${address}/allowance`, owner, spender] : null,
      async (_, owner, spender) => {
        const allowance = await contract.allowance(owner, spender)
        return parseBigNumberToFloat(allowance, decimals)
      }
    )
  }

  // removing contract from the key here will result in balances and allowances not being able to be fetched
  function useDecimals() {
    // never changes so make it immutable

    const { data } = useSWRImmutable(
      [`/token/${address}/decimals/`, contract],
      (_) => contract.decimals()
    )
    return data
  }

  function useName() {
    // never changes so make it immutable
    const { data } = useSWRImmutable(
      [`/token/${address}/name/`, contract],
      (_, contract) => contract.name()
    )
    return data
  }

  // strictly speaking, the key in this case would need the contract as a dependency as well but it's implicitly taken from the useDecimals hook
  // if decimals isn't ready, allowance isn't fetched but decimals is only ready when contract is ready
  function useBalance(owner = account) {
    const decimals = useDecimals()
    // needs this decimal check to tell it to only conditionally fetch balance when decimals are ready, otherwise there will be flickering

    return useSWR(
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

// funky "circular" usage of nested hooks but exporting them as a standalone hook
export function useBalance(address: string) {
  const { useBalance } = useToken(address)
  return useBalance()
}

export function useAllowance(address: string, spender: string, owner?: string) {
  const { useAllowance } = useToken(address)
  return useAllowance(spender, owner)
}

export function useNativeBalance() {
  const account = useAccount()
  const provider = useProvider()

  return useSWR(
    provider ? ["/movr/balance/", account] : null,
    async (_, account) => {
      const bal = await provider.getBalance(account)
      return parseBigNumberToFloat(bal, 18)
    }
  )
}
