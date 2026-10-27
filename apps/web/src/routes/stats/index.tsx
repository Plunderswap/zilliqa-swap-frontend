import { createFileRoute } from '@tanstack/react-router'
import Page from '../../pages/stats'
import { legacyPage } from '../-page'

export const Route = createFileRoute('/stats/')({ component: legacyPage(Page) })
