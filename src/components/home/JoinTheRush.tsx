'use client'

import { useState } from 'react'

const SOCIAL_LINKS = [
  {
    label: 'Telegram',
    href: 'https://t.me/goldmachinebsc',
    icon: '💬',
  },
  {
    label: 'Twitter',
    href: 'https://twitter.com/goldloading',
    icon: '🐦',
  },
]

export default function JoinTheRush() {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)

  return (
    <section className="px-5 md:px-10 py-10 md:py-16 max-w-[1200px] mx-auto">
      {/* Main CTA Card */}
      <div
        className="border-[3px] border-gold rounded-xl px-6 py-12 md:px-16 md:py-16 text-center"
        style={{
          background: 'linear-gradient(135deg, rgba(20, 20, 10, 0.95) 0%, rgba(10, 10, 5, 0.98) 100%)',
          boxShadow: '0 0 50px rgba(255, 212, 71, 0.4), inset 0 0 30px rgba(255, 212, 71, 0.1)',
        }}
      >
        {/* Title */}
        <h2
          className="font-vt323 text-3xl md:text-[4rem] text-gold uppercase tracking-[4px] md:tracking-[8px] mb-4 md:mb-6"
          style={{ textShadow: '0 0 25px rgba(255, 212, 71, 0.7)' }}
        >
          JOIN THE GOLD RUSH
        </h2>

        {/* Subtitle */}
        <p className="font-vt323 text-lg md:text-[1.4rem] text-[#E8C85C] mb-8 md:mb-10 tracking-[1px] max-w-[600px] mx-auto leading-relaxed">
          Be part of the first automated gold distribution protocol on BNB Chain. 
          Join our community and stay updated on the launch.
        </p>

        {/* Social Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
          {SOCIAL_LINKS.map((link) => {
            const isHovered = hoveredButton === link.label

            return (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 md:px-12 py-4 md:py-5 font-vt323 text-lg md:text-[1.3rem] uppercase tracking-[2px] rounded-lg border-[3px] no-underline transition-all duration-200 flex items-center justify-center gap-3"
                style={{
                  background: isHovered
                    ? 'rgba(255, 212, 71, 0.2)'
                    : 'rgba(255, 212, 71, 0.1)',
                  borderColor: '#FFD447',
                  color: '#FFD447',
                  boxShadow: isHovered
                    ? '0 0 40px rgba(255, 212, 71, 0.6)'
                    : '0 0 20px rgba(255, 212, 71, 0.3)',
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                }}
                onMouseEnter={() => setHoveredButton(link.label)}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <span className="text-2xl">{link.icon}</span>
                {link.label}
              </a>
            )
          })}
        </div>

        {/* Bottom Text */}
        <p className="font-vt323 text-sm md:text-base text-[#E8C85C] opacity-70 mt-8 md:mt-10 tracking-[1px]">
          🚀 Launching Soon on BNB Chain
        </p>
      </div>
    </section>
  )
}
