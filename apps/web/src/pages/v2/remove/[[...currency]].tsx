import { useCurrency } from 'hooks/Tokens'
import { useRouter } from 'utils/router'
import { CHAIN_IDS } from 'utils/wagmi'
import RemoveLiquidity, { RemoveLiquidityV2Layout } from 'views/RemoveLiquidity'
import RemoveLiquidityV2FormProvider from 'views/RemoveLiquidity/RemoveLiquidityV2FormProvider'

const RemoveLiquidityPage = () => {
  const router = useRouter()

  const [currencyIdA, currencyIdB] = router.query.currency || []

  const [currencyA, currencyB] = [useCurrency(currencyIdA) ?? undefined, useCurrency(currencyIdB) ?? undefined]

  const props = {
    currencyIdA,
    currencyIdB,
    currencyA,
    currencyB,
  }

  return (
    <RemoveLiquidityV2FormProvider>
      <RemoveLiquidityV2Layout {...props}>
        <RemoveLiquidity {...props} />
      </RemoveLiquidityV2Layout>
    </RemoveLiquidityV2FormProvider>
  )
}

RemoveLiquidityPage.chains = CHAIN_IDS

export default RemoveLiquidityPage
