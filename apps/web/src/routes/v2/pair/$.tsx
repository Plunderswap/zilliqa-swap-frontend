import { createFileRoute } from '@tanstack/react-router'
import Page from '../../../pages/v2/pair/[[...currency]]'
import { legacyPage } from '../../-page'

export const Route = createFileRoute('/v2/pair/$')({ component: legacyPage(Page) })
