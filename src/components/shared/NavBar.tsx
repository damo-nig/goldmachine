'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Calculator', href: '/calculator' },
  { label: 'Twitter', href: 'https://x.com/GoldMachinebsc', external: true },
  { label: 'Telegram', href: 'https://t.me/goldmachinebsc', external: true },
]

const WALLET_STORAGE_KEY = 'gm_wallet_address'

const formatAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export default function NavBar() {
  const pathname = usePathname()
  
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const [isWalletHovered, setIsWalletHovered] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Hydration fix - only access localStorage after mount
  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(WALLET_STORAGE_KEY)
    if (stored && /^0x[a-fA-F0-9]{40}$/.test(stored)) {
      setWalletAddress(stored)
    }

    const handleWalletChange = (e: CustomEvent) => {
      if (e.detail) {
        setWalletAddress(e.detail)
        localStorage.setItem(WALLET_STORAGE_KEY, e.detail)
      } else {
        setWalletAddress(null)
        localStorage.removeItem(WALLET_STORAGE_KEY)
      }
    }

    window.addEventListener('walletChanged', handleWalletChange as EventListener)

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === WALLET_STORAGE_KEY) {
        setWalletAddress(e.newValue)
      }
    }
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('walletChanged', handleWalletChange as EventListener)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const handleDisconnect = () => {
    setWalletAddress(null)
    localStorage.removeItem(WALLET_STORAGE_KEY)
    setShowDropdown(false)
    window.dispatchEvent(new CustomEvent('walletChanged', { detail: null }))
  }


  // Hide navbar on genesis page/subdomain
  if (pathname === "/genesis" || (mounted && typeof window !== "undefined" && window.location.hostname === "genesis.goldmachine.xyz")) return null
  return (
    <nav className="fixed top-0 left-0 right-0 z-[1000] h-[75px] px-6 md:px-12 flex items-center justify-between border-b border-gold/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)]" style={{ background: 'linear-gradient(180deg, #0a0a05 0%, #0d0d07 100%)' }}>
      {/* Left section: Logo + Nav Links */}
      <div className="flex items-center gap-6 md:gap-10">
        {/* Logo */}
        <Link
          href="/"
          className="font-vt323 text-xl md:text-[1.7rem] text-gold tracking-[3px] hover:opacity-80 transition-opacity"
          style={{ textShadow: '0 0 10px rgba(255, 212, 71, 0.4)' }}
        >
          GOLDMACHINE
        </Link>

        {/* Nav Links - Hidden on mobile */}
        <div className="hidden lg:flex items-center gap-2">
          {NAV_LINKS.map((link) => {
            const isHovered = hoveredLink === link.label
            
            if (link.external) {
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setHoveredLink(link.label)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className={`font-vt323 text-[1.2rem] px-4 py-2.5 rounded-md tracking-[1px] transition-all duration-200 ${
                    isHovered ? 'text-gold bg-gold/10' : 'text-gray-400'
                  }`}
                >
                  {link.label}
                  <span className="ml-1 text-[0.8rem] opacity-60">↗</span>
                </a>
              )
            }

            return (
              <Link
                key={link.label}
                href={link.href}
                onMouseEnter={() => setHoveredLink(link.label)}
                onMouseLeave={() => setHoveredLink(null)}
                className={`font-vt323 text-[1.2rem] px-4 py-2.5 rounded-md tracking-[1px] transition-all duration-200 ${
                  isHovered ? 'text-gold bg-gold/10' : 'text-gray-400'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Right section: Wallet Status */}
      <div className="relative">
        {mounted && walletAddress ? (
          <div>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              onMouseEnter={() => setIsWalletHovered(true)}
              onMouseLeave={() => setIsWalletHovered(false)}
              className={`flex items-center gap-2.5 px-4 md:px-[22px] py-3 rounded-lg border border-green-400/40 transition-all duration-200 ${
                isWalletHovered ? 'bg-green-400/15' : 'bg-green-400/10'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-[0_0_8px_#4ade80]" />
              <span className="font-vt323 text-[1.15rem] text-green-400 tracking-[1px]">
                {formatAddress(walletAddress)}
              </span>
              <span className="text-green-400 text-[0.7rem]">▼</span>
            </button>

            {showDropdown && (
              <div className="absolute top-[calc(100%+8px)] right-0 bg-[#111] border border-[#333] rounded-lg p-2 min-w-[180px] shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                <button
                  onClick={handleDisconnect}
                  className="w-full px-4 py-3 bg-transparent border-none rounded-md text-red-500 font-vt323 text-base cursor-pointer text-left tracking-[1px] hover:bg-red-500/10 transition-colors"
                >
                  Disconnect Wallet
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/dashboard"
            onMouseEnter={() => setIsWalletHovered(true)}
            onMouseLeave={() => setIsWalletHovered(false)}
            className={`flex items-center gap-2.5 px-4 md:px-[22px] py-3 rounded-lg border border-gold/30 transition-all duration-200 no-underline ${
              isWalletHovered ? 'bg-gold/15' : 'bg-gold/5'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#666]" />
            <span className="font-vt323 text-[1.15rem] text-[#888] tracking-[1px]">
              Connect
            </span>
          </Link>
        )}
      </div>

      {/* Close dropdown when clicking outside */}
      {showDropdown && (
        <div
          className="fixed inset-0 -z-10"
          onClick={() => setShowDropdown(false)}
        />
      )}
      {/* Mobile Hamburger */}
      <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden flex flex-col gap-1.5 p-2">
        <span className="block w-6 h-0.5 bg-gold" />
        <span className="block w-6 h-0.5 bg-gold" />
        <span className="block w-6 h-0.5 bg-gold" />
      </button>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[75px] bottom-0 z-[999] bg-[#0a0a05] p-6 flex flex-col gap-2">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="font-vt323 text-xl text-gray-300 py-3 px-4">Home</Link>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="font-vt323 text-xl text-gray-300 py-3 px-4">About</Link>
          <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="font-vt323 text-xl text-gray-300 py-3 px-4">Dashboard</Link>
          <Link href="/calculator" onClick={() => setMobileMenuOpen(false)} className="font-vt323 text-xl text-gray-300 py-3 px-4">Calculator</Link>
          <a href="https://x.com/GoldMachinebsc" target="_blank" className="font-vt323 text-xl text-gray-300 py-3 px-4">Twitter ↗</a>
          <a href="https://t.me/goldmachinebsc" target="_blank" className="font-vt323 text-xl text-gray-300 py-3 px-4">Telegram ↗</a>
        </div>
      )}
    </nav>
  )
}
