'use client'

import { useState, useEffect } from 'react'

// ==========================================
// HELPER FUNCTIONS
// ==========================================

export const formatAddress = (address: string): string => {
  if (!address) return 'Unknown'
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
  return num.toString()
}

export const formatXaumRaw = (raw: string, decimals: number = 4): string => {
  const val = parseFloat(raw) / 1e18
  if (isNaN(val)) return (0).toFixed(decimals)
  return val.toFixed(decimals)
}

export const formatXaum = (raw: string | number, decimals: number = 4): string => {
  const val = typeof raw === 'string' ? parseFloat(raw) : raw
  if (isNaN(val)) return (0).toFixed(decimals)
  if (val > 1e10) return (val / 1e18).toFixed(decimals)
  return val.toFixed(decimals)
}

export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const formatDateShort = (timestamp: string): string => {
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// ==========================================
// SOUNDS
// ==========================================

export const playChaChing = () => {
  try {
    const audio = new Audio(
      'https://orangefreesounds.com/wp-content/uploads/2023/02/Cha-ching-sound-effect.mp3'
    )
    audio.volume = 0.7
    audio.play().catch(() => {})
  } catch {}
}

export const playUnlockSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

    const playTone = (
      freq: number,
      startTime: number,
      duration: number,
      type: OscillatorType = 'sine'
    ) => {
      const osc = audioContext.createOscillator()
      const gain = audioContext.createGain()
      osc.connect(gain)
      gain.connect(audioContext.destination)
      osc.type = type
      osc.frequency.setValueAtTime(freq, audioContext.currentTime + startTime)
      gain.gain.setValueAtTime(0.15, audioContext.currentTime + startTime)
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + startTime + duration)
      osc.start(audioContext.currentTime + startTime)
      osc.stop(audioContext.currentTime + startTime + duration)
    }

    // Triumphant arpeggio
    playTone(523.25, 0, 0.15, 'square')
    playTone(659.25, 0.08, 0.15, 'square')
    playTone(783.99, 0.16, 0.15, 'square')
    playTone(1046.5, 0.24, 0.4, 'square')
    playTone(523.25, 0, 0.15, 'triangle')
    playTone(659.25, 0.08, 0.15, 'triangle')
    playTone(783.99, 0.16, 0.15, 'triangle')
    playTone(1046.5, 0.24, 0.4, 'triangle')
    playTone(2093, 0.24, 0.3, 'sine')
    playTone(2637, 0.32, 0.25, 'sine')
  } catch {}
}

// ==========================================
// UI COMPONENTS
// ==========================================

export function StatCard({
  label,
  value,
  subValue,
  color = '#FFD447',
  isLoading = false,
}: {
  label: string
  value: string
  subValue?: string
  color?: string
  isLoading?: boolean
}) {
  return (
    <div className="bg-[#111] border-2 border-[#333] rounded-[10px] p-5 text-center">
      <p className="font-vt323 text-sm text-[#888] mb-2">{label}</p>
      <p
        className="font-vt323 text-[1.8rem] m-0"
        style={{ color: isLoading ? '#555' : color }}
      >
        {isLoading ? '...' : value}
      </p>
      {subValue && (
        <p className="font-vt323 text-[0.85rem] text-[#666] mt-1">{subValue}</p>
      )}
    </div>
  )
}

export function TabButton({
  label,
  isActive,
  onClick,
}: {
  label: string
  isActive: boolean
  onClick: () => void
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="px-6 py-3 border-none font-vt323 text-[1.1rem] tracking-[1px] cursor-pointer transition-colors"
      style={{
        background: isActive
          ? 'rgba(255, 212, 71, 0.2)'
          : isHovered
            ? 'rgba(255, 212, 71, 0.1)'
            : 'transparent',
        color: isActive ? '#FFD447' : '#888',
        borderBottom: isActive ? '3px solid #FFD447' : '3px solid transparent',
      }}
    >
      {label}
    </button>
  )
}

export function PaginationControls({
  page,
  totalPages,
  onPrev,
  onNext,
  color = '#FFD447',
}: {
  page: number
  totalPages: number
  onPrev: () => void
  onNext: () => void
  color?: string
}) {
  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center items-center gap-4 mt-5 pt-4 border-t border-[#333]">
      <button
        onClick={onPrev}
        disabled={page === 0}
        className="px-4 py-2 rounded-md font-vt323 text-base cursor-pointer disabled:cursor-not-allowed transition-colors"
        style={{
          background: page === 0 ? '#222' : `${color}33`,
          color: page === 0 ? '#555' : color,
          border: `1px solid ${page === 0 ? '#333' : color}`,
        }}
      >
        ← PREV
      </button>
      <span className="font-vt323 text-base text-[#888]">
        {page + 1} / {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={page >= totalPages - 1}
        className="px-4 py-2 rounded-md font-vt323 text-base cursor-pointer disabled:cursor-not-allowed transition-colors"
        style={{
          background: page >= totalPages - 1 ? '#222' : `${color}33`,
          color: page >= totalPages - 1 ? '#555' : color,
          border: `1px solid ${page >= totalPages - 1 ? '#333' : color}`,
        }}
      >
        NEXT →
      </button>
    </div>
  )
}

export function DisconnectedState() {
  return (
    <div
      className="px-6 py-12 md:px-10 md:py-[50px] rounded-xl text-center mb-8"
      style={{
        background: 'linear-gradient(135deg, #1a1a0d 0%, #111 100%)',
        border: '3px solid #FFD447',
        boxShadow: '0 0 25px rgba(255, 212, 71, 0.3)',
      }}
    >
      <div className="text-5xl mb-5">🔗</div>
      <h3 className="font-vt323 text-2xl md:text-[1.8rem] text-gold mb-4 tracking-[2px]">
        WALLET NOT CONNECTED
      </h3>
      <p className="font-vt323 text-base md:text-[1.15rem] text-[#888] leading-relaxed">
        Connect your wallet using the menu above to view your dashboard.
      </p>
    </div>
  )
}

// Table header style
export const thStyle: React.CSSProperties = {
  padding: '12px',
  fontFamily: "'VT323', monospace",
  fontSize: '0.95rem',
  color: '#888',
}

// ==========================================
// TOAST NOTIFICATIONS
// ==========================================

export function RewardToast({
  isVisible,
  amount,
  fromAddress,
  onClose,
}: {
  isVisible: boolean
  amount: string
  fromAddress: string
  onClose: () => void
}) {
  useEffect(() => {
    if (isVisible) {
      playChaChing()
      const timer = setTimeout(onClose, 5000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  return (
    <div className="fixed top-5 right-5 z-[10000] animate-slide-in">
      <div
        className="min-w-[280px] rounded-xl p-5 animate-pulse-slow relative"
        style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)',
          border: '2px solid #4ade80',
          boxShadow: '0 0 30px rgba(74, 222, 128, 0.4), 0 10px 40px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
            style={{ background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)' }}
          >
            💰
          </div>
          <p className="font-vt323 text-[1.1rem] text-green-400 tracking-[1px]">
            YOU&apos;VE BEEN PAID!
          </p>
        </div>

        <div className="bg-green-400/10 rounded-lg p-3 mb-3">
          <p
            className="font-vt323 text-[2rem] text-green-400 text-center"
            style={{ textShadow: '0 0 10px rgba(74, 222, 128, 0.5)' }}
          >
            +{amount} XAUM
          </p>
        </div>

        <p className="font-vt323 text-sm text-[#888] text-center">
          Referral reward from {fromAddress}
        </p>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-transparent border-none text-[#666] text-xl cursor-pointer p-1 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
