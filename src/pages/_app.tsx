import React from "react"

import { AppProps } from "next/app"

import "../styles/tailwind.scss"
import Web3Manager from "@components/connectors/Web3Manager"

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <Web3Manager />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
