import { hooks as metaMaskHooks, metaMask } from "../connectors/metaMask"
import {
  hooks as walletConnectHooks,
  walletConnect,
} from "../connectors/walletConnect"

const connectors = {
  metaMask: [metaMask, metaMaskHooks],
  walletConnect: [walletConnect, walletConnectHooks],
}

export default connectors
