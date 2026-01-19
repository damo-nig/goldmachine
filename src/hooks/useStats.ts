'use client'

import useSWR from 'swr'

// Types for stats data
export interface StatsData {
  circulatingSupply: string
  holders: number
  liquidityUsd: number
  goldDistributed: string
  volume24h: number
}

// Placeholder fetcher - replace with actual API endpoint
const fetcher = async (url: string): Promise<StatsData> => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch stats')
  return res.json()
}

/**
 * useStats hook - fetches protocol statistics
 * 
 * TODO: Replace with actual implementation from DataDaddy.tsx
 * This is a placeholder that returns mock data
 */
export function useStats() {
  // For now, return mock data since we don't have the actual API endpoint
  // Replace this with real SWR fetch when DataDaddy.tsx is provided
  
  const { data, error, isLoading } = useSWR<StatsData>(
    // Uncomment and replace with actual endpoint:
    // '/api/stats',
    null, // null key = no fetch, just use fallback
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      fallbackData: {
        circulatingSupply: '1000000000',
        holders: 0,
        liquidityUsd: 0,
        goldDistributed: '0',
        volume24h: 0,
      },
    }
  )

  return {
    data,
    error,
    isLoading,
  }
}

// Helper functions (exported for use in components)
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
