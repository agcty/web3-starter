import {
  coinbaseWallet,
  hooks as coinbaseWalletHooks,
} from "@connectors/coinbaseWallet"
import { hooks as networkHooks, network } from "@connectors/network"
import { CoinbaseWallet } from "@web3-react/coinbase-wallet"
import { Web3ReactHooks } from "@web3-react/core"
import { MetaMask } from "@web3-react/metamask"
import { Network } from "@web3-react/network"
import { WalletConnect } from "@web3-react/walletconnect"

import { hooks as metaMaskHooks, metaMask } from "@connectors/metaMask"
import {
  hooks as walletConnectHooks,
  walletConnect,
} from "@connectors/walletConnect"

const connectors: [
  MetaMask | WalletConnect | CoinbaseWallet | Network,
  Web3ReactHooks
][] = [
  [metaMask, metaMaskHooks],
  [walletConnect, walletConnectHooks],
  [coinbaseWallet, coinbaseWalletHooks],
  [network, networkHooks],
]

export default connectors
