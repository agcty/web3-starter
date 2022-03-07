import { useState } from "react"

import ConnectorModal from "@components/ConnectorModal"

import { useAccount, useIsActive, useSwitchChain } from "../hooks/useWeb3React"

export default function Home() {
  const account = useAccount()

  const isActive = useIsActive()
  const [isOpen, setIsOpen] = useState(false)

  const switchChain = useSwitchChain()

  return (
    <div>
      <h1>Connect Wallet</h1>

      {account}

      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
      >
        Open dialog
      </button>

      {isActive.toString()}

      <button onClick={() => switchChain(1)}>Switch</button>

      <ConnectorModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        desiredChain={1285}
      />
    </div>
  )
}
