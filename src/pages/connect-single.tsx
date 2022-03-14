import { useState } from "react"

import useSWR from "swr"
import useSWRImmutable from "swr/immutable"

import GenericERC20Abi from "@abi/GenericERC20.json"
import { GenericERC20 } from "@abi/types"
import ConnectorModal from "@components/ConnectorModal"
import { useContract } from "@hooks/useContract"
import { useToken } from "@hooks/useToken"
import { parseBigNumberToFloat } from "@utils"

import { useAccount } from "../hooks/useWeb3React"

export default function Home() {
  // const isActive = useIsActive()
  const [isOpen, setIsOpen] = useState(false)

  // const switchChain = useSwitchChain()

  // const { data: allowance } = useAllowance(
  //   "0x6f7D019502e17F1ef24AC67a260c65Dd23b759f1"
  // )

  // const { data: allowance2 } = useAllowance2(
  //   "0x89f52002e544585b42f8c7cf557609ca4c8ce12a",
  //   "0x6f7D019502e17F1ef24AC67a260c65Dd23b759f1"
  // )

  // const { data: balance } = useBalance()

  // useEffect(() => {
  //   if (account) {
  //     contract.balanceOf(account).then(console.log)
  //   }
  // }, [contract, account])
  // const data = useBalancus()
  const { useBalance, useAllowance } = useToken(
    "0x89f52002e544585b42f8c7cf557609ca4c8ce12a"
  )
  const { data: allowance } = useAllowance(
    "0x6f7D019502e17F1ef24AC67a260c65Dd23b759f1"
  )
  const { data } = useBalance()

  console.log("data 2 here", data)
  // const { data: balance } = useNativeBalance()

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setIsOpen(!isOpen)
  //   }, 1000)

  //   return () => clearInterval(interval)
  // }, [isOpen])
  // console.log("test")

  return (
    <div>
      <h1>Connect Wallet</h1>
      {/* {account} */}
      {/* <div>Balance: {JSON.stringify(balance)}</div>
      <div>Allowance: {JSON.stringify(allowance)}</div>
      <div>Allowance2: {JSON.stringify(allowance2)}</div> */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
      >
        Open dialog
      </button>
      {/* {isActive.toString()} */}
      {data}
      <br />
      {allowance}
      {/* {balance} */}
      {/* <button onClick={() => switchChain(1)}>Switch</button> */}
      <ConnectorModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        desiredChain={1285}
      />
    </div>
  )
}

function useBalancus() {
  const account = useAccount()

  const { contract } = useToken("0x89f52002e544585b42f8c7cf557609ca4c8ce12a")

  const { data } = useSWR(["balance", account], (_, account) =>
    contract.balanceOf(account)
  )

  return data
}

function useToken2(address) {
  const contract = useContract<GenericERC20>(address, GenericERC20Abi)
  const account = useAccount()

  function useDecimals() {
    // never changes so make it immutable
    const { data } = useSWRImmutable(
      [`/token/${address}/decimals/`, contract],
      (_, contract) => contract.decimals()
    )
    return data
  }

  // function useBalance() {
  //   const decimals = useDecimals()
  //   return useSWR(["balance2", account, decimals], (_, account) =>
  //     contract.balanceOf(account)
  //   )
  // }

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

  return { useBalance }
}
