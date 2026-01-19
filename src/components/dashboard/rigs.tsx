'use client'

import { useState, useEffect } from 'react'
import { formatNumber, playUnlockSound } from './ui'

// ==========================================
// CONSTANTS
// ==========================================

export const TOKEN_SYMBOL = '$GM'
export const WALLET_STORAGE_KEY = 'gm_wallet_address'
export const POPUP_HISTORY_KEY = 'gm_rig_popup_history'

export const ENTRY_RIGS = [
  { id: 1, name: 'RUSTY PICKAXE', threshold: 100000, color: '#8B4513', power: 1 },
  { id: 2, name: 'OLD SCHOOL DRILL', threshold: 500000, color: '#CD7F32', power: 5 },
  { id: 3, name: 'GOLD EXCAVATOR', threshold: 1000000, color: '#DAA520', power: 12 },
]

export const ELITE_RIGS = [
  { id: 4, name: 'GOLD CRUSHER', threshold: 5000000, color: '#FFD700', power: 35 },
  { id: 5, name: 'GOLD REFINERY', threshold: 10000000, color: '#FFC125', power: 75 },
  { id: 6, name: 'GOLD MEGAMINE', threshold: 20000000, color: '#FFDF00', power: 150 },
]

export const ALL_RIGS = [...ENTRY_RIGS, ...ELITE_RIGS]

export type RigTier = (typeof ALL_RIGS)[0]

// ==========================================
// HELPERS
// ==========================================

export const getShownTierForWallet = (wallet: string): number => {
  try {
    const history = JSON.parse(localStorage.getItem(POPUP_HISTORY_KEY) || '{}')
    return history[wallet.toLowerCase()] || 0
  } catch {
    return 0
  }
}

export const saveShownTierForWallet = (wallet: string, tierId: number) => {
  try {
    const history = JSON.parse(localStorage.getItem(POPUP_HISTORY_KEY) || '{}')
    history[wallet.toLowerCase()] = tierId
    localStorage.setItem(POPUP_HISTORY_KEY, JSON.stringify(history))
  } catch {}
}

export const getRigTier = (holdings: number) => {
  const RIG_TIERS = [
    { threshold: 20000000, name: 'GOLD MEGAMINE', color: '#FFDF00' },
    { threshold: 10000000, name: 'GOLD REFINERY', color: '#FFC125' },
    { threshold: 5000000, name: 'GOLD CRUSHER', color: '#FFD700' },
    { threshold: 1000000, name: 'GOLD EXCAVATOR', color: '#DAA520' },
    { threshold: 500000, name: 'OLD SCHOOL DRILL', color: '#CD7F32' },
    { threshold: 100000, name: 'RUSTY PICKAXE', color: '#8B4513' },
    { threshold: 0, name: 'NO RIG', color: '#666' },
  ]
  
  for (const tier of RIG_TIERS) {
    if (holdings >= tier.threshold) {
      return { name: tier.name, color: tier.color }
    }
  }
  return { name: 'NO RIG', color: '#666' }
}

// ==========================================
// RIG ICON SVG
// ==========================================

