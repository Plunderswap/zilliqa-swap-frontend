import { PropsWithChildren, memo } from 'react'
import { Column } from '@dex/uikit'

import { Wrapper } from '../../components/styleds'

export const FormContainer = memo(function FormContainerComponent({ children }: PropsWithChildren) {
  return (
    <Wrapper id="swap-page" style={{ minHeight: '412px' }}>
      <Column gap="sm">{children}</Column>
    </Wrapper>
  )
})
