'use client'

import { useState } from 'react'

const COLOR_THEMES = [
  {
    border: '#FFD447',
    glow: 'rgba(255, 212, 71, 0.3)',
    glowHover: 'rgba(255, 212, 71, 0.8), 0 0 80px rgba(255, 212, 71, 0.4)',
    text: '#FFD447',
  },
  {
    border: '#00FF66',
    glow: 'rgba(0, 255, 102, 0.25)',
    glowHover: 'rgba(0, 255, 102, 0.8), 0 0 80px rgba(0, 255, 102, 0.4)',
    text: '#00FF66',
  },
  {
    border: '#4ECDC4',
    glow: 'rgba(78, 205, 196, 0.25)',
    glowHover: 'rgba(78, 205, 196, 0.8), 0 0 80px rgba(78, 205, 196, 0.4)',
    text: '#4ECDC4',
  },
  {
    border: '#FF9500',
    glow: 'rgba(255, 149, 0, 0.25)',
    glowHover: 'rgba(255, 149, 0, 0.8), 0 0 80px rgba(255, 149, 0, 0.4)',
    text: '#FF9500',
  },
]

const STEPS = [
  {
    number: '1',
    title: 'Hold $GM Tokens',
    description: 'Accumulate XAUM rewards through our automated gold distribution protocol',
  },
  {
    number: '2',
    title: 'Auto-Receive XAUM',
    description: 'Automatically receive gold-backed XAUM tokens directly to your wallet',
  },
  {
    number: '3',
    title: 'Redeem for Physical Gold',
    description: 'Convert your XAUM to real gold bars or coins through Matrixdock platform',
  },
  {
    number: '4',
    title: 'Receive IRL Gold',
    description: 'Get your physical gold delivered directly to your vault or address',
  },
]

export default function RedeemGold() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)
  const [buttonHovered, setButtonHovered] = useState(false)

  return (
    <section className="px-5 md:px-10 py-5 max-w-[1400px] mx-auto">
      {/* Title */}
      <h2
        className="font-vt323 text-3xl md:text-[4rem] text-center text-gold uppercase tracking-[4px] md:tracking-[8px] mb-4 md:mb-5"
        style={{ textShadow: '0 0 20px rgba(255, 212, 71, 0.6)' }}
      >
        REDEEM PHYSICAL GOLD
      </h2>

      <p className="font-vt323 text-base md:text-[1.3rem] text-center text-[#E8C85C] mb-10 md:mb-[60px] tracking-[1px]">
        Turn your digital gold rewards into real, tangible bars
      </p>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-[30px] mb-10 md:mb-[60px] max-w-[1000px] mx-auto">
        {STEPS.map((step, index) => {
          const theme = COLOR_THEMES[index]
          const isHovered = hoveredStep === index

          return (
            <div
              key={index}
              className="bg-[#111] rounded-xl px-6 py-10 md:px-10 md:py-[50px] font-vt323 relative min-h-[250px] md:min-h-[280px] flex flex-col justify-center transition-all duration-300"
              style={{
                background: isHovered ? 'rgba(17, 17, 17, 0.98)' : '#111',
                border: `3px solid ${theme.border}`,
                boxShadow: isHovered
                  ? `0 0 45px ${theme.glowHover}`
                  : `0 0 25px ${theme.glow}`,
                transform: isHovered ? 'scale(1.02)' : 'scale(1)',
              }}
              onMouseEnter={() => setHoveredStep(index)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              {/* Step Number Badge */}
              <div
                className="absolute -top-4 left-5 w-[50px] h-[50px] rounded-full flex items-center justify-center text-2xl text-black font-bold border-[3px] border-[#CBA000]"
                style={{
                  background: 'linear-gradient(135deg, #FFD447 0%, #E5C45A 100%)',
                  boxShadow: '0 0 20px rgba(255, 212, 71, 0.6)',
                }}
              >
                {step.number}
              </div>

              {/* Title */}
              <h3
                className="text-xl md:text-[1.5rem] text-center mt-5 mb-3 md:mb-4 uppercase tracking-[2px]"
                style={{ color: theme.text }}
              >
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-base md:text-[1rem] text-[#E8C85C] text-center leading-relaxed opacity-90">
                {step.description}
              </p>
            </div>
          )
        })}
      </div>

      {/* Info Box */}
      <div
        className="border-[3px] border-gold rounded-xl px-6 py-8 md:px-10 md:py-10 text-center max-w-[1000px] mx-auto"
        style={{
          background: 'linear-gradient(135deg, #2a2a15 0%, #1a1a0d 100%)',
          boxShadow: '0 0 30px rgba(255, 212, 71, 0.4)',
        }}
      >
        <p className="font-vt323 text-base md:text-[1.2rem] text-[#E8C85C] mb-4 md:mb-5 tracking-[1px]">
          🏦 <strong className="text-gold">XAUM</strong> is backed 1:1 by physical gold bars stored
          in secure vaults
        </p>
        <p className="font-vt323 text-sm md:text-base text-[#E8C85C] opacity-80 mb-5 md:mb-6">
          Learn how to convert your XAUM rewards into real, physical gold
        </p>

        {/* Learn More Button */}
        <a
          href="https://www.matrixdock.com/xaum"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 md:px-10 py-3 md:py-[14px] text-black text-base md:text-[1.1rem] font-vt323 font-bold uppercase tracking-[2px] rounded-lg border-[3px] border-[#CBA000] no-underline transition-all duration-200"
          style={{
            background: 'linear-gradient(135deg, #FFD447 0%, #E5C45A 100%)',
            boxShadow: buttonHovered
              ? '0 0 35px rgba(255, 212, 71, 0.8), 0 6px 0 #8B7500'
              : '0 0 20px rgba(255, 212, 71, 0.5), 0 4px 0 #8B7500',
            transform: buttonHovered ? 'translateY(-2px)' : 'translateY(0)',
          }}
          onMouseEnter={() => setButtonHovered(true)}
          onMouseLeave={() => setButtonHovered(false)}
        >
          Learn More About XAUM →
        </a>
      </div>
    </section>
  )
}
