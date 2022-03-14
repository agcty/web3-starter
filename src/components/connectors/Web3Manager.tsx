import { useEffect } from "react"

import { metaMask } from "@connectors/metaMask"

export default function Web3Manager() {
  useEffect(() => {
    void metaMask.connectEagerly()
    // void walletConnect.connectEagerly()
  }, [])

  return null
}