export function RigIconLarge({ tier, isUnlocked }: { tier: RigTier; isUnlocked: boolean }) {
  const c = isUnlocked ? tier.color : '#333'
  
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full">
      <rect x="8" y="52" width="48" height="8" fill={c} />
      <rect x="12" y="48" width="40" height="4" fill={c} style={{ filter: 'brightness(1.2)' }} />
      
      {tier.id === 1 && (
        <>
          <rect x="28" y="16" width="8" height="32" fill={c} />
          <rect x="16" y="12" width="32" height="8" fill={c} style={{ filter: 'brightness(1.3)' }} />
          <rect x="12" y="16" width="8" height="12" fill={c} />
          <rect x="44" y="16" width="8" height="12" fill={c} />
        </>
      )}
      {tier.id === 2 && (
        <>
          <rect x="26" y="8" width="12" height="40" fill={c} />
          <rect x="22" y="20" width="20" height="16" fill={c} style={{ filter: 'brightness(1.2)' }} />
          <polygon points="32,4 38,16 26,16" fill={c} style={{ filter: 'brightness(1.4)' }} />
          <rect x="18" y="36" width="28" height="12" fill={c} style={{ filter: 'brightness(0.8)' }} />
        </>
      )}
      {tier.id === 3 && (
        <>
          <rect x="12" y="28" width="24" height="20" fill={c} />
          <rect x="8" y="24" width="12" height="8" fill={c} style={{ filter: 'brightness(1.2)' }} />
          <rect x="36" y="20" width="20" height="8" fill={c} />
          <rect x="48" y="12" width="8" height="16" fill={c} style={{ filter: 'brightness(1.3)' }} />
          <rect x="44" y="8" width="16" height="8" fill={c} />
        </>
      )}
      {tier.id === 4 && (
        <>
          <rect x="16" y="16" width="32" height="32" fill={c} />
          <rect x="20" y="12" width="24" height="8" fill={c} style={{ filter: 'brightness(1.3)' }} />
          <rect x="24" y="24" width="16" height="16" fill="#111" />
          <rect x="28" y="28" width="8" height="8" fill={c} style={{ filter: 'brightness(1.5)' }} />
          <rect x="8" y="28" width="8" height="12" fill={c} />
          <rect x="48" y="28" width="8" height="12" fill={c} />
        </>
      )}
      {tier.id === 5 && (
        <>
          <rect x="8" y="20" width="16" height="28" fill={c} />
          <rect x="24" y="12" width="16" height="36" fill={c} style={{ filter: 'brightness(1.1)' }} />
          <rect x="40" y="24" width="16" height="24" fill={c} style={{ filter: 'brightness(0.9)' }} />
          <rect x="12" y="8" width="8" height="12" fill={c} style={{ filter: 'brightness(1.3)' }} />
          <rect x="28" y="4" width="8" height="8" fill={c} style={{ filter: 'brightness(1.4)' }} />
          <rect x="44" y="16" width="8" height="8" fill={c} style={{ filter: 'brightness(1.2)' }} />
        </>
      )}
      {tier.id === 6 && (
        <>
          <rect x="4" y="24" width="56" height="24" fill={c} />
          <rect x="8" y="16" width="20" height="12" fill={c} style={{ filter: 'brightness(1.2)' }} />
          <rect x="36" y="16" width="20" height="12" fill={c} style={{ filter: 'brightness(1.2)' }} />
          <rect x="16" y="8" width="12" height="12" fill={c} style={{ filter: 'brightness(1.4)' }} />
          <rect x="36" y="8" width="12" height="12" fill={c} style={{ filter: 'brightness(1.4)' }} />
          <rect x="24" y="4" width="16" height="8" fill={c} style={{ filter: 'brightness(1.5)' }} />
          <polygon points="32,28 40,36 32,44 24,36" fill="#fff" style={{ opacity: 0.8 }} />
        </>
      )}
    </svg>
  )
}

// ==========================================
// RIG CARD
// ==========================================

export function RigCard({
  tier,
  holdings,
  isCurrentTier,
  isUnlocked,
}: {
  tier: RigTier
  holdings: number
  isCurrentTier: boolean
  isUnlocked: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)
  const canAfford = holdings >= tier.threshold

  return (
    <div
      className="relative p-5 md:p-6 rounded-xl min-h-[200px] md:min-h-[220px] flex flex-col items-center justify-center cursor-default transition-all duration-300"
      style={{
        border: `3px solid ${isUnlocked && isCurrentTier ? '#4ade80' : isUnlocked ? tier.color : '#333'}`,
        background:
          isUnlocked && isCurrentTier
            ? 'rgba(74, 222, 128, 0.1)'
            : isUnlocked
              ? 'rgba(255, 215, 0, 0.05)'
              : '#111',
        transform: isHovered && isUnlocked ? 'scale(1.05)' : 'scale(1)',
        filter: isUnlocked ? 'none' : 'grayscale(0.8)',
        boxShadow: isUnlocked && isCurrentTier ? '0 0 40px rgba(74, 222, 128, 0.5)' : 'none',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badge */}
      {isUnlocked && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-black text-xs font-bold rounded-full font-vt323 tracking-[2px]"
          style={{
            background: isCurrentTier ? '#4ade80' : tier.color,
            boxShadow: `0 0 15px ${isCurrentTier ? '#4ade80' : tier.color}`,
            animation: isCurrentTier ? 'pulse-badge 2s ease-in-out infinite' : 'none',
          }}
        >
          {isCurrentTier ? '⚡ ACTIVE' : '✓ UNLOCKED'}
        </div>
      )}

      {/* Locked Overlay */}
      {!isUnlocked && !canAfford && (
        <div className="absolute inset-0 flex items-center justify-center rounded-[9px] bg-black/60 z-10">
          <div className="text-center">
            <div className="text-3xl mb-2">🔒</div>
            <p className="font-vt323 text-[1.1rem] text-[#666]">
              {formatNumber(tier.threshold)} {TOKEN_SYMBOL}
            </p>
          </div>
        </div>
      )}

      {/* Icon */}
      <div
        className="w-20 h-20 md:w-[90px] md:h-[90px] mb-4 transition-all"
        style={{
          filter: isUnlocked ? `drop-shadow(0 0 10px ${tier.color}66)` : 'none',
        }}
      >
        <RigIconLarge tier={tier} isUnlocked={isUnlocked} />
      </div>

      {/* Name */}
      <h3
        className="font-vt323 text-lg md:text-[1.2rem] text-center mb-2 tracking-[1px]"
        style={{
          color: isUnlocked ? tier.color : '#555',
          textShadow: isUnlocked ? `0 0 10px ${tier.color}66` : 'none',
        }}
      >
        {tier.name}
      </h3>

      {/* Threshold */}
      <p
        className="font-vt323 text-xl md:text-[1.3rem]"
        style={{ color: isUnlocked ? '#FFD447' : '#444' }}
      >
        {formatNumber(tier.threshold)}
      </p>
    </div>
  )
}

