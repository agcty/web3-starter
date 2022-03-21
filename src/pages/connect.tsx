import { useState } from "react"

import { useWeb3React } from "@web3-react/core"

import ConnectorModal from "@components/ConnectorModal"

export default function Home() {
  const { isActive, account } = useWeb3React()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
      >
        Open dialog
      </button>

      <ul>
        <li>Account: {account}</li>
        <li>Is active: {isActive.toString()}</li>
      </ul>

      <ConnectorModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        desiredChain={1}
      />
    </div>
  )
}
