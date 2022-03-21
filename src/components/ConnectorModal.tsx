import { Fragment } from "react"

import { Dialog, Transition } from "@headlessui/react"
import Image from "next/image"

import { getAddChainParameters } from "@chains"
import { metaMask } from "@connectors/metaMask"
import { walletConnect } from "@connectors/walletConnect"

export default function ConnectorModal({
  isOpen = false,
  onClose,
  desiredChain,
}: {
  isOpen: boolean
  onClose: () => void
  desiredChain: number
}) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={onClose}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-70" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="my-8 inline-block w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                Connect Wallet
              </Dialog.Title>

              <div className="mt-8 space-y-2">
                <ConnectButton
                  label="MetaMask"
                  image="/connectors/metamask.svg"
                  onClick={async () => {
                    await metaMask.activate(getAddChainParameters(desiredChain))
                    onClose()
                  }}
                />

                <ConnectButton
                  label="WalletConnect"
                  image="/connectors/walletconnect.svg"
                  onClick={async () => {
                    await walletConnect.activate(desiredChain)
                    onClose()
                  }}
                />
              </div>

              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-800 transition hover:text-gray-600"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

function ConnectButton({
  label,
  image,
  onClick,
}: {
  label: string
  image: string
  onClick: () => void
}) {
  return (
    <button
      className="focus-visible:bg-dark2-700 flex w-full justify-between rounded-md bg-gray-100 px-4 py-3 transition hover:bg-gray-200 focus-visible:outline-none"
      key={label}
      onClick={onClick}
    >
      <span className="text-lg font-semibold text-gray-800">{label}</span>
      <Image src={image} width={32} priority height={32} alt="MetaMask" />
    </button>
  )
}
