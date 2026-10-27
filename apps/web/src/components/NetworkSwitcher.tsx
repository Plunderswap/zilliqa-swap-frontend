import { ChainId } from '@dex/chains'
import { useTranslation } from '@dex/localization'
import { NATIVE } from '@dex/sdk'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Box,
  Button,
  Flex,
  InfoIcon,
  Text,
  UserMenu,
  UserMenuDivider,
  UserMenuItem,
  useTooltip,
} from '@dex/uikit'
import { useActiveChainId, useLocalNetworkChain } from 'hooks/useActiveChainId'
import { useNetworkConnectorUpdater } from 'hooks/useActiveWeb3React'
import { useHover } from 'hooks/useHover'
import { useSessionChainId } from 'hooks/useSessionChainId'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'
import { useRouter } from 'utils/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useUserShowTestnet } from 'state/user/hooks/useUserShowTestnet'
import { chainNameConverter } from 'utils/chainNameConverter'
import { chains } from 'utils/wagmi'
import { useAccount } from 'wagmi'
import { ChainLogo } from './Logo/ChainLogo'

interface ExtendedWindowProvider {
  chainId?: string
  on: (event: string, callback: any) => void
  removeListener: (event: string, callback: any) => void
  isMetaMask?: boolean
  isTrust?: boolean
  isTokenPocket?: boolean
  isCoinbaseWallet?: boolean
  isZilPay?: boolean
  isTorch?: boolean
  providers?: ExtendedWindowProvider[]
}

const NetworkSelect = ({ switchNetwork, chainId }) => {
  const { t } = useTranslation()
  const [showTestnet] = useUserShowTestnet()
  const [lastSelectedChainId, setLastSelectedChainId] = useState<number | null>(null)

  const handleNetworkSwitch = useCallback(
    async (targetChainId: number) => {
      if (targetChainId === chainId) return

      try {
        setLastSelectedChainId(targetChainId)
        await switchNetwork(targetChainId)
      } catch (error) {
        console.error('Failed to switch network:', error)
      }
    },
    [chainId, switchNetwork],
  )

  useEffect(() => {
    if (!lastSelectedChainId) return undefined

    const provider = window.ethereum as ExtendedWindowProvider | undefined

    if (provider) {
      const handleChainChanged = (hexChainId: string) => {
        const newChainId = parseInt(hexChainId, 16)
        if (newChainId === lastSelectedChainId) {
          setLastSelectedChainId(null)
        }
      }

      provider.on('chainChanged', handleChainChanged)

      const checkForNetworkChange = setInterval(() => {
        const currentProvider = window.ethereum as ExtendedWindowProvider | undefined
        if (currentProvider?.chainId) {
          const currentChainId = parseInt(currentProvider.chainId, 16)
          if (currentChainId === lastSelectedChainId) {
            setLastSelectedChainId(null)
            window.location.reload()
          }
        }
      }, 1000)

      return () => {
        provider.removeListener('chainChanged', handleChainChanged)
        clearInterval(checkForNetworkChange)
      }
    }

    const mobileTimeout = setTimeout(() => {
      if (lastSelectedChainId) {
        window.location.reload()
      }
    }, 5000)

    return () => clearTimeout(mobileTimeout)
  }, [lastSelectedChainId])

  return (
    <>
      <Box px="16px" py="8px">
        <Text color="textSubtle">{t('Select a Network')}</Text>
      </Box>
      <UserMenuDivider />
      {chains
        .filter((chain) => {
          if (chain.id === chainId) return true
          if ('testnet' in chain && chain.testnet) {
            return showTestnet
          }
          return true
        })
        .map((chain) => (
          <UserMenuItem
            key={chain.id}
            style={{ justifyContent: 'flex-start' }}
            onClick={() => chain.id !== chainId && handleNetworkSwitch(chain.id)}
          >
            <ChainLogo chainId={chain.id} />
            <Text color={chain.id === chainId ? 'secondary' : 'text'} bold={chain.id === chainId} pl="12px">
              {chainNameConverter(chain.name)}
            </Text>
          </UserMenuItem>
        ))}
    </>
  )
}

