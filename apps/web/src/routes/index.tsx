import { createFileRoute } from '@tanstack/react-router'
import Page from '../pages/index'
import { legacyPage } from './-page'

export const Route = createFileRoute('/')({ component: legacyPage(Page) })
