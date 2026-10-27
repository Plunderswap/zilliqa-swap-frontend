/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
import { TokenList } from '@dex/token-lists'
import uriToHttp from '@dex/utils/uriToHttp'
import remove from 'lodash/remove'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import schema from '../schema/tokenlist.schema.json'

export const tokenListValidator = addFormats(new Ajv({ allErrors: true })).compile(schema)

/**
 * Contains the logic for resolving a list URL to a validated token list
 * @param listUrl list url
 */
export default async function getTokenList(listUrl: string): Promise<TokenList> {
  const urls: string[] = uriToHttp(listUrl)

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]
    const isLast = i === urls.length - 1
    let response
    try {
      response = await fetch(url)
    } catch (error) {
      console.error('Failed to fetch list', listUrl, error)
      if (isLast) throw new Error(`Failed to download list ${listUrl}`)
      continue
    }

    if (!response.ok) {
      if (isLast) throw new Error(`Failed to download list ${listUrl}`)
      continue
    }

    const json: unknown = await response.json()
    if (typeof json !== 'object' || json === null) {
      throw new Error(`Token list failed validation: expected an object`)
    }
    if ('tokens' in json && Array.isArray(json.tokens)) {
      remove(json.tokens, (token: unknown) => {
        if (typeof token !== 'object' || token === null || !('symbol' in token)) return true
        return typeof token.symbol !== 'string' || token.symbol.length === 0
      })
    }
    if (!tokenListValidator(json)) {
      const validationErrors: string =
        tokenListValidator.errors?.reduce<string>((memo, error) => {
          const add = `${(error as any).dataPath} ${error.message ?? ''}`
          return memo.length > 0 ? `${memo}; ${add}` : `${add}`
        }, '') ?? 'unknown error'
      throw new Error(`Token list failed validation: ${validationErrors}`)
    }
    return json as unknown as TokenList
  }
  throw new Error('Unrecognized list URL protocol.')
}
