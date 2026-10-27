import { USDC } from '@dex/tokens'
import { useCurrency } from 'hooks/Tokens'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useRouter } from 'utils/router'
import { CHAIN_IDS } from 'utils/wagmi'
import IncreaseLiquidityV3 from 'views/AddLiquidityV3/IncreaseLiquidityV3'
import LiquidityFormProvider from 'views/AddLiquidityV3/formViews/V3FormView/form/LiquidityFormProvider'

const IncreaseLiquidityPage = () => {
  const router = useRouter()
  const { chainId } = useActiveChainId()

  const native = useNativeCurrency()

  const [currencyIdA, currencyIdB] = router.query.currency || [native.symbol, chainId && USDC[chainId]?.address]

  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  return (
    <LiquidityFormProvider>
      <IncreaseLiquidityV3 currencyA={currencyA} currencyB={currencyB} />
    </LiquidityFormProvider>
  )
}

IncreaseLiquidityPage.chains = CHAIN_IDS

export default IncreaseLiquidityPage
