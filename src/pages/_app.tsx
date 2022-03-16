import React from "react"

import { AppProps } from "next/app"

import "../styles/tailwind.scss"
import Web3Manager from "@components/connectors/Web3Manager"
import { Web3Provider } from "@hooks/useWeb3React"

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <Web3Provider>
      <Web3Manager />
      <Component {...pageProps} />
    </Web3Provider>
  )
}

export default MyApp
