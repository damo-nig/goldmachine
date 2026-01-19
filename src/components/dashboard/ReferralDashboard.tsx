'use client'

import { useState, useEffect } from 'react'
import {
  useUserData,
  useLeaderboard,
  useTopReferrals,
  useRewardsSSE,
  useStats,
  redeemInviteCode,
} from '@/hooks'
import {
  formatAddress,
  formatNumber,
  formatXaumRaw,
  formatTimestamp,
  StatCard,
  TabButton,
  PaginationControls,
  DisconnectedState,
  RewardToast,
  thStyle,
} from './ui'
import { WALLET_STORAGE_KEY, getRigTier } from './rigs'

// ==========================================
// SUB-COMPONENTS
// ==========================================

function NotEligible({ onEnterCode }: { onEnterCode: () => void }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="p-8 md:p-10 rounded-xl text-center"
      style={{
        background: '#111',
        border: '3px solid #ef4444',
        boxShadow: '0 0 30px rgba(239, 68, 68, 0.2)',
      }}
    >
      <div className="text-4xl mb-4">🚫</div>
      <h3 className="font-vt323 text-xl md:text-[1.6rem] text-red-500 mb-3">NOT ELIGIBLE</h3>
      <p className="font-vt323 text-base text-[#888] mb-6 leading-relaxed">
        This wallet hasn&apos;t been referred yet. You need an invite code to be eligible for XAUM
        airdrops.
      </p>
      <button
        onClick={onEnterCode}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="px-8 py-3.5 bg-gold text-black rounded-lg font-vt323 text-[1.1rem] tracking-[1px] cursor-pointer transition-shadow"
        style={{
          boxShadow: isHovered
            ? '0 0 30px rgba(255, 212, 71, 0.6)'
            : '0 0 15px rgba(255, 212, 71, 0.3)',
        }}
      >
        ENTER INVITE CODE
      </button>
    </div>
  )
}

function InviteCodeEntry({
  onSubmit,
  onCancel,
  isSubmitting,
  error,
}: {
  onSubmit: (code: string) => void
  onCancel: () => void
  isSubmitting: boolean
  error: string | null
}) {
  const [code, setCode] = useState('')
  const [isSubmitHovered, setIsSubmitHovered] = useState(false)

  return (
    <div
      className="p-8 md:p-9 rounded-xl"
      style={{
        background: '#111',
        border: '3px solid #FFD447',
        boxShadow: '0 0 30px rgba(255, 212, 71, 0.3)',
      }}
    >
      <h3 className="font-vt323 text-lg md:text-[1.3rem] text-gold mb-5 text-center">
        ENTER YOUR INVITE CODE
      </h3>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && code.length >= 6 && !isSubmitting) onSubmit(code)
        }}
        placeholder="GM7X2K9P"
        maxLength={10}
        disabled={isSubmitting}
        className="w-full p-4 bg-black rounded-lg text-gold font-vt323 text-xl md:text-[1.4rem] text-center tracking-[4px] outline-none mb-2 focus:border-gold focus:shadow-[0_0_15px_rgba(255,212,71,0.3)]"
        style={{
          border: `2px solid ${error ? '#ef4444' : 'rgba(255, 212, 71, 0.4)'}`,
          marginBottom: error ? '10px' : '20px',
        }}
      />
      {error && (
        <p className="font-vt323 text-sm text-red-500 text-center mb-4">{error}</p>
      )}
      <div className="flex gap-4">
        <button
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 py-3 bg-transparent text-[#888] border-2 border-[#444] rounded-lg font-vt323 text-base cursor-pointer disabled:cursor-not-allowed"
        >
          CANCEL
        </button>
        <button
          onClick={() => onSubmit(code)}
          onMouseEnter={() => setIsSubmitHovered(true)}
          onMouseLeave={() => setIsSubmitHovered(false)}
          disabled={code.length < 6 || isSubmitting}
          className="flex-[2] py-3 rounded-lg font-vt323 text-base cursor-pointer disabled:cursor-not-allowed"
          style={{
            background: code.length >= 6 && !isSubmitting ? '#FFD447' : '#333',
            color: code.length >= 6 && !isSubmitting ? '#000' : '#666',
            boxShadow:
              code.length >= 6 && !isSubmitting && isSubmitHovered
                ? '0 0 25px rgba(255, 212, 71, 0.5)'
                : 'none',
          }}
        >
          {isSubmitting ? 'ACTIVATING...' : 'ACTIVATE'}
        </button>
      </div>
    </div>
  )
}

