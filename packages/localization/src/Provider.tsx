import React, { createContext } from 'react'
import { EN } from './config/languages'
import { ContextApi, TranslateFunction } from './types'

const translate: TranslateFunction = (key, data) => {
  if (!data) return key

  return key.replace(/%(\S+?)%/g, (match, dataKey) => {
    const value = data[dataKey]
    return value === undefined || value === null ? match : String(value)
  })
}

const contextValue: ContextApi = {
  currentLanguage: EN,
  t: translate,
}

export const LanguageContext = createContext<ContextApi | undefined>(undefined)

export const LanguageProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>
}
