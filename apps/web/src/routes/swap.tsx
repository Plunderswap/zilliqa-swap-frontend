import { createFileRoute } from '@tanstack/react-router'
import Page from '../pages/swap'
import { legacyPage } from './-page'

export const Route = createFileRoute('/swap')({ component: legacyPage(Page) })
