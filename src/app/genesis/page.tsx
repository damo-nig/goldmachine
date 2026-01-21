'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

// Generate random particles
const particles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 5,
  duration: 3 + Math.random() * 4,
  size: 2 + Math.random() * 3,
}))

export default function GenesisPage() {
  const [code, setCode] = useState('')
  const [referralLink, setReferralLink] = useState('')

  const handleSubmit = () => {
    if (code.trim()) {
      setReferralLink(`https://goldmachine.xyz/dashboard?ref=${code.trim()}`)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a05] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      
      {/* Lamp fixture on top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
        {/* Lamp rod */}
        <div className="w-1 h-8 bg-gradient-to-b from-gold/80 to-gold/40" />
        {/* Lamp head */}
        <div 
          className="w-20 h-6 rounded-b-full bg-gradient-to-b from-gold to-yellow-600"
          style={{ boxShadow: '0 0 20px rgba(255,212,71,0.6)' }}
        />
        {/* Light bulb glow - pulsing */}
        <motion.div 
          animate={{ 
            boxShadow: [
              '0 0 30px 10px rgba(255,212,71,0.6)',
              '0 0 50px 20px rgba(255,212,71,0.9)',
              '0 0 30px 10px rgba(255,212,71,0.6)',
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="w-4 h-4 rounded-full bg-gold mt-[-2px]"
        />
      </div>

      {/* Pulsing spotlight cone from lamp */}
      <motion.div 
        animate={{ 
          opacity: [0.06, 0.12, 0.06],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: '0',
          height: '0',
          borderLeft: '300px solid transparent',
          borderRight: '300px solid transparent',
          borderTop: '600px solid rgba(255,212,71,0.15)',
          filter: 'blur(30px)',
        }}
      />
      
      {/* Secondary pulsing glow */}
      <motion.div 
        animate={{ 
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[800px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top, rgba(255,212,71,0.2) 0%, rgba(255,212,71,0.05) 40%, transparent 70%)',
        }}
      />

      {/* Floating gold particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gold pointer-events-none"
          style={{
            left: `${particle.left}%`,
            width: particle.size,
            height: particle.size,
            opacity: 0,
          }}
          animate={{
            y: ['-10vh', '110vh'],
            opacity: [0, 0.8, 0.8, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'linear',
          }}
        />
      ))}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.div 
          initial={{ width: 0 }} 
          animate={{ width: 100 }}
          transition={{ duration: 1 }}
          className="h-[2px] mb-8" 
          style={{
            background: 'linear-gradient(90deg, transparent, #FFD447, transparent)',
            boxShadow: '0 0 20px rgba(255,212,71,0.5)',
          }}
        />
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-vt323 text-6xl md:text-8xl text-gold tracking-[8px] md:tracking-[12px] mb-4 uppercase"
          style={{ textShadow: '0 0 40px rgba(255,212,71,0.5)' }}
        >
          Genesis
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-vt323 text-gold/60 text-lg tracking-[4px] mb-12 uppercase"
        >
          Exclusive Access
        </motion.p>
        
        {!referralLink ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full max-w-md"
          >
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="ENTER INVITE CODE"
              className="font-vt323 w-full bg-black/50 border-2 border-gold/50 text-gold text-center text-2xl py-5 focus:outline-none focus:border-gold focus:shadow-[0_0_20px_rgba(255,212,71,0.3)] transition-all placeholder:text-gold/30 tracking-[4px] uppercase"
            />
            <button 
              onClick={handleSubmit}
              className="font-vt323 w-full mt-6 py-5 bg-gold text-black text-xl tracking-[6px] hover:shadow-[0_0_30px_rgba(255,212,71,0.6)] transition-all uppercase"
            >
              Enter
            </button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10 }}
              className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center"
            >
              <span className="text-gold text-3xl">✓</span>
            </motion.div>
            <p className="font-vt323 text-gold text-lg mb-4 tracking-wider uppercase">Your Referral Link</p>
            <div className="bg-black/50 border-2 border-gold/50 p-4 mb-4">
              <p className="font-vt323 text-gold text-sm break-all">{referralLink}</p>
            </div>
            <button 
              onClick={() => navigator.clipboard.writeText(referralLink)}
              className="font-vt323 w-full py-5 bg-gold text-black text-xl tracking-[6px] hover:shadow-[0_0_30px_rgba(255,212,71,0.6)] transition-all uppercase"
            >
              Copy Link
            </button>
            <button 
              onClick={() => { setReferralLink(''); setCode(''); }}
              className="font-vt323 w-full mt-3 py-4 border border-gold/50 text-gold tracking-[4px] hover:bg-gold/10 transition-all uppercase"
            >
              Enter Another Code
            </button>
          </motion.div>
        )}
      </div>
      
      {/* Footer text links */}
      <div className="absolute bottom-8 flex items-center gap-2 font-vt323 text-gold/50 text-sm">
        <a href="https://t.me/goldmachinebsc" target="_blank" className="hover:text-gold transition-colors">Telegram</a>
        <span>•</span>
        <a href="https://x.com/GoldMachinebsc" target="_blank" className="hover:text-gold transition-colors">Twitter</a>
        <span>•</span>
        <a href="https://goldmachine.xyz" target="_blank" className="hover:text-gold transition-colors">Website</a>
      </div>
    </div>
  )
}
