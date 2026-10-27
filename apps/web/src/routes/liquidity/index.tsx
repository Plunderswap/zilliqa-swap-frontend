import { createFileRoute } from '@tanstack/react-router'
import Page from '../../pages/liquidity'
import { legacyPage } from '../-page'

export const Route = createFileRoute('/liquidity/')({ component: legacyPage(Page) })
