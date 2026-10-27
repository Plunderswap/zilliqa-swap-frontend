import { NotFound } from '@dex/uikit'
import { Seo } from 'components/Seo'
import Link from 'components/Link'

const NotFoundPage = () => (
  <NotFound LinkComp={Link}>
    <Seo title="404" noindex />
  </NotFound>
)

NotFoundPage.chains = []

export default NotFoundPage