function ReferralsTable({
  referrals,
  isLoading,
  xaumDecimals,
}: {
  referrals: Array<{
    user: string
    gmBalance: string | null
    xaumEarned: string
    timestamp: string
  }>
  isLoading: boolean
  xaumDecimals: number
}) {
  const [page, setPage] = useState(0)
  const perPage = 10
  const totalPages = Math.ceil((referrals?.length || 0) / perPage)
  const paginatedReferrals = referrals?.slice(page * perPage, (page + 1) * perPage) || []

  useEffect(() => {
    setPage(0)
  }, [referrals?.length])

  if (isLoading) {
    return (
      <div className="text-center py-10 text-[#888] font-vt323">Loading referrals...</div>
    )
  }
  if (!referrals || referrals.length === 0) {
    return (
      <div className="text-center py-10 text-[#888] font-vt323">
        No referrals yet. Share your invite code to start earning!
      </div>
    )
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-[#333]">
              <th style={{ ...thStyle, textAlign: 'left' }}>WALLET</th>
              <th style={{ ...thStyle, textAlign: 'left' }}>HOLDINGS</th>
              <th style={{ ...thStyle, textAlign: 'left' }}>RIG TIER</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>XAUM EARNED</th>
            </tr>
          </thead>
          <tbody>
            {paginatedReferrals.map((ref, index) => {
              const holdings = ref.gmBalance ? parseFloat(ref.gmBalance) : 0
              const tier = getRigTier(holdings)
              return (
                <tr key={index} className="border-b border-[#222]">
                  <td className="p-3 font-vt323 text-base text-[#E8C85C]">
                    {formatAddress(ref.user)}
                  </td>
                  <td className="p-3 font-vt323 text-base text-gold">
                    {ref.gmBalance ? formatNumber(holdings) : '—'} $GM
                  </td>
                  <td className="p-3 font-vt323 text-sm" style={{ color: tier.color }}>
                    {tier.name}
                  </td>
                  <td className="p-3 font-vt323 text-base text-green-400 text-right">
                    +{formatXaumRaw(ref.xaumEarned, xaumDecimals)} XAUM
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPrev={() => setPage((p) => Math.max(0, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
      />
    </div>
  )
}

function PaymentsTable({
  payments,
  isLoading,
  xaumDecimals,
}: {
  payments: Array<{
    txHash: string
    referralCount: number
    totalAmount: string
    timestamp: string
  }>
  isLoading: boolean
  xaumDecimals: number
}) {
  const [page, setPage] = useState(0)
  const perPage = 10
  const totalPages = Math.ceil((payments?.length || 0) / perPage)
  const paginatedPayments = payments?.slice(page * perPage, (page + 1) * perPage) || []

  useEffect(() => {
    setPage(0)
  }, [payments?.length])

  if (isLoading) {
    return (
      <div className="text-center py-10 text-[#888] font-vt323">Loading payment history...</div>
    )
  }
  if (!payments || payments.length === 0) {
    return (
      <div className="text-center py-10 text-[#888] font-vt323">
        No payments yet. You&apos;ll see payments here when your referrals claim XAUM.
      </div>
    )
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-[#333]">
              <th style={{ ...thStyle, textAlign: 'left' }}>DATE</th>
              <th style={{ ...thStyle, textAlign: 'left' }}>FROM</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>AMOUNT</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>TX</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPayments.map((payment, index) => (
              <tr key={index} className="border-b border-[#222]">
                <td className="p-3 font-vt323 text-sm text-[#888]">
                  {formatTimestamp(payment.timestamp)}
                </td>
                <td className="p-3 font-vt323 text-base text-[#E8C85C]">
                  {payment.referralCount} {payment.referralCount === 1 ? 'referral' : 'referrals'}
                </td>
                <td className="p-3 font-vt323 text-base text-green-400 text-right">
                  +{formatXaumRaw(payment.totalAmount, xaumDecimals)} XAUM
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() =>
                      window.open(`https://bscscan.com/tx/${payment.txHash}`, '_blank')
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
      />
    </div>
  )
}

function LeaderboardTable({
  data,
  userAddress,
  isLoading,
  xaumDecimals,
}: {
  data: Array<{ address: string; referralCount: number; totalEarnings: string }>
  userAddress?: string
  isLoading: boolean
  xaumDecimals: number
}) {
  const [page, setPage] = useState(0)
  const perPage = 10
  const totalPages = Math.ceil((data?.length || 0) / perPage)
  const paginatedData = data?.slice(page * perPage, (page + 1) * perPage) || []

  useEffect(() => {
    setPage(0)
  }, [data?.length])

  if (isLoading) {
    return (
      <div className="text-center py-10 text-[#888] font-vt323">Loading leaderboard...</div>
    )
  }
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-10 text-[#888] font-vt323">No leaderboard data yet.</div>
    )
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-[#333]">
              <th style={{ ...thStyle, textAlign: 'center', width: '60px' }}>RANK</th>
              <th style={{ ...thStyle, textAlign: 'left' }}>WALLET</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>REFERRALS</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>XAUM EARNED</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((entry, index) => {
              const rank = page * perPage + index + 1
              const isUser =
                userAddress && entry.address.toLowerCase() === userAddress.toLowerCase()
              return (
                <tr
                  key={entry.address}
                  className="border-b border-[#222]"
                  style={{ background: isUser ? 'rgba(255, 212, 71, 0.1)' : 'transparent' }}
                >
                  <td className="p-3 text-center">
                    {rank <= 3 ? (
                      <span className="text-xl">
                        {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
                      </span>
                    ) : (
                      <span className="font-vt323 text-[1.1rem] text-[#666]">#{rank}</span>
                    )}
                  </td>
                  <td className="p-3 font-vt323 text-base" style={{ color: isUser ? '#FFD447' : '#E8C85C' }}>
                    {formatAddress(entry.address)}
                    {isUser && (
                      <span className="ml-2.5 px-2 py-0.5 bg-gold text-black text-[0.7rem] rounded font-bold">
                        YOU
                      </span>
                    )}
                  </td>
                  <td className="p-3 font-vt323 text-[1.1rem] text-white text-center">
                    {entry.referralCount}
                  </td>
                  <td className="p-3 font-vt323 text-base text-green-400 text-right">
                    {formatXaumRaw(entry.totalEarnings, xaumDecimals)} XAUM
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPrev={() => setPage((p) => Math.max(0, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
      />
    </div>
  )
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function ReferralDashboard({ xaumDecimals = 4 }: { xaumDecimals?: number }) {
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null)
  const [showInviteEntry, setShowInviteEntry] = useState(false)
  const [activeTab, setActiveTab] = useState<'referrals' | 'payments'>('referrals')
  const [codeCopied, setCodeCopied] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [redeemError, setRedeemError] = useState<string | null>(null)
  const [isRedeeming, setIsRedeeming] = useState(false)
  const [showPaymentToast, setShowPaymentToast] = useState(false)
  const [latestPayment, setLatestPayment] = useState<{ amount: string; from: string } | null>(null)

  // Load wallet from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(WALLET_STORAGE_KEY)
      if (stored && /^0x[a-fA-F0-9]{40}$/.test(stored)) {
        setConnectedWallet(stored)
      }
    } catch {}

    const handleWalletChange = (e: CustomEvent) => {
      if (e.detail && /^0x[a-fA-F0-9]{40}$/.test(e.detail)) {
        setConnectedWallet(e.detail)
        setShowInviteEntry(false)
        setRedeemError(null)
      } else {
        setConnectedWallet(null)
        setShowInviteEntry(false)
        setRedeemError(null)
      }
    }

    window.addEventListener('walletChanged', handleWalletChange as EventListener)

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === WALLET_STORAGE_KEY) {
        if (e.newValue && /^0x[a-fA-F0-9]{40}$/.test(e.newValue)) {
          setConnectedWallet(e.newValue)
        } else {
          setConnectedWallet(null)
        }
      }
    }
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('walletChanged', handleWalletChange as EventListener)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // Data fetching
  const { data: userData, isLoading: userLoading, mutate: mutateUser } = useUserData(connectedWallet)
  const { data: topReferrals, isLoading: referralsLoading } = useTopReferrals(
    connectedWallet && userData?.isWhitelisted ? connectedWallet : null
  )
  const { data: rewardHistory, isLoading: rewardsLoading, latestReward, clearLatestReward } =
    useRewardsSSE(connectedWallet && userData?.isWhitelisted ? connectedWallet : null)
  const { data: leaderboardData, isLoading: leaderboardLoading } = useLeaderboard(50)
  const { data: globalStats } = useStats()

  // New payment toast
  useEffect(() => {
    if (latestReward) {
      setLatestPayment({
        amount: formatXaumRaw(latestReward.totalAmount, xaumDecimals),
        from: formatAddress(latestReward.txHash?.slice(0, 10) || 'Unknown'),
      })
      setShowPaymentToast(true)
      clearLatestReward()
    }
  }, [latestReward, clearLatestReward, xaumDecimals])

  const handleCopyCode = () => {
    if (userData?.inviteCode) {
      navigator.clipboard.writeText(userData.inviteCode)
      setCodeCopied(true)
      setTimeout(() => setCodeCopied(false), 2000)
    }
  }

  const handleCopyLink = () => {
    if (userData?.inviteCode) {
      navigator.clipboard.writeText(`https://goldmachine.io/?ref=${userData.inviteCode}`)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    }
  }

  const handleInviteSubmit = async (code: string) => {
    if (!connectedWallet) return
    setIsRedeeming(true)
    setRedeemError(null)
    try {
      await redeemInviteCode(code, connectedWallet)
      await mutateUser()
      setShowInviteEntry(false)
    } catch (err) {
      setRedeemError(err instanceof Error ? err.message : 'Failed to redeem code')
    } finally {
      setIsRedeeming(false)
    }
  }

  const isEligible = userData?.isWhitelisted
  const showNotEligible =
    connectedWallet && !userLoading && userData && !isEligible && !showInviteEntry
  const networkValue =
    (topReferrals as any)?.referrals?.reduce(
      (sum: number, r: any) => sum + (r.gmBalance ? parseFloat(r.gmBalance) : 0),
      0
    ) || 0

  return (
    <section className="px-5 md:px-10 py-10 md:py-[60px] max-w-[1200px] mx-auto">
      <h2
        className="font-vt323 text-3xl md:text-[4rem] text-center text-gold uppercase tracking-[4px] md:tracking-[8px] mb-4 md:mb-5"
        style={{ textShadow: '0 0 20px rgba(255, 212, 71, 0.6)' }}
      >
        REFERRAL PROGRAM
      </h2>

      <p className="font-vt323 text-base md:text-[1.3rem] text-center text-[#E8C85C] mb-10 md:mb-[50px] tracking-[1px]">
        Earn 10% of your referrals&apos; XAUM airdrops
      </p>

      {/* Disconnected State */}
      {!connectedWallet && <DisconnectedState />}

      {/* Loading */}
      {connectedWallet && userLoading && (
        <div className="text-center py-10 text-[#E8C85C] font-vt323 text-xl">
          Loading dashboard...
        </div>
      )}

      {/* Not Eligible */}
      {showNotEligible && (
        <div className="max-w-[550px] mx-auto mb-8">
          <NotEligible onEnterCode={() => setShowInviteEntry(true)} />
        </div>
      )}

      {/* Invite Code Entry */}
      {showInviteEntry && (
        <div className="max-w-[550px] mx-auto mb-8">
          <InviteCodeEntry
            onSubmit={handleInviteSubmit}
            onCancel={() => setShowInviteEntry(false)}
            isSubmitting={isRedeeming}
            error={redeemError}
          />
        </div>
      )}

      {/* User Dashboard */}
      {connectedWallet && !userLoading && userData && isEligible && (
        <>
          {/* Invite Code Section */}
          <div
            className="rounded-xl p-6 md:p-8 mb-8"
            style={{
              background: '#111',
              border: '3px solid #4ade80',
              boxShadow: '0 0 25px rgba(74, 222, 128, 0.2)',
            }}
          >
            <div className="flex justify-between items-center flex-wrap gap-5">
              <div>
                <p className="font-vt323 text-base text-[#888] mb-2">YOUR INVITE CODE</p>
                <p
                  className="font-vt323 text-3xl md:text-[2.5rem] text-gold tracking-[6px]"
                  style={{ textShadow: '0 0 15px rgba(255, 212, 71, 0.5)' }}
                >
                  {userData.inviteCode || '—'}
                </p>
              </div>
              {userData.inviteCode && (
                <div className="flex gap-4 flex-wrap">
                  <button
                    onClick={handleCopyCode}
                    className="px-5 py-3 bg-gold/20 text-gold border-2 border-gold rounded-lg font-vt323 text-base cursor-pointer hover:bg-gold/30"
                  >
                    {codeCopied ? 'COPIED!' : 'COPY CODE'}
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="px-5 py-3 bg-gold text-black rounded-lg font-vt323 text-base cursor-pointer hover:bg-gold/90"
                  >
                    {linkCopied ? 'COPIED!' : 'COPY INVITE LINK'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* User Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            <StatCard
              label="YOUR REFERRALS"
              value={userData.referralCount?.toString() || '0'}
              isLoading={userLoading}
            />
            <StatCard
              label="XAUM EARNED"
              value={formatXaumRaw(rewardHistory?.totalEarned || '0', xaumDecimals)}
              subValue="from referrals"
              color="#4ade80"
              isLoading={rewardsLoading}
            />
            <StatCard
              label="NETWORK VALUE"
              value={formatNumber(networkValue)}
              subValue="$GM held by top 10 referrals"
              color="#E8C85C"
              isLoading={referralsLoading}
            />
          </div>

          {/* Tabs */}
          <div className="border-b-2 border-[#333] mb-6">
            <TabButton
              label="MY TOP REFERRALS"
              isActive={activeTab === 'referrals'}
              onClick={() => setActiveTab('referrals')}
            />
            <TabButton
              label="PAYMENT HISTORY"
              isActive={activeTab === 'payments'}
              onClick={() => setActiveTab('payments')}
            />
          </div>

          {/* Tab Content */}
          <div className="bg-[#111] border-2 border-[#333] rounded-xl p-5 md:p-6 mb-10 md:mb-[50px]">
            {activeTab === 'referrals' && (
              <ReferralsTable
                referrals={(topReferrals as any)?.referrals || []}
                isLoading={referralsLoading}
                xaumDecimals={xaumDecimals}
              />
            )}
            {activeTab === 'payments' && (
              <PaymentsTable
                payments={rewardHistory?.rewards || []}
                isLoading={rewardsLoading}
                xaumDecimals={xaumDecimals}
              />
            )}
          </div>
        </>
      )}

      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <StatCard
          label="TOTAL REFERRALS"
          value={
            (leaderboardData as any)?.leaderboard
              ?.reduce((sum: number, l: any) => sum + l.referralCount, 0)
              ?.toString() || '0'
          }
          color="#FFD447"
          isLoading={leaderboardLoading}
        />
        <StatCard
          label="TOTAL REFERRERS"
          value={(leaderboardData as any)?.leaderboard?.length?.toString() || '0'}
          color="#E8C85C"
          isLoading={leaderboardLoading}
        />
        <StatCard
          label="XAUM DISTRIBUTED"
          value={formatXaumRaw((globalStats as any)?.goldDistributedRaw || '0', xaumDecimals)}
          color="#4ade80"
          isLoading={!globalStats}
        />
      </div>

      {/* Leaderboard */}
      <div
        className="rounded-xl p-5 md:p-6 mb-10 md:mb-[50px]"
        style={{
          background: '#111',
          border: '3px solid #FFD447',
          boxShadow: '0 0 25px rgba(255, 212, 71, 0.2)',
        }}
      >
        <h3 className="font-vt323 text-xl md:text-[1.5rem] text-gold mb-5 tracking-[2px]">
          TOP REFERRERS
        </h3>
        <LeaderboardTable
          data={(leaderboardData as any)?.leaderboard || []}
          userAddress={connectedWallet || undefined}
          isLoading={leaderboardLoading}
          xaumDecimals={xaumDecimals}
        />
      </div>

      {/* Payment Toast */}
      <RewardToast
        isVisible={showPaymentToast}
        amount={latestPayment?.amount || '0'}
        fromAddress={latestPayment?.from || ''}
        onClose={() => setShowPaymentToast(false)}
      />
    </section>
  )
}
