import { useMemo } from "react"

import { AddressZero } from "@ethersproject/constants"
import { Provider } from "@ethersproject/providers"
import { Contract, ContractInterface, Signer } from "ethers"
import { isAddress } from "ethers/lib/utils"

import { useProvider } from "./useWeb3React"

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
  const provider = useProvider()

  const signerOrProvider = useMemo(() => {
    if (provider?.["getSigner"]) {
      return provider.getSigner()
    } else {
      return null
    }
  }, [provider])

  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  const contract = useMemo(
    () => getContract<Contract>(address, abi, signerOrProvider),
    [address, abi, signerOrProvider]
  )

  return contract
}

export function useTest() {
  console.log("test 2")
}
