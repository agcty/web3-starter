import { useMemo } from "react"

import { AddressZero } from "@ethersproject/constants"
import { Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { Contract, ContractInterface, Signer } from "ethers"
import { isAddress } from "ethers/lib/utils"

function getContract<T = Contract>(
  address: string,
  abi: ContractInterface,
  provider: Signer | Provider
) {
  return <T>(<unknown>new Contract(address, abi, provider))
}

// heavily inspired by uniswaps interface, thanks Noah, great work!
export function useContract<Contract = any>(
  address: string,
  abi: ContractInterface
) {
  const { provider } = useWeb3React()

  const signerOrProvider = useMemo(() => {
    if (provider?.["getSigner"]) {
      return provider.getSigner()
    } else {
      return provider
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