const WrongNetworkSelect = ({ switchNetwork, chainId }) => {
  const { t } = useTranslation()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t(
      "The URL you are accessing (Chain id: %chainId%) belongs to %network%; mismatching your wallet's network. Please switch the network to continue.",
      {
        chainId,
        network: chains.find((c) => c.id === chainId)?.name ?? 'Unknown network',
      },
    ),
    {
      placement: 'auto-start',
      hideTimeout: 0,
    },
  )
  const { chain } = useAccount()
  const localChainId = useLocalNetworkChain() || ChainId.ZILLIQA
  const [, setSessionChainId] = useSessionChainId()
  const [lastSelectedChainId, setLastSelectedChainId] = useState<number | null>(null)

  const localChainName = chains.find((c) => c.id === localChainId)?.name ?? 'Zilliqa'

  const [ref1, isHover] = useHover<HTMLButtonElement>()

  const handleNetworkSwitch = useCallback(
    async (targetChainId: number) => {
      try {
        setLastSelectedChainId(targetChainId)
        await switchNetwork(targetChainId)
      } catch (error) {
        console.error('Failed to switch network:', error)
      }
    },
    [switchNetwork],
  )

  useEffect(() => {
    if (!lastSelectedChainId) return undefined

    const provider = window.ethereum as ExtendedWindowProvider | undefined

    if (provider) {
      const handleChainChanged = (hexChainId: string) => {
        const newChainId = parseInt(hexChainId, 16)
        if (newChainId === lastSelectedChainId) {
          setLastSelectedChainId(null)
        }
      }

      provider.on('chainChanged', handleChainChanged)

      const checkForNetworkChange = setInterval(() => {
        const currentProvider = window.ethereum as ExtendedWindowProvider | undefined
        if (currentProvider?.chainId) {
          const currentChainId = parseInt(currentProvider.chainId, 16)
          if (currentChainId === lastSelectedChainId) {
            setLastSelectedChainId(null)
            window.location.reload()
          }
        }
      }, 1000)

      return () => {
        provider.removeListener('chainChanged', handleChainChanged)
        clearInterval(checkForNetworkChange)
      }
    }

    const mobileTimeout = setTimeout(() => {
      if (lastSelectedChainId) {
        window.location.reload()
      }
    }, 5000)

    return () => clearTimeout(mobileTimeout)
  }, [lastSelectedChainId])

  return (
    <>
      <Flex ref={targetRef} alignItems="center" px="16px" py="8px">
        <InfoIcon color="textSubtle" />
        <Text color="textSubtle" pl="6px">
          {t('Please switch network')}
        </Text>
      </Flex>
      {tooltipVisible && tooltip}
      <UserMenuDivider />
      {chain && (
        <UserMenuItem
          ref={ref1}
          onClick={() => {
            setSessionChainId(chain.id)
            handleNetworkSwitch(chain.id)
          }}
          style={{ justifyContent: 'flex-start' }}
        >
          <ChainLogo chainId={chain.id} />
          <Text color="secondary" bold pl="12px">
            {chainNameConverter(chain.name)}
          </Text>
        </UserMenuItem>
      )}
      <Box px="16px" pt="8px">
        {isHover ? <ArrowUpIcon color="text" /> : <ArrowDownIcon color="text" />}
      </Box>
      <UserMenuItem onClick={() => handleNetworkSwitch(localChainId)} style={{ justifyContent: 'flex-start' }}>
        <ChainLogo chainId={localChainId} />
        <Text pl="12px">{chainNameConverter(localChainName)}</Text>
      </UserMenuItem>
      <Button mx="16px" my="8px" scale="sm" onClick={() => handleNetworkSwitch(localChainId)}>
        {t('Switch network in wallet')}
      </Button>
    </>
  )
}

const SHORT_SYMBOL = {
  [ChainId.ZILLIQA]: 'ZIL',
  [ChainId.ZILLIQA_TESTNET]: 'tZIL',
} as const satisfies Partial<Record<ChainId, string>>

export const NetworkSwitcher = () => {
  const { t } = useTranslation()
  const { chainId, isWrongNetwork, isNotMatched } = useActiveChainId()
  const { pendingChainId, isLoading, canSwitch, switchNetworkAsync } = useSwitchNetwork()
  const router = useRouter()

  useNetworkConnectorUpdater()

  const foundChain = useMemo(
    () => chains.find((c) => c.id === (isLoading ? pendingChainId || chainId : chainId)),
    [isLoading, pendingChainId, chainId],
  )
  const symbol =
    (foundChain?.id ? (SHORT_SYMBOL[foundChain.id] ?? NATIVE[foundChain.id]?.symbol) : undefined) ??
    foundChain?.nativeCurrency?.symbol
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('Unable to switch network. Please try it on your wallet'),
    { placement: 'bottom' },
  )

  const cannotChangeNetwork = !canSwitch

  if (!chainId || router.pathname.includes('/info')) {
    return null
  }

  return (
    <Box ref={cannotChangeNetwork ? targetRef : null} height="100%">
      {cannotChangeNetwork && tooltipVisible && tooltip}
      <UserMenu
        mr="8px"
        placement="bottom"
        variant={isLoading ? 'pending' : isWrongNetwork ? 'danger' : 'default'}
        avatarSrc={`/images/chains/${chainId}.png`}
        disabled={cannotChangeNetwork}
        text={
          isLoading ? (
            t('Requesting')
          ) : isWrongNetwork ? (
            t('Network')
          ) : foundChain ? (
            <>
              <Box display={['none', null, null, null, null, 'block']}>{chainNameConverter(foundChain.name)}</Box>
              <Box display={['block', null, null, null, null, 'none']}>{symbol}</Box>
            </>
          ) : (
            t('Select a Network')
          )
        }
      >
        {() =>
          isNotMatched ? (
            <WrongNetworkSelect switchNetwork={switchNetworkAsync} chainId={chainId} />
          ) : (
            <NetworkSelect switchNetwork={switchNetworkAsync} chainId={chainId} />
          )
        }
      </UserMenu>
    </Box>
  )
}
