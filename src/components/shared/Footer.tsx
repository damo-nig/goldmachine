'use client'

import { usePathname } from 'next/navigation'

import { motion } from 'framer-motion'

const FOOTER_LINKS = [
  { label: 'Telegram', url: 'https://t.me/goldmachinebsc' },
  { label: 'BscScan', url: 'https://bscscan.com/error?e=5&t=comingsoon' },
  { label: 'X (Twitter)', url: 'https://x.com/GoldMachinebsc' },
]

export default function Footer() {
  const pathname = usePathname()
  
  // Hide footer on genesis page
  if (pathname === '/genesis') return null

  // Also hide on genesis subdomain
  if (typeof window !== 'undefined' && window.location.hostname === 'genesis.goldmachine.xyz') return null

  return (
    <footer className="w-[calc(100%-32px)] max-w-[1200px] mx-auto mb-8 bg-[rgba(10,10,10,0.95)] border-2 border-gold rounded-[10px] py-10 pb-[60px] text-center text-gold font-vt323 uppercase tracking-[2px] relative shadow-[0_0_60px_rgba(255,212,71,0.4),inset_0_0_25px_rgba(255,212,71,0.2)]">
      {/* Animated Divider Glow */}
      <motion.div
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="w-[140px] h-0.5 mx-auto mb-6 shadow-[0_0_15px_rgba(255,212,71,0.7)]"
        style={{
          background: 'linear-gradient(90deg, transparent, #FFD447, transparent)',
        }}
      />

      {/* Title */}
      <h2 
        className="text-2xl md:text-[2rem] mb-4"
        style={{ textShadow: '0 0 20px rgba(255, 212, 71, 0.6)' }}
      >
        GoldMachine
      </h2>

      {/* Nav Links */}
      <div className="flex justify-center gap-8 md:gap-[60px] flex-wrap mb-5 text-base opacity-85">
        {FOOTER_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold no-underline transition-all duration-200 hover:shadow-[0_0_15px_rgba(255,212,71,0.8)]"
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Disclaimer */}
      <p className="text-sm md:text-[0.9rem] opacity-70 max-w-[900px] mx-auto mb-5 leading-relaxed px-4">
        GoldMachine is an automated protocol for gold-based asset distribution on BNB Chain. 
        Always verify contract addresses and exercise caution when interacting with DeFi platforms.
      </p>

      {/* Bottom Note */}
      <p className="text-base opacity-60 mt-6 tracking-[1px]">
        © {new Date().getFullYear()} GoldMachine. All rights reserved.
      </p>
    </footer>
  )
}
