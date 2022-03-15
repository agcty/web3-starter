import { useState } from "react"

import ConnectorModal from "@components/ConnectorModal"
import { useToken } from "@hooks/useToken"
import {
  useAccount,
  useChainId,
  useIsActive,
  useProvider,
  useSwitchChain,
} from "@hooks/useWeb3React"

export default function Home() {
  const isActive = useIsActive()
  const account = useAccount()
  const chainId = useChainId()

  const [isOpen, setIsOpen] = useState(false)
  const [isOther, showOther] = useState(false)
  const switchChain = useSwitchChain()

  return (
    <>
      <div className="flex h-screen flex-col items-center justify-center">
        <div className="space-y-4">
          <h1>Connect Wallet</h1>

          <ul>
            <li>Account: {account}</li>
            <li>isActive: {isActive.toString()}</li>
            <li>chainId: {chainId}</li>
          </ul>

          <button className="block" onClick={() => showOther(!isOther)}>
            Show {isOther ? "Test1" : "Test2"}
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="block rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
          >
            Open dialog
          </button>

          {isOther && <Test1 />}
          {!isOther && <Test2 />}
        </div>
      </div>

      <ConnectorModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        desiredChain={1}
      />
    </>
  )
}

function Test1() {
  const provider1 = useProvider()
  console.log({ provider1 })

  const { useBalance, useAllowance } = useToken(
    "0x89f52002e544585b42f8c7cf557609ca4c8ce12a"
  )
  const { data: allowance } = useAllowance(
    "0x6f7D019502e17F1ef24AC67a260c65Dd23b759f1"
  )
  const { data } = useBalance()
  console.log("test 1", data)
  return <div className={!data ? "bg-red-400" : "bg-white"}>sRome: {data}</div>
}

function Test2() {
  const provider1 = useProvider()
  console.log({ provider1 })

  const { useBalance, useAllowance } = useToken(
    "0x4a436073552044D5f2f49B176853ad3Ad473d9d6"
  )

  const { data } = useBalance()
  console.log("test 2", data)
  return <div>sRome: {data}</div>
}
