'use client'

import useSWR from 'swr'
import { useState, useEffect, useRef, useCallback } from 'react'

const API_BASE = 'https://api.goldmachine.xyz'

// Generic fetcher with error handling
const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'API error' }))
    throw new Error(error.error || 'API error')
  }
  return res.json()
}

// ==========================================
// TYPES
// ==========================================

export interface StatsData {
  circulatingSupply: string
  holders: number
  liquidityUsd: number
  goldDistributed: string
  volume24h: number
}

export interface UserData {
  gmBalance: string
  gmBalanceFormatted: string
  claimedXaum: string
  pendingXaum: string
  isWhitelisted: boolean
  referrer: string | null
  inviteCode: string
  referralCount: number
  referralEarnings: string
}

export interface LeaderboardEntry {
  address: string
  referralCount: number
  totalEarnings: string
}

export interface ClaimsData {
  claims: Array<{
    amount: string
    txHash: string
    timestamp: string
  }>
  total: number
  totalClaimed: string
}

export interface RewardsData {
  referrer: string
  totalPayments: number
  totalTransactions: number
  totalEarned: string
  rewards: Array<{
    txHash: string
    referralCount: number
    totalAmount: string
    timestamp: string
  }>
}

export interface TopReferral {
  address: string
  gmBalance: string
  xaumEarned: string
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

export function formatNumber(num: number, decimals: number = 2): string {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(decimals) + 'B'
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(decimals) + 'M'
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(decimals) + 'K'
  }
  return num.toFixed(decimals)
}

export function formatCurrency(num: number): string {
  if (num >= 1_000_000) {
    return '$' + (num / 1_000_000).toFixed(2) + 'M'
  }
  if (num >= 1_000) {
    return '$' + (num / 1_000).toFixed(2) + 'K'
  }
  return '$' + num.toFixed(2)
}

export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// ==========================================
// GLOBAL DATA HOOKS (shared across all users)
// ==========================================

/**
 * Global stats: circulating supply, holders, volume, etc.
 * Refreshes every 30 seconds
 */
export function useStats() {
  return useSWR<StatsData>(`${API_BASE}/api/stats`, fetcher, {
    refreshInterval: 30000,
  })
}

/**
 * Leaderboard: top 50 referrers with count and earnings
 * Refreshes every 30 seconds
 */
export function useLeaderboard(limit = 50) {
  return useSWR<LeaderboardEntry[]>(`${API_BASE}/api/leaderboard?limit=${limit}`, fetcher, {
    refreshInterval: 30000,
  })
}

// ==========================================
// USER-SPECIFIC DATA HOOKS (SWR)
// ==========================================

/**
 * Consolidated user profile data
 * - GM balance
 * - Claimed/pending XAUM
 * - Whitelist status & referrer
 * - Invite code
 * - Referral count & earnings
 *
 * Refreshes every 10 seconds
 */
export function useUserData(address: string | null) {
  return useSWR<UserData>(address ? `${API_BASE}/api/user/${address}` : null, fetcher, {
    refreshInterval: 10000,
  })
}

/**
 * Top 10 referrals with GM balance and XAUM earned
 * Server-cached, no auto-refresh (RPC intensive)
 */
export function useTopReferrals(address: string | null) {
  return useSWR<TopReferral[]>(
    address ? `${API_BASE}/api/referrals/${address}/top` : null,
    fetcher,
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )
}

// ==========================================
// SSE HOOKS (real-time push)
// ==========================================

/**
 * SSE hook for claim history (real-time updates)
 */
