import { useTranslation } from '@dex/localization'
import { Currency, Token } from '@dex/sdk'
import { WrappedTokenInfo } from '@dex/token-lists'
import { AutoColumn, Button, Checkbox, ErrorIcon, Flex, Grid, Link, Message, Tag, Text } from '@dex/uikit'
import truncateHash from '@dex/utils/truncateHash'
import { ListLogo } from '@dex/widgets-internal'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useState } from 'react'
import { useCombinedInactiveList } from 'state/lists/hooks'
import { useAddUserToken } from 'state/user/hooks'
import { getBlockExploreLink, getBlockExploreName } from 'utils'
import { chains } from 'utils/wagmi'

interface ImportProps {
  tokens: Token[]
  handleCurrencySelect?: (currency: Currency) => void
}

function ImportToken({ tokens, handleCurrencySelect }: ImportProps) {
  const { chainId } = useActiveChainId()

  const { t } = useTranslation()

  const [confirmed, setConfirmed] = useState(false)

  const addToken = useAddUserToken()

  // use for showing import source on inactive tokens
  const inactiveTokenList = useCombinedInactiveList()

  return (
    <AutoColumn gap="lg">
      <Message variant="warning">
        <Text>
          {t(
            'Anyone can create tokens on %network% with any name, including creating fake versions of existing tokens and tokens that claim to represent projects that do not have a token.',
            {
              network: chains.find((c) => c.id === chainId)?.name,
            },
          )}
          <br />
          <br />
          <b>{t('If you purchase a fraudulent token, you may be exposed to permanent loss of funds.')}</b>
        </Text>
      </Message>

      {tokens.map((token) => {
        const list = token.chainId && inactiveTokenList?.[token.chainId]?.[token.address]?.list
        const address = token.address ? `${truncateHash(token.address)}` : null
        return (
          <Flex
            flexDirection={['column', 'column', 'row']}
            key={token.address}
            alignItems={['left', 'left', 'center']}
            justifyContent="space-between"
          >
            <Grid gridTemplateRows="1fr 1fr 1fr 1fr" gridGap="4px">
              {list !== undefined ? (
                <Tag
                  variant="success"
                  outline
                  scale="sm"
                  startIcon={list.logoURI && <ListLogo logoURI={list.logoURI} size="12px" />}
                >
                  {t('via')} {list.name}
                </Tag>
              ) : (
                <Tag variant="failure" outline scale="sm" startIcon={<ErrorIcon color="failure" />}>
                  {t('Unknown Source')}
                </Tag>
              )}
              <Flex alignItems="center">
                <Text mr="8px">{token.name}</Text>
                <Text>({token.symbol})</Text>
              </Flex>
              {!!token.chainId && (
                <>
                  <Text mr="4px">{address}</Text>
                  <Link href={getBlockExploreLink(token.address, 'address', token.chainId)} external>
                    (
                    {t('View on %site%', {
                      site: getBlockExploreName(token.chainId),
                    })}
                    )
                  </Link>
                </>
              )}
            </Grid>
          </Flex>
        )
      })}

      <Grid gridTemplateRows="1fr 1fr" gridGap="4px">
        <Flex alignItems="center" onClick={() => setConfirmed(!confirmed)}>
          <Checkbox
            scale="sm"
            name="confirmed"
            type="checkbox"
            checked={confirmed}
            onChange={() => setConfirmed(!confirmed)}
          />
          <Text ml="8px" style={{ userSelect: 'none' }}>
            {t('I understand')}
          </Text>
        </Flex>
        <Button
          variant="danger"
          disabled={!confirmed}
          onClick={() => {
            tokens.forEach((token) => {
              const inactiveToken = chainId && inactiveTokenList?.[token.chainId]?.[token.address]
              let tokenToAdd = token
              if (inactiveToken) {
                tokenToAdd = new WrappedTokenInfo({
                  ...token,
                  logoURI: inactiveToken.token.logoURI,
                  name: token.name || inactiveToken.token.name,
                })
              }
              addToken(tokenToAdd)
            })
            if (handleCurrencySelect) {
              handleCurrencySelect(tokens[0])
            }
          }}
          className=".token-dismiss-button"
        >
          {t('Import')}
        </Button>
      </Grid>
    </AutoColumn>
  )
}

export default ImportToken
