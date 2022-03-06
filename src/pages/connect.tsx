import MetaMaskCard from "../components/connectors/MetaMaskCard"
import PriorityExample from "../components/connectors/PriorityExample"
import WalletConnectCard from "../components/connectors/WalletConnectCard"

export default function Home() {
  return (
    <>
      <PriorityExample />
      <div
        style={{ display: "flex", flexFlow: "wrap", fontFamily: "sans-serif" }}
      >
        <MetaMaskCard />
        <WalletConnectCard />
      </div>
    </>
  )
}
