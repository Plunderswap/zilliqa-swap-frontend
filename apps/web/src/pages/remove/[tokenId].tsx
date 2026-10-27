import { CHAIN_IDS } from 'utils/wagmi'
import RemoveLiquidityFormProvider from 'views/RemoveLiquidity/form/RemoveLiquidityFormProvider'
import RemoveLiquidity from 'views/RemoveLiquidity/RemoveLiquidityV3'

const RemoveLiquidityPage = () => {
  return (
    <RemoveLiquidityFormProvider>
      <RemoveLiquidity />
    </RemoveLiquidityFormProvider>
  )
}

RemoveLiquidityPage.chains = CHAIN_IDS

export default RemoveLiquidityPage