export function useClaimsSSE(address: string | null) {
  const [data, setData] = useState<ClaimsData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [latestClaim, setLatestClaim] = useState<ClaimsData['claims'][0] | null>(null)
  const eventSourceRef = useRef<EventSource | null>(null)

  useEffect(() => {
    if (!address) {
      setData(null)
      setError(null)
      setIsLoading(false)
      return
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    setIsLoading(true)
    setError(null)

    const es = new EventSource(`${API_BASE}/api/claims/${address}`)
    eventSourceRef.current = es

    es.addEventListener('initial', (e) => {
      try {
        const parsed = JSON.parse(e.data)
        setData(parsed)
        setIsLoading(false)
      } catch {
        setError('Failed to parse initial data')
        setIsLoading(false)
      }
    })

    es.addEventListener('claim', (e) => {
      try {
        const parsed = JSON.parse(e.data)
        setData(parsed)
        if (parsed.claims && parsed.claims.length > 0) {
          setLatestClaim(parsed.claims[0])
        }
      } catch (err) {
        console.error('Failed to parse claim event', err)
      }
    })

    es.addEventListener('error', (e: Event & { data?: string }) => {
      if (e.data) {
        try {
          const parsed = JSON.parse(e.data)
          setError(parsed.error || 'Connection error')
        } catch {
          setError('Connection error')
        }
      }
      setIsLoading(false)
    })

    es.addEventListener('timeout', () => {
      console.log('SSE claims connection timed out, will auto-reconnect')
    })

    es.onerror = () => {
      console.log('SSE claims connection error, will auto-reconnect')
    }

    return () => {
      es.close()
      eventSourceRef.current = null
    }
  }, [address])

  const close = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
    setData(null)
    setError(null)
    setIsLoading(false)
  }, [])

  const clearLatestClaim = useCallback(() => {
    setLatestClaim(null)
  }, [])

  return { data, error, isLoading, latestClaim, clearLatestClaim, close }
}

/**
 * SSE hook for referral rewards (real-time updates)
 */
export function useRewardsSSE(address: string | null) {
  const [data, setData] = useState<RewardsData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [latestReward, setLatestReward] = useState<RewardsData['rewards'][0] | null>(null)
  const eventSourceRef = useRef<EventSource | null>(null)

  useEffect(() => {
    if (!address) {
      setData(null)
      setError(null)
      setIsLoading(false)
      return
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    setIsLoading(true)
    setError(null)

    const es = new EventSource(`${API_BASE}/api/rewards/${address}`)
    eventSourceRef.current = es

    es.addEventListener('initial', (e) => {
      try {
        const parsed = JSON.parse(e.data)
        setData(parsed)
        setIsLoading(false)
      } catch {
        setError('Failed to parse initial data')
        setIsLoading(false)
      }
    })

    es.addEventListener('reward', (e) => {
      try {
        const parsed = JSON.parse(e.data)
        setData(parsed)
        if (parsed.rewards && parsed.rewards.length > 0) {
          setLatestReward(parsed.rewards[0])
        }
      } catch (err) {
        console.error('Failed to parse reward event', err)
      }
    })

    es.addEventListener('error', (e: Event & { data?: string }) => {
      if (e.data) {
        try {
          const parsed = JSON.parse(e.data)
          setError(parsed.error || 'Connection error')
        } catch {
          setError('Connection error')
        }
      }
      setIsLoading(false)
    })

    es.addEventListener('timeout', () => {
      console.log('SSE rewards connection timed out, will auto-reconnect')
    })

    es.onerror = () => {
      console.log('SSE rewards connection error, will auto-reconnect')
    }

    return () => {
      es.close()
      eventSourceRef.current = null
    }
  }, [address])

  const close = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
    setData(null)
    setError(null)
    setIsLoading(false)
  }, [])

  const clearLatestReward = useCallback(() => {
    setLatestReward(null)
  }, [])

  return { data, error, isLoading, latestReward, clearLatestReward, close }
}

// ==========================================
// ACTIONS (non-SWR)
// ==========================================

/**
 * Redeem an invite code
 */
export async function redeemInviteCode(code: string, userAddress: string) {
  const res = await fetch(`${API_BASE}/api/invite/redeem`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, userAddress }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to redeem code')
  }

  return data
}

/**
 * Look up referrer for an invite code (without redeeming)
 */
export async function lookupInviteCode(code: string) {
  const res = await fetch(`${API_BASE}/api/invite/lookup/${code}`)

  if (!res.ok) {
    if (res.status === 404) return null
    throw new Error('Failed to lookup code')
  }

  return res.json()
}
