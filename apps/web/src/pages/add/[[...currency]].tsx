import { useRouter } from 'utils/router'
import { useCallback } from 'react'
import { CHAIN_IDS } from 'utils/wagmi'
import AddLiquidityV2FormProvider from 'views/AddLiquidity/AddLiquidityV2FormProvider'
import { AddLiquidityV3Layout, UniversalAddLiquidity } from 'views/AddLiquidityV3'
import LiquidityFormProvider from 'views/AddLiquidityV3/formViews/V3FormView/form/LiquidityFormProvider'
import { useCurrencyParams } from 'views/AddLiquidityV3/hooks/useCurrencyParams'

const AddLiquidityPage = () => {
  const router = useRouter()

  const { currencyIdA, currencyIdB } = useCurrencyParams()

  const handleRefresh = useCallback(() => {
    router.replace(
      {
        pathname: router.pathname,
        query: {
          currency: [currencyIdA!, currencyIdB!],
        },
      },
      undefined,
      { shallow: true },
    )
  }, [router, currencyIdA, currencyIdB])

  return (
    <AddLiquidityV2FormProvider>
      <LiquidityFormProvider>
        <AddLiquidityV3Layout handleRefresh={handleRefresh}>
          <UniversalAddLiquidity currencyIdA={currencyIdA} currencyIdB={currencyIdB} />
        </AddLiquidityV3Layout>
      </LiquidityFormProvider>
    </AddLiquidityV2FormProvider>
  )
}

AddLiquidityPage.chains = CHAIN_IDS

export default AddLiquidityPage
