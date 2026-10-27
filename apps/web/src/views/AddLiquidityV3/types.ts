import { FeeAmount } from '@dex/v3-sdk'

export interface ZoomLevels {
  initialMin: number
  initialMax: number
  min: number
  max: number
}

export const ZOOM_LEVELS: Record<FeeAmount, ZoomLevels> = {
  [FeeAmount.LOWEST]: { initialMin: 0.999, initialMax: 1.001, min: 0.00001, max: 1.5 },
  [FeeAmount.LOW]: { initialMin: 0.999, initialMax: 1.001, min: 0.00001, max: 1.5 },
  [FeeAmount.MEDIUM]: { initialMin: 0.5, initialMax: 2, min: 0.00001, max: 20 },
  [FeeAmount.HIGH]: { initialMin: 0.5, initialMax: 2, min: 0.00001, max: 20 },
}

export enum SELECTOR_TYPE {
  V3,
  V2,
}

interface HandleFeePoolSelectArgs {
  type: SELECTOR_TYPE
  feeAmount?: FeeAmount
}

export const QUICK_ACTION_CONFIGS: Record<FeeAmount, { [percentage: number]: ZoomLevels }> = {
  [FeeAmount.LOWEST]: {
    0.1: {
      initialMin: 0.999,
      initialMax: 1.001,
      min: 0.00001,
      max: 1.5,
    },
    0.5: {
      initialMin: 0.995,
      initialMax: 1.005,
      min: 0.00001,
      max: 1.5,
    },
    1: {
      initialMin: 0.99,
      initialMax: 1.01,
      min: 0.00001,
      max: 1.5,
    },
  },
  [FeeAmount.LOW]: {
    5: {
      initialMin: 0.95,
      initialMax: 1.054,
      min: 0.00001,
      max: 1.5,
    },
    10: {
      initialMin: 0.9,
      initialMax: 1.11,
      min: 0.00001,
      max: 1.5,
    },
    20: {
      initialMin: 0.8,
      initialMax: 1.25,
      min: 0.00001,
      max: 1.5,
    },
  },
  [FeeAmount.MEDIUM]: {
    10: {
      initialMin: 0.9,
      initialMax: 1.11,
      min: 0.00001,
      max: 20,
    },
    20: {
      initialMin: 0.8,
      initialMax: 1.25,
      min: 0.00001,
      max: 20,
    },
    50: ZOOM_LEVELS[FeeAmount.MEDIUM],
  },
  [FeeAmount.HIGH]: {
    10: {
      initialMin: 0.9,
      initialMax: 1.1,
      min: 0.00001,
      max: 1.5,
    },
    20: {
      initialMin: 0.8,
      initialMax: 1.25,
      min: 0.00001,
      max: 20,
    },
    50: ZOOM_LEVELS[FeeAmount.HIGH],
  },
}

export type HandleFeePoolSelectFn = (arg: HandleFeePoolSelectArgs) => void
