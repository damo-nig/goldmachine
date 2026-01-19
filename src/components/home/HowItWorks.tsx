'use client'

import { useState } from 'react'

const FEATURES = [
  {
    title: '8% Buy Tax',
    description: 'Every purchase of $GM tokens includes an 8% tax that feeds the gold distribution system',
  },
  {
    title: '8% Sell Tax',
    description: 'Every sale of $GM tokens includes an 8% tax that feeds the gold distribution system',
  },
  {
    title: 'Instant XAUM Payouts',
    description: 'XAUM rewards are distributed automatically as soon as transactions occur',
  },
  {
    title: 'Continuous Rewards',
    description: 'Earn XAUM 24/7 as long as you hold $GM tokens in your wallet',
  },
]

export default function HowItWorks() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  return (
    <section className="px-5 md:px-10 pb-16 md:pb-20 max-w-[1400px] mx-auto">
      {/* Title */}
      <h2
        className="font-vt323 text-3xl md:text-[4rem] text-center text-gold uppercase tracking-[4px] md:tracking-[8px] mb-4 md:mb-5"
        style={{ textShadow: '0 0 20px rgba(255, 212, 71, 0.6)' }}
      >
        HOW IT WORKS
      </h2>

      <p className="font-vt323 text-base md:text-[1.3rem] text-center text-[#E8C85C] mb-10 md:mb-[60px] tracking-[1px]">
        Automated gold rewards on every transaction
      </p>

      {/* Features Grid - 2x2 Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-[30px] mb-10 max-w-[1000px] mx-auto">
        {FEATURES.map((feature, index) => {
          const isHovered = hoveredCard === index

          return (
            <div
              key={index}
              className="bg-[#111] border-[3px] border-gold rounded-xl px-6 py-10 md:px-10 md:py-[50px] text-center font-vt323 cursor-pointer transition-all duration-300 min-h-[200px] md:min-h-[220px] flex flex-col justify-center"
              style={{
                background: isHovered ? 'rgba(17, 17, 17, 0.98)' : '#111',
                boxShadow: isHovered
                  ? '0 0 45px rgba(255, 212, 71, 0.8), 0 0 80px rgba(255, 212, 71, 0.4)'
                  : '0 0 25px rgba(255, 212, 71, 0.3)',
                transform: isHovered ? 'scale(1.03)' : 'scale(1)',
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <h3
                className="text-xl md:text-[1.8rem] text-gold mb-3 md:mb-4 uppercase tracking-[2px]"
                style={{ textShadow: '0 0 10px rgba(255, 212, 71, 0.5)' }}
              >
                {feature.title}
              </h3>
              <p className="text-base md:text-[1.1rem] text-[#E8C85C] leading-relaxed opacity-90">
                {feature.description}
              </p>
            </div>
          )
        })}
      </div>

      {/* Info Banner */}
      <div
        className="border-[3px] border-gold rounded-xl px-6 py-6 md:px-10 md:py-[30px] text-center max-w-[1000px] mx-auto"
        style={{
          background: 'linear-gradient(135deg, #2a2a15 0%, #1a1a0d 100%)',
          boxShadow: '0 0 30px rgba(255, 212, 71, 0.4)',
        }}
      >
        <p className="font-vt323 text-base md:text-[1.2rem] text-[#E8C85C] tracking-[1px] m-0">
          💰 All taxes are converted to <strong className="text-gold">XAUM</strong> and distributed
          proportionally to all $GM holders automatically
        </p>
      </div>
    </section>
  )
}
