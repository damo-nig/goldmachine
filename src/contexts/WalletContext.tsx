'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

const WALLET_STORAGE_KEY = 'gm_wallet_address'

interface WalletContextType {
  address: string | null
  setAddress: (address: string | null) => void
  disconnect: () => void
  isValidAddress: (address: string) => boolean
}

const WalletContext = createContext<WalletContextType | null>(null)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddressState] = useState<string | null>(null)

  // Validate BSC/ETH address format
  const isValidAddress = useCallback((addr: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(addr)
  }, [])

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(WALLET_STORAGE_KEY)
    if (stored && isValidAddress(stored)) {
      setAddressState(stored)
    }

    // Listen for wallet changes from other components (e.g., NavBar)
    const handleWalletChange = (e: CustomEvent) => {
      if (e.detail && isValidAddress(e.detail)) {
        setAddressState(e.detail)
      } else {
        setAddressState(null)
      }
    }

    window.addEventListener('walletChanged', handleWalletChange as EventListener)

    // Listen for storage changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === WALLET_STORAGE_KEY) {
        if (e.newValue && isValidAddress(e.newValue)) {
          setAddressState(e.newValue)
        } else {
          setAddressState(null)
        }
      }
    }
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('walletChanged', handleWalletChange as EventListener)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [isValidAddress])

  // Set address and persist + broadcast
  const setAddress = useCallback((newAddress: string | null) => {
    if (newAddress && isValidAddress(newAddress)) {
      setAddressState(newAddress)
      localStorage.setItem(WALLET_STORAGE_KEY, newAddress)
      window.dispatchEvent(new CustomEvent('walletChanged', { detail: newAddress }))
    } else if (newAddress === null) {
      setAddressState(null)
      localStorage.removeItem(WALLET_STORAGE_KEY)
      window.dispatchEvent(new CustomEvent('walletChanged', { detail: null }))
    }
  }, [isValidAddress])

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setAddressState(null)
    localStorage.removeItem(WALLET_STORAGE_KEY)
    window.dispatchEvent(new CustomEvent('walletChanged', { detail: null }))
  }, [])

  return (
    <WalletContext.Provider value={{ address, setAddress, disconnect, isValidAddress }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}
