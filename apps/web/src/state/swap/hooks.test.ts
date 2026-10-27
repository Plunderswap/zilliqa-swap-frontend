/* eslint-disable no-var */
/* eslint-disable vars-on-top */
import { ChainId } from '@dex/chains'
import { Currency, Token } from '@dex/swap-sdk-core'
import { renderHook } from '@testing-library/react'
import { useCurrency } from 'hooks/Tokens'
import { useAtom } from 'jotai'
import { parse } from 'querystring'
import { useEffect } from 'react'
import { swapReducerAtom } from 'state/swap/reducer'
import { createReduxWrapper } from 'testUtils'
import { Mock, vi } from 'vitest'
import { Field, replaceSwapState } from './actions'
import { queryParametersToSwapState, useDerivedSwapInfo, useSwapState } from './hooks'

describe('hooks', () => {
  describe('#queryParametersToSwapState', () => {
    test('ZIL to token', () => {
      expect(
        queryParametersToSwapState(
          parse(
            'inputCurrency=ZIL&outputCurrency=0xe59f97fac09ee00aeef320485ee45d5ccfbbc1e9&exactAmount=20.5&exactField=outPUT',
          ),
        ),
      ).toEqual({
        [Field.OUTPUT]: { currencyId: '0xe59f97Fac09ee00AEEF320485ee45D5CcfbBC1E9' },
        [Field.INPUT]: { currencyId: 'ZIL' },
        typedValue: '20.5',
        independentField: Field.OUTPUT,
        recipient: null,
      })
    })

    test('should return Native by default', () => {
      expect(queryParametersToSwapState(parse(''))).toEqual({
        [Field.OUTPUT]: { currencyId: undefined },
        [Field.INPUT]: { currencyId: 'ZIL' },
        typedValue: '',
        independentField: Field.INPUT,
        recipient: null,
      })
    })

    test('does not duplicate BNB for invalid output token', () => {
      expect(queryParametersToSwapState(parse('outputCurrency=invalid'), 'BNB')).toEqual({
        [Field.INPUT]: { currencyId: '' },
        [Field.OUTPUT]: { currencyId: 'BNB' },
        typedValue: '',
        independentField: Field.INPUT,
        recipient: null,
      })
    })

    test('output BNB only', () => {
      expect(queryParametersToSwapState(parse('outputCurrency=bnb&exactAmount=20.5'), 'BNB')).toEqual({
        [Field.OUTPUT]: { currencyId: 'BNB' },
        [Field.INPUT]: { currencyId: '' },
        typedValue: '20.5',
        independentField: Field.INPUT,
        recipient: null,
      })
    })

    test('invalid recipient', () => {
      expect(queryParametersToSwapState(parse('outputCurrency=BNB&exactAmount=20.5&recipient=abc'), 'BNB')).toEqual({
        [Field.OUTPUT]: { currencyId: 'BNB' },
        [Field.INPUT]: { currencyId: '' },
        typedValue: '20.5',
        independentField: Field.INPUT,
        recipient: null,
      })
    })

    test('valid recipient', () => {
      expect(
        queryParametersToSwapState(
          parse('outputCurrency=BNB&exactAmount=20.5&recipient=0x0fF2D1eFd7A57B7562b2bf27F3f37899dB27F4a5'),
          'BNB',
        ),
      ).toEqual({
        [Field.OUTPUT]: { currencyId: 'BNB' },
        [Field.INPUT]: { currencyId: '' },
        typedValue: '20.5',
        independentField: Field.INPUT,
        recipient: '0x0fF2D1eFd7A57B7562b2bf27F3f37899dB27F4a5',
      })
    })
  })
})

// weird bug on jest Reference Error, must use `var` here
var mockUseActiveWeb3React: Mock

vi.mock('../../hooks/useActiveWeb3React', () => {
  mockUseActiveWeb3React = vi.fn().mockReturnValue({
    chainId: ChainId.ZILLIQA,
  })
  return {
    __esModule: true,
    default: mockUseActiveWeb3React,
  }
})

var mockAccount: Mock

vi.mock('wagmi', async () => {
  mockAccount = vi.fn().mockReturnValue({})
  const original = await vi.importActual('wagmi') // Step 2.
  return {
    // @ts-ignore
    ...original,
    useAccount: mockAccount,
  }
})

describe('#useDerivedSwapInfo', () => {
  it('should show Login Error', async () => {
    const { result, rerender } = renderHook(
      () => {
        const {
          independentField,
          typedValue,
          recipient,
          [Field.INPUT]: { currencyId: inputCurrencyId },
          [Field.OUTPUT]: { currencyId: outputCurrencyId },
        } = useSwapState()
        const inputCurrency = useCurrency(inputCurrencyId)
        const outputCurrency = useCurrency(outputCurrencyId)
        return useDerivedSwapInfo(
          independentField,
          typedValue,
          inputCurrency as Currency,
          outputCurrency as Currency,
          recipient || '',
        )
      },
      { wrapper: createReduxWrapper() },
    )
    expect(result.current.inputError).toBe('Connect Wallet')

    mockAccount.mockReturnValue({ address: '0x33edFBc4934baACc78f4d317bc07639119dd3e78' })
    rerender()

    expect(result.current.inputError).toBe('Enter an amount')
    mockAccount.mockClear()
  })

  it('should show [Enter a recipient] Error', async () => {
    mockAccount.mockReturnValue({ address: '0x33edFBc4934baACc78f4d317bc07639119dd3e78' })
    const inputCurrency = new Token(ChainId.ZILLIQA, '0xe59f97Fac09ee00AEEF320485ee45D5CcfbBC1E9', 6, 'zUSDC')
    const outputCurrency = new Token(ChainId.ZILLIQA, '0x2274005778063684fbB1BfA96a2b725dC37D75f9', 6, 'zUSDT')
    const { result } = renderHook(() => useDerivedSwapInfo(Field.INPUT, '0.11', inputCurrency, outputCurrency, ''), {
      wrapper: createReduxWrapper(),
    })

    expect(result.current.inputError).toBe('Enter a recipient')
    mockAccount.mockClear()
  })

  it('should return undefined when no pair', async () => {
    const { result } = renderHook(
      () => {
        const [, dispatch] = useAtom(swapReducerAtom)
        useEffect(() => {
          dispatch(
            replaceSwapState({
              field: Field.INPUT,
              typedValue: '',
              inputCurrencyId: '',
              outputCurrencyId: '',
              recipient: null,
            }),
          )
        }, [dispatch])
        const {
          independentField,
          typedValue,
          recipient,
          [Field.INPUT]: { currencyId: inputCurrencyId },
          [Field.OUTPUT]: { currencyId: outputCurrencyId },
        } = useSwapState()
        const inputCurrency = useCurrency(inputCurrencyId)
        const outputCurrency = useCurrency(outputCurrencyId)
        const swapInfo = useDerivedSwapInfo(
          independentField,
          typedValue,
          inputCurrency as Currency,
          outputCurrency as Currency,
          recipient || '',
        )
        return {
          swapInfo,
        }
      },
      {
        wrapper: createReduxWrapper(),
      },
    )

    expect(result.current.swapInfo.currencies.INPUT).toBeUndefined()
    expect(result.current.swapInfo.currencies.OUTPUT).toBeUndefined()
    expect(result.current.swapInfo.currencyBalances.INPUT).toBeUndefined()
    expect(result.current.swapInfo.currencyBalances.OUTPUT).toBeUndefined()
    expect(result.current.swapInfo.v2Trade).toBeUndefined()
    expect(result.current.swapInfo.parsedAmount).toBeUndefined()
  })
})
