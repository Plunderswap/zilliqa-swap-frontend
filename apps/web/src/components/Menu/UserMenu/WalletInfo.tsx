import { ChainId } from '@dex/chains'
import { useTranslation } from '@dex/localization'
import { WNATIVE } from '@dex/sdk'
import { Box, Button, CopyAddress, Flex, FlexGap, InjectedModalProps, LinkExternal, Skeleton, Text } from '@dex/uikit'
import { ChainLogo } from 'components/Logo/ChainLogo'
import { FetchStatus } from 'config/constants/types'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useAuth from 'hooks/useAuth'
import useNativeCurrency from 'hooks/useNativeCurrency'
import useTokenBalance from 'hooks/useTokenBalance'
import { useDomainNameForAddress } from 'hooks/useDomain'

import { formatBigInt, getFullDisplayBalance } from '@dex/utils/formatBalance'
import { getBlockExploreLink, getBlockExploreName } from 'utils'
import type { Address } from 'viem'
import { useBalance } from 'wagmi'

const COLORS = {
  ETH: '#627EEA',
}

interface WalletInfoProps {
  hasLowNativeBalance: boolean
  switchView: (newIndex: number) => void
  onDismiss: InjectedModalProps['onDismiss']
}

const WalletInfo: React.FC<WalletInfoProps> = ({ onDismiss }) => {
  const { t } = useTranslation()
  const { account, chainId, chain } = useActiveWeb3React()
  const { domainName } = useDomainNameForAddress(account ?? '')
  const nativeBalance = useBalance({ address: account ?? undefined })
  const native = useNativeCurrency()
  const wNativeToken = WNATIVE[chainId as ChainId]
  const { balance: wNativeBalance, fetchStatus: wNativeFetchStatus } = useTokenBalance(wNativeToken?.address as Address)
  const { logout } = useAuth()

  const handleLogout = () => {
    onDismiss?.()
    logout()
  }
  return (
    <>
      <Text color="secondary" fontSize="12px" textTransform="uppercase" fontWeight="bold" mb="8px">
        {t('Your Address')}
      </Text>
      <FlexGap flexDirection="column" mb="24px" gap="8px">
        <CopyAddress tooltipMessage={t('Copied')} account={account ?? undefined} />
        {domainName ? <Text color="textSubtle">{domainName}</Text> : null}
      </FlexGap>
      {chain && (
        <Box mb="12px">
          <Flex justifyContent="space-between" alignItems="center" mb="8px">
            <Flex bg={COLORS.ETH} borderRadius="16px" pl="4px" pr="8px" py="2px">
              <ChainLogo chainId={chain.id} />
              <Text color="white" ml="4px">
                {chain.name}
              </Text>
            </Flex>
            <LinkExternal href={getBlockExploreLink(account, 'address', chainId)}>
              {getBlockExploreName(chainId)}
            </LinkExternal>
          </Flex>
          <Flex alignItems="center" justifyContent="space-between">
            <Text color="textSubtle">
              {native.symbol} {t('Balance')}
            </Text>
            {!nativeBalance.isFetched ? (
              <Skeleton height="22px" width="60px" />
            ) : (
              <Flex>
                <Text color="text">{formatBigInt(nativeBalance?.data?.value ?? 0n, 6)}</Text>
              </Flex>
            )}
          </Flex>
          {wNativeBalance && wNativeBalance.gt(0) && (
            <Flex alignItems="center" justifyContent="space-between">
              <Text color="textSubtle">
                {wNativeToken?.symbol} {t('Balance')}
              </Text>
              {wNativeFetchStatus !== FetchStatus.Fetched ? (
                <Skeleton height="22px" width="60px" />
              ) : (
                wNativeToken?.decimals && (
                  <Text>{getFullDisplayBalance(wNativeBalance, wNativeToken?.decimals, 6)}</Text>
                )
              )}
            </Flex>
          )}
        </Box>
      )}

      <Button variant="secondary" width="100%" minHeight={48} onClick={handleLogout}>
        {t('Disconnect Wallet')}
      </Button>
    </>
  )
}

export default WalletInfo
