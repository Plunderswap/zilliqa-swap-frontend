import type { Hash, TransactionReceipt } from 'viem'

export type SendTransactionResult = { hash: Hash }
export type WaitForTransactionResult = TransactionReceipt
