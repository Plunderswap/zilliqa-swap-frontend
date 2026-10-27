import { AppShell, PageComponent } from 'components/AppShell'

export const legacyPage = (Component: PageComponent) => () => <AppShell Component={Component} />
