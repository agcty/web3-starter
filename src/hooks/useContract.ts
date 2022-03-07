import { useMemo, useRef } from "react"

import { AddressZero } from "@ethersproject/constants"
import { Provider } from "@ethersproject/providers"
import { Contract, ContractInterface, Signer } from "ethers"
import { isAddress } from "ethers/lib/utils"

import { useSignerOrProvider } from "./useWeb3React"

function getContract<T = Contract>(
  address: string,
  abi: ContractInterface,
  provider: Signer | Provider
) {
  return <T>(<unknown>new Contract(address, abi, provider))
}

export function useContract<Contract = any>(
  address: string,
  abi: ContractInterface
) {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  const rerenders = useRef(0)
  const provider = useSignerOrProvider()
  // const provider = useProvider()

  console.log(address, rerenders)
  rerenders.current++

  const contract = useMemo(
    () => getContract<Contract>(address, abi, provider),
    [address, abi, provider]
  )

  return contract
}
