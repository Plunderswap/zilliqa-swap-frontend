import { describe, it, expect } from 'vitest'
import uriToHttp from './uriToHttp'

describe('uriToHttp', () => {
  it('returns .eth.link for ens names', () => {
    expect(uriToHttp('t2crtokens.eth')).toEqual([])
  })
  it('returns https first for http', () => {
    expect(uriToHttp('http://test.com')).toEqual(['https://test.com', 'http://test.com'])
  })
  it('returns https for https', () => {
    expect(uriToHttp('https://test.com')).toEqual(['https://test.com'])
  })
  it('returns ipfs gateways for ipfs:// urls', () => {
    expect(uriToHttp('ipfs://QmV8AfDE8GFSGQvt3vck8EwAzsPuNTmtP8VcQJE3qxRPaZ')).toEqual([
      'https://cloudflare-ipfs.com/ipfs/QmV8AfDE8GFSGQvt3vck8EwAzsPuNTmtP8VcQJE3qxRPaZ/',
      'https://ipfs.io/ipfs/QmV8AfDE8GFSGQvt3vck8EwAzsPuNTmtP8VcQJE3qxRPaZ/',
    ])
  })
  it('returns ipns gateways for ipns:// urls', () => {
    expect(uriToHttp('ipns://app.uniswap.org')).toEqual([
      'https://cloudflare-ipfs.com/ipns/app.uniswap.org/',
      'https://ipfs.io/ipns/app.uniswap.org/',
    ])
  })
  it('returns same-origin paths as-is', () => {
    expect(uriToHttp('/images/tokens/0xabc.png')).toEqual(['/images/tokens/0xabc.png'])
  })
  it('does not treat protocol-relative urls as same-origin', () => {
    expect(uriToHttp('//test.com/logo.png')).toEqual([])
  })
  it('returns empty array for invalid scheme', () => {
    expect(uriToHttp('blah:test')).toEqual([])
  })
})
