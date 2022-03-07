import { useState } from "react"

import ConnectorModal from "@components/ConnectorModal"

import MetaMaskCard from "../components/connectors/MetaMaskCard"
import WalletConnectCard from "../components/connectors/WalletConnectCard"
import { useAccount, useIsActive } from "../hooks/useWeb3React"

export default function Home() {
  const account = useAccount()

  const isActive = useIsActive()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div
        style={{ display: "flex", flexFlow: "wrap", fontFamily: "sans-serif" }}
      >
        {account}
        <MetaMaskCard />
        <WalletConnectCard />

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          Open dialog
        </button>

        {isActive.toString()}

        <ConnectorModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          desiredChain={1}
        />
      </div>
    </>
  )
}
