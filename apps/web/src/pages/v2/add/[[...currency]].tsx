import { USDC } from '@dex/tokens'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useRouter } from 'utils/router'
import { CHAIN_IDS } from 'utils/wagmi'
import AddLiquidityV2FormProvider from 'views/AddLiquidity/AddLiquidityV2FormProvider'
import { AddLiquidityV3Layout, UniversalAddLiquidity } from 'views/AddLiquidityV3'
import { SELECTOR_TYPE } from 'views/AddLiquidityV3/types'

const AddLiquidityPage = () => {
  const router = useRouter()
  const { chainId } = useActiveChainId()

  const native = useNativeCurrency()

  const [currencyIdA, currencyIdB] = router.query.currency || [native.symbol, chainId ? USDC[chainId]?.address : '']

  return (
    <AddLiquidityV2FormProvider>
      <AddLiquidityV3Layout preferredSelectType={SELECTOR_TYPE.V2}>
        <UniversalAddLiquidity
          preferredSelectType={SELECTOR_TYPE.V2}
          currencyIdA={currencyIdA}
          currencyIdB={currencyIdB}
        />
      </AddLiquidityV3Layout>
    </AddLiquidityV2FormProvider>
  )
}

AddLiquidityPage.chains = CHAIN_IDS

export default AddLiquidityPage