// ==========================================
// MINING POWER DISPLAY
// ==========================================

export function MiningPowerDisplay({
  currentTier,
  holdings,
}: {
  currentTier: RigTier | undefined
  holdings: number
}) {
  const currentPower = currentTier?.power || 0
  const currentTierIndex = currentTier ? ALL_RIGS.findIndex((r) => r.id === currentTier.id) : -1
  const percentage = currentTierIndex >= 0 ? ((currentTierIndex + 1) / ALL_RIGS.length) * 100 : 0

  return (
    <div
      className="rounded-xl px-6 py-4 md:px-8 md:py-[18px] max-w-[700px] mx-auto mb-10"
      style={{
        background: 'linear-gradient(135deg, #1a1a0d 0%, #111 100%)',
        border: '3px solid #FFD447',
        boxShadow: '0 0 25px rgba(255, 212, 71, 0.3)',
      }}
    >
      <div className="flex justify-between items-center mb-3">
        <p className="font-vt323 text-base md:text-[1.1rem] text-[#E8C85C]">CURRENT MINING POWER</p>
        <p className="font-vt323 text-xl md:text-[1.5rem] text-green-400">⚡ {currentPower}x</p>
      </div>

      <div className="relative">
        <div className="w-full h-2.5 bg-[#222] rounded border border-[#333]">
          <div
            className="h-full rounded transition-all duration-500"
            style={{
              width: `${percentage}%`,
              background: 'linear-gradient(90deg, #4ade80 0%, #22c55e 50%, #16a34a 100%)',
              boxShadow: '0 0 10px rgba(74, 222, 128, 0.5)',
            }}
          />
        </div>
      </div>

      <div className="flex justify-between mt-1.5">
        {ALL_RIGS.map((tier) => (
          <div
            key={tier.id}
            className="text-center flex-1"
            style={{ opacity: holdings >= tier.threshold ? 1 : 0.3 }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full mx-auto mb-1"
              style={{
                background: holdings >= tier.threshold ? tier.color : '#444',
                boxShadow: holdings >= tier.threshold ? `0 0 6px ${tier.color}` : 'none',
              }}
            />
            <p className="font-vt323 text-[0.65rem] text-[#666]">{tier.power}x</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ==========================================
// CONFETTI & EFFECTS
// ==========================================

type ConfettiParticle = {
  id: number
  x: number
  y: number
  rotation: number
  scale: number
  type: 'coin' | 'sparkle' | 'nugget'
  delay: number
  duration: number
}

export function GoldConfetti({ isActive }: { isActive: boolean }) {
  const [particles, setParticles] = useState<ConfettiParticle[]>([])

  useEffect(() => {
    if (isActive) {
      const newParticles: ConfettiParticle[] = []
      for (let i = 0; i < 60; i++) {
        const types: ('coin' | 'sparkle' | 'nugget')[] = ['coin', 'sparkle', 'nugget']
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: -10 - Math.random() * 20,
          rotation: Math.random() * 360,
          scale: 0.5 + Math.random() * 1,
          type: types[Math.floor(Math.random() * 3)],
          delay: Math.random() * 0.5,
          duration: 2 + Math.random() * 2,
        })
      }
      setParticles(newParticles)
    } else {
      setParticles([])
    }
  }, [isActive])

  if (!isActive) return null

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[1001]">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            transform: `rotate(${p.rotation}deg) scale(${p.scale})`,
            animation: `confetti-fall ${p.duration}s ease-out ${p.delay}s forwards`,
            opacity: 0,
          }}
        >
          {p.type === 'coin' && (
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm"
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
                border: '2px solid #B8860B',
                boxShadow: '0 0 10px #FFD70066',
                color: '#8B4513',
              }}
            >
              G
            </div>
          )}
          {p.type === 'sparkle' && (
            <div
              className="w-3 h-3"
              style={{
                background: '#FFD700',
                clipPath:
                  'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                boxShadow: '0 0 15px #FFD700',
              }}
            />
          )}
          {p.type === 'nugget' && (
            <div
              className="w-4 h-3"
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #DAA520 100%)',
                borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                boxShadow: '0 0 8px #FFD70088',
              }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

// ==========================================
// UNLOCK MODAL
// ==========================================

export function UnlockedRigModal({
  tier,
  isOpen,
  onClose,
  holdings,
}: {
  tier: RigTier | null
  isOpen: boolean
  onClose: () => void
  holdings: number
}) {
  const [showContent, setShowContent] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (isOpen && tier) {
      playUnlockSound()
      setShowConfetti(true)
      setTimeout(() => setShowContent(true), 100)
      setTimeout(() => setShowConfetti(false), 4000)
    } else {
      setShowContent(false)
      setShowConfetti(false)
    }
  }, [isOpen, tier])

  if (!isOpen || !tier) return null

  return (
    <>
      <GoldConfetti isActive={showConfetti} />
      <div
        className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      >
        <div
          className="relative w-[90%] max-w-[500px] rounded-[20px] px-8 py-12 md:px-10 md:py-[50px] text-center overflow-visible transition-all duration-500"
          style={{
            background: 'linear-gradient(135deg, #1a1a0d 0%, #0d0d07 100%)',
            border: `4px solid ${tier.color}`,
            transform: showContent ? 'scale(1)' : 'scale(0.5)',
            opacity: showContent ? 1 : 0,
            boxShadow: `0 0 80px ${tier.color}88, 0 0 150px ${tier.color}44, inset 0 0 60px ${tier.color}22`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Unlocked Badge */}
          <div
            className="absolute -top-5 left-1/2 -translate-x-1/2 px-8 py-2.5 rounded-full font-vt323 text-xl font-bold tracking-[3px]"
            style={{
              background: '#4ade80',
              color: '#000',
              boxShadow: '0 0 30px #4ade80',
              animation: showContent ? 'badge-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both' : 'none',
            }}
          >
            🎉 UNLOCKED!
          </div>

          {/* Rig Icon */}
          <div
            className="w-32 h-32 md:w-40 md:h-40 mx-auto mt-5 mb-8"
            style={{
              animation: showContent ? 'rig-reveal 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both' : 'none',
              filter: `drop-shadow(0 0 40px ${tier.color})`,
            }}
          >
            <RigIconLarge tier={tier} isUnlocked={true} />
          </div>

          {/* Tier Name */}
          <h2
            className="font-vt323 text-3xl md:text-[2.8rem] mb-2 tracking-[4px]"
            style={{
              color: tier.color,
              textShadow: `0 0 30px ${tier.color}`,
              animation: showContent ? 'text-reveal 0.6s ease-out 0.3s both' : 'none',
            }}
          >
            {tier.name}
          </h2>

          {/* Power Badge */}
          <div
            className="inline-block px-6 py-2 rounded-full mb-5"
            style={{
              background: 'rgba(74, 222, 128, 0.2)',
              border: '2px solid #4ade80',
              animation: showContent ? 'text-reveal 0.6s ease-out 0.35s both' : 'none',
            }}
          >
            <span className="font-vt323 text-xl md:text-[1.5rem] text-green-400">
              ⚡ {tier.power}x MINING POWER
            </span>
          </div>

          {/* Stats Grid */}
          <div
            className="grid grid-cols-2 gap-5 my-5"
            style={{ animation: showContent ? 'stats-reveal 0.6s ease-out 0.4s both' : 'none' }}
          >
            <div className="p-5 bg-black/50 rounded-xl" style={{ border: `2px solid ${tier.color}44` }}>
              <p className="font-vt323 text-base text-[#888] mb-1">REQUIRED</p>
              <p className="font-vt323 text-2xl md:text-[2rem]" style={{ color: tier.color }}>
                {formatNumber(tier.threshold)}
              </p>
            </div>
            <div className="p-5 bg-black/50 rounded-xl border-2 border-green-400/25">
              <p className="font-vt323 text-base text-[#888] mb-1">YOUR HOLDINGS</p>
              <p className="font-vt323 text-2xl md:text-[2rem] text-green-400">
                {formatNumber(holdings)}
              </p>
            </div>
          </div>

          <p
            className="font-vt323 text-base text-[#555] mt-5"
            style={{ animation: showContent ? 'fade-in 0.5s ease-out 0.6s both' : 'none' }}
          >
            Click anywhere to close
          </p>
        </div>
      </div>
    </>
  )
}
