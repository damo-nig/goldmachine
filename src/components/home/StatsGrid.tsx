'use client'

import { useState } from 'react'
import { useStats, formatNumber, formatCurrency } from '@/hooks'

// Helper to create glow color from hex
function createGlowColor(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

// Color themes
const TOP_THEMES = [
  { border: '#FFD447', text: '#FFD447' }, // Circulating Supply
  { border: '#00FF66', text: '#00FF66' }, // Holders
  { border: '#FFD447', text: '#FFD447' }, // Liquidity
]

const BOTTOM_THEMES = [
  { border: '#FF6B6B', text: '#FF6B6B' }, // Gold Distributed
  { border: '#4ECDC4', text: '#4ECDC4' }, // 24h Volume
]

export default function StatsGrid() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const { data: stats, isLoading } = useStats()

  // Top row stats (3 cards)
  const topStats = [
    {
      label: 'Circulating Supply',
      value: isLoading
        ? 'Loading...'
        : stats?.circulatingSupply
          ? formatNumber(parseFloat(stats.circulatingSupply), 2)
          : '0',
    },
    {
      label: 'Holders',
      value: isLoading
        ? 'Loading...'
        : stats?.holders
          ? stats.holders.toLocaleString()
          : '0',
    },
    {
      label: 'Liquidity',
      value: isLoading ? 'Loading...' : formatCurrency(stats?.liquidityUsd ?? 0),
    },
  ]

  // Bottom row stats (2 larger cards)
  const bottomStats = [
    {
      label: 'Gold Distributed',
      value: isLoading
        ? 'Loading...'
        : stats?.goldDistributed
          ? formatNumber(parseFloat(stats.goldDistributed), 8) + ' XAUM'
          : '0 XAUM',
    },
    {
      label: '24h Volume',
      value: isLoading ? 'Loading...' : formatCurrency(stats?.volume24h ?? 0),
    },
  ]

  return (
    <div className="flex flex-col gap-8 md:gap-[50px] pb-16 md:pb-[100px] w-[90%] max-w-[1200px] mx-auto">
      {/* Top Row - 3 cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
        {topStats.map((stat, i) => {
          const theme = TOP_THEMES[i]
          const isHovered = hoveredCard === i

          return (
            <div
              key={i}
              className="rounded-xl py-8 px-6 md:py-[45px] md:px-[35px] text-center font-vt323 tracking-[1px] uppercase cursor-default transition-all duration-300"
              style={{
                background: isHovered ? 'rgba(20, 20, 15, 0.95)' : 'rgba(10, 10, 5, 0.85)',
                border: `2px solid ${theme.border}`,
                boxShadow: isHovered
                  ? `0 0 30px ${createGlowColor(theme.border, 0.7)}, 0 0 60px ${createGlowColor(theme.border, 0.5)}, 0 0 100px ${createGlowColor(theme.border, 0.3)}, inset 0 0 40px ${createGlowColor(theme.border, 0.15)}`
                  : `0 0 15px ${createGlowColor(theme.border, 0.5)}, 0 0 30px ${createGlowColor(theme.border, 0.3)}, inset 0 0 20px ${createGlowColor(theme.border, 0.05)}`,
              }}
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div
                className="text-lg md:text-[22px] tracking-[2px] opacity-90 mb-2"
                style={{
                  color: theme.text,
                  textShadow: isHovered ? `0 0 10px ${createGlowColor(theme.text, 0.5)}` : 'none',
                }}
              >
                {stat.label}
              </div>
              <div
                className="text-3xl md:text-[38px] mt-2"
                style={{
                  color: theme.text,
                  textShadow: isHovered
                    ? `0 0 20px ${createGlowColor(theme.text, 0.8)}, 0 0 40px ${createGlowColor(theme.text, 0.5)}`
                    : `0 0 10px ${createGlowColor(theme.text, 0.5)}`,
                }}
              >
                {stat.value}
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom Row - 2 larger cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-[50px]">
        {bottomStats.map((stat, i) => {
          const theme = BOTTOM_THEMES[i]
          const cardIndex = i + 10 // Offset to avoid collision with top row hover state
          const isHovered = hoveredCard === cardIndex

          return (
            <div
              key={i}
              className="rounded-xl py-10 px-8 md:py-[55px] md:px-[50px] text-center font-vt323 tracking-[1px] uppercase cursor-default transition-all duration-300"
              style={{
                background: isHovered ? 'rgba(20, 20, 15, 0.95)' : 'rgba(10, 10, 5, 0.85)',
                border: `2px solid ${theme.border}`,
                boxShadow: isHovered
                  ? `0 0 30px ${createGlowColor(theme.border, 0.7)}, 0 0 60px ${createGlowColor(theme.border, 0.5)}, 0 0 100px ${createGlowColor(theme.border, 0.3)}, inset 0 0 40px ${createGlowColor(theme.border, 0.15)}`
                  : `0 0 15px ${createGlowColor(theme.border, 0.5)}, 0 0 30px ${createGlowColor(theme.border, 0.3)}, inset 0 0 20px ${createGlowColor(theme.border, 0.05)}`,
              }}
              onMouseEnter={() => setHoveredCard(cardIndex)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div
                className="text-xl md:text-[26px] tracking-[2px] opacity-90 mb-2"
                style={{
                  color: theme.text,
                  textShadow: isHovered ? `0 0 10px ${createGlowColor(theme.text, 0.5)}` : 'none',
                }}
              >
                {stat.label}
              </div>
              <div
                className="text-4xl md:text-[52px] mt-2"
                style={{
                  color: theme.text,
                  textShadow: isHovered
                    ? `0 0 20px ${createGlowColor(theme.text, 0.8)}, 0 0 40px ${createGlowColor(theme.text, 0.5)}`
                    : `0 0 10px ${createGlowColor(theme.text, 0.5)}`,
                }}
              >
                {stat.value}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
