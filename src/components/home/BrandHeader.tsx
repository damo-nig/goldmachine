'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function BrandHeader() {
  const [copied, setCopied] = useState(false)

  const handleCopyCA = () => {
    navigator.clipboard.writeText('Coming Soon On BNB Chain')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <header
      className="
        w-full max-w-4xl mx-auto mt-8 md:mt-[60px] 
        px-5 py-10 md:px-[60px] md:py-20
        rounded-xl bg-[rgba(10,10,10,0.95)] border-2 border-gold
        text-center z-[2]
      "
      style={{
        boxShadow: '0 0 40px rgba(255, 212, 71, 0.4)',
      }}
    >
      {/* Animated Title */}
      <motion.h1
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="font-vt323 text-[clamp(2.5rem,8vw,6rem)] tracking-[6px] uppercase m-0 overflow-visible"
        style={{
          background: 'linear-gradient(90deg, #FFD700, #E5C45A, #FFD700, #CBA000)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          backgroundSize: '250% auto',
          textShadow: '0 0 25px rgba(255, 215, 0, 0.25)',
        }}
      >
        GOLDMACHINE
      </motion.h1>

      {/* Subtitle */}
      <p className="text-gold font-vt323 text-[clamp(1rem,3vw,1.25rem)] tracking-[3px] mt-4 opacity-90 uppercase">
        Automated Gold Distribution Protocol
      </p>

      {/* Pre-Launch Status */}
      <div className="flex items-center justify-center gap-2.5 mt-6">
        <motion.span
          animate={{
            opacity: [1, 0.3, 1],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-3.5 h-3.5 bg-[#FF9500] rounded-full"
          style={{
            boxShadow: '0 0 10px #FF9500, 0 0 25px #FF9500',
          }}
        />
        <p className="text-[clamp(0.9rem,2.5vw,1.1rem)] text-gold m-0 tracking-[1px] font-vt323 uppercase">
          Pre-Launch Phase
        </p>
      </div>

      {/* Copy CA Button */}
      <div
        onClick={handleCopyCA}
        className="mt-7 px-8 py-4 bg-gold/10 border-2 border-gold rounded-lg cursor-pointer transition-all duration-200 inline-flex items-center justify-center gap-2.5 hover:bg-gold/20"
      >
        {/* Copy Icon */}
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke={copied ? '#00FF66' : '#FFD447'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={copied ? { scale: [1, 1.3, 1], opacity: [1, 0.5, 1] } : {}}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="w-5 h-5"
          style={{
            filter: copied
              ? 'drop-shadow(0 0 8px #00FF66)'
              : 'drop-shadow(0 0 5px rgba(255,215,0,0.4))',
          }}
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </motion.svg>

        <p
          className={`text-[clamp(0.85rem,2vw,1rem)] m-0 tracking-[1px] font-vt323 uppercase ${
            copied ? 'text-[#00FF66]' : 'text-gold'
          }`}
        >
          {copied ? '✓ Copied!' : 'CA: Coming Soon On BNB Chain'}
        </p>
      </div>
    </header>
  )
}
