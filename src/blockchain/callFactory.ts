import { decodeEventLog } from 'viem'
import type { PublicClient, WalletClient } from 'viem'
import ABIJson from '../abis/factory.json'

const CONTRACT_ADDRESS = '0x83448DC5A6Ac6975204B0409D3374F0F65f716B9'

type AbiItem = {
  anonymous?: boolean
  inputs?: { indexed: boolean; internalType: string; name: string; type: string }[]
  name: string
  type: string
  stateMutability?: string
  outputs?: { internalType: string; name: string; type: string }[]
}

const ABI = ABIJson as AbiItem[]

type CreateParams = {
  issuer: `0x${string}`
  duration: bigint
  maxSecondaryAccounts: bigint
  maxModifications: bigint
  publicClient: PublicClient
  walletClient: WalletClient
}

export async function createSubscriptionManager({
  issuer,
  duration,
  maxSecondaryAccounts,
  maxModifications,
  publicClient,
  walletClient,
}: CreateParams): Promise<`0x${string}`> {
  try {
    const hash = await walletClient.writeContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'createSubscriptionManager',
      args: [issuer, duration, maxSecondaryAccounts, maxModifications],
      chain: null,
      account: walletClient.account ?? null,
    })

    const receipt = await publicClient.waitForTransactionReceipt({ hash })

    for (const log of receipt.logs) {
      try {
        const decoded = decodeEventLog({
          abi: ABI,
          data: log.data,
          topics: log.topics,
        })

        if (decoded.eventName === 'ManagerCreated') {
          if (!decoded.args || !('manager' in decoded.args))
            throw new Error('Manager property missing in decoded args')

          return decoded.args.manager as `0x${string}`
        }
      } catch {
        continue
      }
    }

    throw new Error('SubscriptionManagerCreated event not found')
  } catch (err: unknown) {
    let message = 'Unknown error'
    if (err instanceof Error) message = err.message
    else if (typeof err === 'object' && err !== null && 'shortMessage' in err)
      message = (err as any).shortMessage

    throw new Error(message)
  }
}
