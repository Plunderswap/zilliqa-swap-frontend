import { createFileRoute } from '@tanstack/react-router'
import Page from '../pages/451'
import { legacyPage } from './-page'

export const Route = createFileRoute('/451')({ component: legacyPage(Page) })
