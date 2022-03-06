import { useEffect } from "react"

import { metaMask } from "@connectors/metaMask"
import { walletConnect } from "@connectors/walletConnect"

export default function Web3Manager() {
  useEffect(() => {
    void metaMask.connectEagerly()
    void walletConnect.connectEagerly()
  }, [])

  return null
}
