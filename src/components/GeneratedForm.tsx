import { useState, useMemo } from 'react'
import { useConnection, usePublicClient, useWalletClient } from 'wagmi'
import { createSubscriptionManager } from '../blockchain/callFactory'

/* ============================================================
   ======================= CONSTANTES =========================
   ============================================================ */

const MIN_DURATION = 1
const MAX_DURATION = 157_680_000 // 5 años en segundos

const MIN_SECONDARY_ACCOUNTS = 0
const MAX_SECONDARY_ACCOUNTS = 5

const MIN_MODIFICATIONS = 0
const MAX_MODIFICATIONS = 20

/* ============================================================
   ===================== COMPONENTE ===========================
   ============================================================ */

export default function GeneratedForm() {

  /* ------------------ Hooks Web3 ------------------ */

  const { isConnected } = useConnection()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  /* ------------------ Estados ------------------ */

  const [issuer, setIssuer] = useState('')
  const [duration, setDuration] = useState('')
  const [maxSecondaryAccounts, setMaxSecondaryAccounts] = useState('')
  const [maxModifications, setMaxModifications] = useState('')
  const [managerAddress, setManagerAddress] = useState<`0x${string}` | null>(null)

  const [transactionState, setTransactionState] =
    useState<'idle'|'pending'|'confirmed'|'error'>('idle')

  const [transactionError, setTransactionError] = useState<string | null>(null)

  /* ============================================================
     =================== VALIDACIONES ===========================
     ============================================================ */

  // ------------------ Validación dirección ------------------

  function isValidAddress(addr: string) {
    return /^0x[a-fA-F0-9]{40}$/.test(addr)
  }

  // ------------------ Validaciones dinámicas ------------------

  const errors = useMemo(() => {

    const errs: Record<string,string> = {}

    const durationNumber = Number(duration)
    const secondaryNumber = Number(maxSecondaryAccounts)
    const modificationsNumber = Number(maxModifications)

    if (issuer && !isValidAddress(issuer)) {
      errs.issuer = 'Invalid address'
    }

    if (
      duration &&
      (durationNumber < MIN_DURATION || durationNumber > MAX_DURATION)
    ) {
      errs.duration = `Duration must be ${MIN_DURATION}s-${MAX_DURATION}s`
    }

    if (
      maxSecondaryAccounts &&
      (
        secondaryNumber < MIN_SECONDARY_ACCOUNTS ||
        secondaryNumber > MAX_SECONDARY_ACCOUNTS
      )
    ) {
      errs.secondary =
        `Max Secondary Accounts must be ${MIN_SECONDARY_ACCOUNTS}-${MAX_SECONDARY_ACCOUNTS}`
    }

    if (
      maxSecondaryAccounts &&
      maxModifications &&
      (
        (secondaryNumber === 0 && modificationsNumber !== 0) ||
        (
          secondaryNumber > 0 &&
          (
            modificationsNumber < MIN_MODIFICATIONS ||
            modificationsNumber > MAX_MODIFICATIONS
          )
        )
      )
    ) {
      errs.modifications =
        secondaryNumber === 0
          ? 'Must be 0 when secondary accounts is 0'
          : `Max Modifications ${MIN_MODIFICATIONS}-${MAX_MODIFICATIONS}`
    }

    return errs

  }, [issuer, duration, maxSecondaryAccounts, maxModifications])

  // ------------------ Validación general formulario ------------------

  const isFormValid = useMemo(() => {
    return (
      Object.keys(errors).length === 0 &&
      issuer &&
      duration &&
      maxSecondaryAccounts &&
      maxModifications
    )
  }, [errors, issuer, duration, maxSecondaryAccounts, maxModifications])

  /* ============================================================
     ======================= SUBMIT =============================
     ============================================================ */

  async function submit(e: React.FormEvent<HTMLFormElement>) {

    e.preventDefault()

    if (!isFormValid || !publicClient || !walletClient) return

    setTransactionState('pending')
    setTransactionError(null)

    try {

      const manager = await createSubscriptionManager({
        issuer: issuer as `0x${string}`,
        duration: BigInt(Number(duration)),
        maxSecondaryAccounts: BigInt(Number(maxSecondaryAccounts)),
        maxModifications: BigInt(Number(maxModifications)),
        publicClient,
        walletClient,
      })

      setManagerAddress(manager)
      setTransactionState('confirmed')

      // Limpiar formulario solo en éxito
      setIssuer('')
      setDuration('')
      setMaxSecondaryAccounts('')
      setMaxModifications('')

    } catch (err: unknown) {

      setTransactionState('error')
      
      // ------------------ Manejo de errores ------------------
      let message = 'Unknown error'

      if (err instanceof Error) {
        message = err.message
      } else if (typeof err === 'object' && err !== null && 'reason' in err) {
        message = (err as any).reason
      } else if (typeof err === 'string') {
        message = err
      }

      setTransactionError(message)
    }
  }

  /* ============================================================
     ======================= RENDER =============================
     ============================================================ */

  return (
    <form onSubmit={submit} className="generated-form">

      {/* ------------------ Issuer ------------------ */}
      <label>
        Issuer address
        <input
          type="text"
          spellCheck="false"
          autoComplete="off"
          value={issuer}
          onChange={e => setIssuer(e.target.value)}
          placeholder="0x..."
          disabled={transactionState === 'pending'}
        />
        {errors.issuer && <div className="error">{errors.issuer}</div>}
      </label>

      {/* ------------------ Duration ------------------ */}
      <label>
        Subscription default duration (seconds)
        <input
          type="number"
          min={MIN_DURATION}
          max={MAX_DURATION}
          value={duration}
          onChange={e => setDuration(e.target.value)}
          disabled={transactionState === 'pending'}
        />
        {errors.duration && <div className="error">{errors.duration}</div>}
      </label>

      {/* ------------------ Secondary Accounts ------------------ */}
      <label>
        Max secondary accounts
        <input
          type="number"
          min={MIN_SECONDARY_ACCOUNTS}
          max={MAX_SECONDARY_ACCOUNTS}
          value={maxSecondaryAccounts}
          onChange={e => {
            const v = e.target.value
            setMaxSecondaryAccounts(v)
            if (Number(v) === 0) setMaxModifications('0')
          }}
          disabled={transactionState === 'pending'}
        />
        {errors.secondary && <div className="error">{errors.secondary}</div>}
      </label>

      {/* ------------------ Modifications ------------------ */}
      <label>
        Max modifications for secondary accounts
        <input
          type="number"
          min={MIN_MODIFICATIONS}
          max={
            Number(maxSecondaryAccounts) === 0
              ? 0
              : MAX_MODIFICATIONS
          }
          value={maxModifications}
          onChange={e => setMaxModifications(e.target.value)}
          disabled={
            transactionState === 'pending' ||
            Number(maxSecondaryAccounts) === 0
          }
        />
        {errors.modifications && (
          <div className="error">{errors.modifications}</div>
        )}
      </label>

      {/* ------------------ Submit ------------------ */}
      <button
        type="submit"
        disabled={!isConnected || !isFormValid || transactionState !== 'idle'}
      >
        {transactionState === 'pending'
          ? <> <span className="spinner"></span> Creating...</>
          : 'Create Subscription Manager'}
      </button>

      {/* ------------------ Success Box ------------------ */}
      {managerAddress && (
        <div className="manager-box">
          <div className="manager-text">
            <strong>Your Subscription Manager Address:</strong> {managerAddress}
          </div>
          <button
            type="button"
            onClick={() => setManagerAddress(null)}
            className="manager-close-btn"
          >
            Close
          </button>
        </div>
      )}

      {/* ------------------ Error Box ------------------ */}
      {transactionState === 'error' && transactionError && (
        <div className="error-box">
          <div className="error-header">
            <strong>Transaction Failed</strong>
            <button
              type="button"
              onClick={() => {
                setTransactionState('idle')
                setTransactionError(null)
              }}
              className="error-close"
            >
              ✕
            </button>
          </div>
          <p className="error-message">{transactionError}</p>
        </div>
      )}

    </form>
  )
}
