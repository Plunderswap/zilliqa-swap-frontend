import { ModalV2 } from '@dex/uikit'
import { ZILLIQA_CHAINS } from 'config/constants/supportChains'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { atom, useAtom } from 'jotai'
import dynamic from 'components/Dynamic'
import { useMemo } from 'react'
import { viemClients } from 'utils/viem'
import { CHAIN_IDS } from 'utils/wagmi'

export const hideWrongNetworkModalAtom = atom(false)

const WrongNetworkModal = dynamic(() => import('./WrongNetworkModal').then((mod) => mod.WrongNetworkModal), {
  ssr: false,
})
const UnsupportedNetworkModal = dynamic(
  () => import('./UnsupportedNetworkModal').then((mod) => mod.UnsupportedNetworkModal),
  { ssr: false },
)

export const NetworkModal = ({ pageSupportedChains = ZILLIQA_CHAINS }: { pageSupportedChains?: number[] }) => {
  const { chainId, chain, isWrongNetwork } = useActiveWeb3React()
  const [dismissWrongNetwork, setDismissWrongNetwork] = useAtom(hideWrongNetworkModalAtom)

  const isPageNotSupported = useMemo(
    () => Boolean(pageSupportedChains.length) && chainId && !pageSupportedChains.includes(chainId),
    [chainId, pageSupportedChains],
  )

  if (pageSupportedChains?.length === 0) return null // open to all chains

  if (isWrongNetwork && !dismissWrongNetwork && !isPageNotSupported) {
    const currentChain = Object.values(viemClients)
      .map((client) => client.chain)
      .find((c) => c?.id === chainId)
    if (!currentChain) return null
    return (
      <ModalV2 isOpen={isWrongNetwork} closeOnOverlayClick onDismiss={() => setDismissWrongNetwork(true)}>
        <WrongNetworkModal currentChain={currentChain} onDismiss={() => setDismissWrongNetwork(true)} />
      </ModalV2>
    )
  }

  if ((chain?.unsupported ?? false) || isPageNotSupported) {
    return (
      <ModalV2 isOpen closeOnOverlayClick={false}>
        <UnsupportedNetworkModal pageSupportedChains={pageSupportedChains?.length ? pageSupportedChains : CHAIN_IDS} />
      </ModalV2>
    )
  }

  return null
}
