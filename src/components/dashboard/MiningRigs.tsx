'use client'

import { useState, useEffect } from 'react'
import { useUserData, useClaimsSSE } from '@/hooks'
import {
  formatNumber,
  formatXaum,
  formatDateShort,
  DisconnectedState,
  PaginationControls,
} from './ui'
import {
  TOKEN_SYMBOL,
  WALLET_STORAGE_KEY,
  ENTRY_RIGS,
  ELITE_RIGS,
  ALL_RIGS,
  RigTier,
  getShownTierForWallet,
  saveShownTierForWallet,
  RigCard,
  MiningPowerDisplay,
  UnlockedRigModal,
} from './rigs'

// ==========================================
// XAUM PAYOUTS SECTION
// ==========================================

function XaumPayoutsSection({
  claimHistory,
  isLoading,
  totalClaimed,
  xaumDecimals,
}: {
  claimHistory: any
  isLoading: boolean
  totalClaimed: string
  xaumDecimals: number
}) {
  const [page, setPage] = useState(0)
  const perPage = 10
  const claims = claimHistory?.claims || []
  const totalPages = Math.ceil(claims.length / perPage)
  const paginatedClaims = claims.slice(page * perPage, (page + 1) * perPage)

  useEffect(() => {
    setPage(0)
  }, [claims.length])

  return (
    <div
      className="rounded-xl p-5 md:p-6 mb-8"
      style={{
        background: '#111',
        border: '3px solid #4ade80',
        boxShadow: '0 0 25px rgba(74, 222, 128, 0.2)',
      }}
    >
      <div className="flex justify-between items-center mb-5 flex-wrap gap-4">
        <h3 className="font-vt323 text-xl md:text-[1.5rem] text-green-400 tracking-[2px]">
          💰 YOUR XAUM PAYOUTS
        </h3>
        <div className="px-5 py-2.5 bg-green-400/15 border-2 border-green-400 rounded-lg">
          <span className="font-vt323 text-lg md:text-[1.3rem] text-green-400">
            TOTAL: {formatXaum(totalClaimed, xaumDecimals)} XAUM
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-[#888] font-vt323">Loading claim history...</div>
      ) : claims.length === 0 ? (
        <div className="text-center py-8 text-[#888] font-vt323">
          No XAUM claims yet. Your payouts will appear here.
        </div>
      ) : (
        <div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-[#333]">
                  <th className="p-3 font-vt323 text-sm text-[#888] text-left">DATE</th>
                  <th className="p-3 font-vt323 text-sm text-[#888] text-right">AMOUNT</th>
                  <th className="p-3 font-vt323 text-sm text-[#888] text-right">TX</th>
                </tr>
              </thead>
              <tbody>
                {paginatedClaims.map((claim: any, index: number) => (
                  <tr key={index} className="border-b border-[#222]">
                    <td className="p-3 font-vt323 text-sm text-[#888]">
                      {formatDateShort(claim.timestamp)}
                    </td>
                    <td className="p-3 font-vt323 text-base text-green-400 text-right">
                      +{formatXaum(claim.userAmount, xaumDecimals)} XAUM
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() =>
                          window.open(`https://bscscan.com/tx/${claim.txHash}`, '_blank')
                        }
                        className="font-vt323 text-sm text-gold bg-gold/10 border border-gold rounded px-3 py-1.5 cursor-pointer hover:bg-gold/20"
                      >
                        VIEW ↗
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <PaginationControls
            page={page}
            totalPages={totalPages}
            onPrev={() => setPage((p) => Math.max(0, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            color="#4ade80"
          />
        </div>
      )}
    </div>
  )
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function MiningRigs({ xaumDecimals = 4 }: { xaumDecimals?: number }) {
  const [walletAddress, setWalletAddress] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isButtonHovered, setIsButtonHovered] = useState(false)
  const [isPasteHovered, setIsPasteHovered] = useState(false)
  const [unlockedRigs, setUnlockedRigs] = useState<Set<number>>(new Set())
  const [showUnlockModal, setShowUnlockModal] = useState(false)
  const [unlockingTier, setUnlockingTier] = useState<RigTier | null>(null)

  // Check localStorage and listen for wallet changes
  useEffect(() => {
    try {
      const stored = localStorage.getItem(WALLET_STORAGE_KEY)
      if (stored && /^0x[a-fA-F0-9]{40}$/.test(stored)) {
        setWalletAddress(stored)
        setIsVerified(true)
      }
    } catch {}

    const handleWalletChange = (e: CustomEvent) => {
      if (e.detail) {
        setWalletAddress(e.detail)
        setIsVerified(true)
        setUnlockedRigs(new Set())
      } else {
        setWalletAddress('')
        setIsVerified(false)
        setError(null)
        setUnlockedRigs(new Set())
        setShowUnlockModal(false)
        setUnlockingTier(null)
      }
    }

    window.addEventListener('walletChanged', handleWalletChange as EventListener)

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === WALLET_STORAGE_KEY) {
        if (e.newValue && /^0x[a-fA-F0-9]{40}$/.test(e.newValue)) {
          setWalletAddress(e.newValue)
          setIsVerified(true)
          setUnlockedRigs(new Set())
        } else {
          setWalletAddress('')
          setIsVerified(false)
          setError(null)
          setUnlockedRigs(new Set())
          setShowUnlockModal(false)
          setUnlockingTier(null)
        }
      }
    }
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('walletChanged', handleWalletChange as EventListener)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const { data: userData, error: fetchError, isLoading: userLoading } = useUserData(
    isVerified ? walletAddress : null
  )

  const { data: claimHistory, isLoading: claimsLoading } = useClaimsSSE(
    isVerified ? walletAddress : null
  )

  const holdings = userData ? parseFloat(userData.gmBalanceFormatted || '0') : 0
  const totalClaimed = claimHistory?.totalClaimed || '0'

  const currentTier = ALL_RIGS.filter((t) => holdings >= t.threshold).pop()
  const nextTier = ALL_RIGS.find((t) => holdings < t.threshold)

  // Auto-unlock rigs and show popup
  useEffect(() => {
    if (!userData || !currentTier || !walletAddress) return

    const previouslyShownTierId = getShownTierForWallet(walletAddress)
    const rigsToUnlock = ALL_RIGS.filter((r) => holdings >= r.threshold).map((r) => r.id)
    setUnlockedRigs(new Set(rigsToUnlock))

    if (currentTier.id > previouslyShownTierId) {
      setTimeout(() => {
        setUnlockingTier(currentTier)
        setShowUnlockModal(true)
        saveShownTierForWallet(walletAddress, currentTier.id)
      }, 500)
    }
  }, [userData, holdings, walletAddress, currentTier])

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setWalletAddress(text.trim())
    } catch {}
  }

  const handleVerify = () => {
    if (!walletAddress) return
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      setError('Invalid wallet address')
      return
    }
    setError(null)
    setIsVerified(true)
    setUnlockedRigs(new Set())
    localStorage.setItem(WALLET_STORAGE_KEY, walletAddress)
    window.dispatchEvent(new CustomEvent('walletChanged', { detail: walletAddress }))
  }

  const handleCheckAnother = () => {
    setIsVerified(false)
    setWalletAddress('')
    setError(null)
    setUnlockedRigs(new Set())
    localStorage.removeItem(WALLET_STORAGE_KEY)
    window.dispatchEvent(new CustomEvent('walletChanged', { detail: null }))
  }

  useEffect(() => {
    if (fetchError) setError('Failed to fetch balance. Please try again.')
  }, [fetchError])

  return (
    <section className="px-5 md:px-10 pt-4 pb-16 max-w-[1200px] mx-auto">
      <UnlockedRigModal
        tier={unlockingTier}
        isOpen={showUnlockModal}
        onClose={() => {
          setShowUnlockModal(false)
          setUnlockingTier(null)
        }}
        holdings={holdings}
      />

      <h2
        className="font-vt323 text-3xl md:text-[4rem] text-center text-gold uppercase tracking-[4px] md:tracking-[8px] mb-4 md:mb-5"
        style={{ textShadow: '0 0 20px rgba(255, 212, 71, 0.6)' }}
      >
        MINING RIGS
      </h2>

      <p className="font-vt323 text-base md:text-[1.3rem] text-center text-[#E8C85C] mb-10 md:mb-[50px] tracking-[1px]">
        Your {TOKEN_SYMBOL} holdings determine your mining power
      </p>

      {/* Wallet Input */}
      {!isVerified && (
        <div
          className="max-w-[550px] mx-auto mb-10 md:mb-[50px] p-8 md:p-10 rounded-xl"
          style={{
            background: '#111',
            border: '3px solid #FFD447',
            boxShadow: '0 0 30px rgba(255, 212, 71, 0.3)',
          }}
        >
          <p className="font-vt323 text-base md:text-[1.2rem] text-[#E8C85C] text-center mb-6 tracking-[1px]">
            PASTE YOUR WALLET ADDRESS TO CHECK YOUR RIG
          </p>

          <div
            className="flex items-center rounded-lg pr-2 mb-5"
            style={{
              background: '#000',
              border: `2px solid ${error ? '#ef4444' : 'rgba(255, 212, 71, 0.4)'}`,
            }}
          >
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value.trim())}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && walletAddress) handleVerify()
              }}
              placeholder="0x..."
              disabled={userLoading}
              className="flex-1 px-5 py-4 bg-transparent border-none text-gold font-vt323 text-[1.1rem] outline-none"
            />
            <button
              onClick={handlePaste}
              onMouseEnter={() => setIsPasteHovered(true)}
              onMouseLeave={() => setIsPasteHovered(false)}
              className="px-5 py-2.5 rounded-md font-vt323 text-base cursor-pointer tracking-[1px] shrink-0 transition-colors"
              style={{
                background: isPasteHovered ? 'rgba(255, 212, 71, 0.3)' : 'rgba(255, 212, 71, 0.2)',
                color: '#FFD447',
              }}
            >
              PASTE
            </button>
          </div>

          {error && (
            <p className="font-vt323 text-base text-red-500 text-center mb-4">{error}</p>
          )}

          <button
            onClick={handleVerify}
            disabled={userLoading || !walletAddress}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            className="w-full py-4 md:py-[18px] rounded-lg font-vt323 text-lg md:text-[1.3rem] tracking-[2px] cursor-pointer disabled:cursor-not-allowed"
            style={{
              background: userLoading || !walletAddress ? '#222' : '#FFD447',
              color: userLoading || !walletAddress ? '#555' : '#000',
              boxShadow:
                userLoading || !walletAddress
                  ? 'none'
                  : isButtonHovered
                    ? '0 0 40px rgba(255, 212, 71, 0.7)'
                    : '0 0 20px rgba(255, 212, 71, 0.4)',
            }}
          >
            CHECK HOLDINGS
          </button>
        </div>
      )}

      {/* Loading */}
      {isVerified && (userLoading || claimsLoading) && (
        <div className="text-center py-10 font-vt323 text-xl md:text-[1.5rem] text-[#E8C85C]">
          LOADING...
        </div>
      )}

      {/* Verified State */}
      {isVerified && !userLoading && userData && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 mb-8 md:mb-9 max-w-[900px] mx-auto">
            <div className="text-center">
              <p className="font-vt323 text-base md:text-[1.1rem] text-[#888] mb-3 tracking-[2px]">
                YOUR HOLDINGS
              </p>
              <p
                className="font-vt323 text-3xl md:text-[2.8rem] text-gold"
                style={{ textShadow: '0 0 15px rgba(255, 212, 71, 0.5)' }}
              >
                {formatNumber(holdings)}
              </p>
              <p className="font-vt323 text-lg md:text-[1.2rem] text-[#E8C85C] mt-1">{TOKEN_SYMBOL}</p>
            </div>
            <div className="text-center">
              <p className="font-vt323 text-base md:text-[1.1rem] text-[#888] mb-3 tracking-[2px]">
                CURRENT RIG
              </p>
              <p
                className="font-vt323 text-2xl md:text-[2rem]"
                style={{
                  color: currentTier?.color || '#666',
                  textShadow: currentTier ? `0 0 15px ${currentTier.color}` : 'none',
                }}
              >
                {currentTier ? currentTier.name : 'NONE'}
              </p>
            </div>
            <div className="text-center">
              <p className="font-vt323 text-base md:text-[1.1rem] text-[#888] mb-3 tracking-[2px]">
                NEXT UNLOCK
              </p>
              <p className="font-vt323 text-2xl md:text-[2rem] text-[#E8C85C]">
                {nextTier ? formatNumber(nextTier.threshold - holdings) : 'MAX LEVEL'}
              </p>
              <p className="font-vt323 text-base text-[#888] mt-1">
                {nextTier ? 'more needed' : '🏆'}
              </p>
            </div>
          </div>

          <MiningPowerDisplay currentTier={currentTier} holdings={holdings} />
        </>
      )}

      {/* Entry Level Rigs */}
      <div className="mb-4">
        <p className="font-vt323 text-lg md:text-[1.4rem] text-[#E8C85C] mb-4 tracking-[2px]">
          ENTRY LEVEL RIGS
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {ENTRY_RIGS.map((tier) => (
            <RigCard
              key={tier.id}
              tier={tier}
              holdings={holdings}
              isCurrentTier={currentTier?.id === tier.id}
              isUnlocked={unlockedRigs.has(tier.id)}
            />
          ))}
        </div>
      </div>

      {/* Elite Rigs */}
      <div className="mb-10">
        <p className="font-vt323 text-lg md:text-[1.4rem] text-gold mb-4 mt-9 tracking-[2px]">
          ELITE RIGS
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {ELITE_RIGS.map((tier) => (
            <RigCard
              key={tier.id}
              tier={tier}
              holdings={holdings}
              isCurrentTier={currentTier?.id === tier.id}
              isUnlocked={unlockedRigs.has(tier.id)}
            />
          ))}
        </div>
      </div>

      {/* XAUM Payouts */}
      {isVerified && !userLoading && userData && (
        <XaumPayoutsSection
          claimHistory={claimHistory}
          isLoading={claimsLoading}
          totalClaimed={totalClaimed}
          xaumDecimals={xaumDecimals}
        />
      )}

      {/* Check another wallet */}
      {isVerified && !userLoading && (
        <div className="text-center mt-8 mb-8">
          <button
            onClick={handleCheckAnother}
            className="px-8 py-3.5 bg-transparent text-[#E8C85C] border-2 border-[#E8C85C]/50 rounded-lg font-vt323 text-[1.1rem] cursor-pointer hover:border-[#E8C85C] transition-colors"
          >
            CHECK ANOTHER WALLET
          </button>
        </div>
      )}

      {/* Info Banner */}
      <div
        className="rounded-xl px-6 py-5 md:px-9 md:py-6 text-center"
        style={{
          background: 'linear-gradient(135deg, #1a1a0d 0%, #0d0d07 100%)',
          border: '3px solid rgba(255, 212, 71, 0.6)',
          boxShadow: '0 0 25px rgba(255, 212, 71, 0.2)',
        }}
      >
        <p className="font-vt323 text-base md:text-[1.2rem] text-[#E8C85C] tracking-[1px]">
          ⛏️ Higher tier rigs = higher mining power = bigger share of gold distribution.{' '}
          <strong className="text-gold">
            You must be referred to be eligible for XAUM airdrops.
          </strong>
        </p>
      </div>
    </section>
  )
}
