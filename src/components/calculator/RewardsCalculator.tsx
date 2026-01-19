'use client'

import { useState, useEffect } from 'react'
import { useStats } from '@/hooks'

export default function RewardsCalculator() {
  const [volume24h, setVolume24h] = useState('426000')
  const [holdings, setHoldings] = useState('1000000')
  const [goldPrice, setGoldPrice] = useState<number | null>(null)

  const { data: stats, error: statsError, isLoading: statsLoading } = useStats()

  const TAX_RATE = 0.08
  const FALLBACK_SUPPLY = 1000000000

  // Fetch live gold price from DexScreener
  useEffect(() => {
    const fetchGoldPrice = async () => {
      try {
        const res = await fetch(
          'https://api.dexscreener.com/latest/dex/pairs/bsc/0x497e224d7008fe47349035ddd98bedb773e1f4c5'
        )
        const data = await res.json()
        if (data?.pairs?.[0]?.priceUsd) {
          setGoldPrice(parseFloat(data.pairs[0].priceUsd))
        }
      } catch (err) {
        console.error('Failed to fetch gold price:', err)
      }
    }

    fetchGoldPrice()
    const interval = setInterval(fetchGoldPrice, 60_000)
    return () => clearInterval(interval)
  }, [])

  const price = goldPrice || 4500

  const circulatingSupply = stats?.circulatingSupply
    ? parseFloat(stats.circulatingSupply)
    : FALLBACK_SUPPLY

  const holdingsNum = parseFloat(holdings) || 0
  const volumeNum = parseFloat(volume24h) || 0

  const userPercentage = (holdingsNum / circulatingSupply) * 100
  const totalTaxCollected = volumeNum * TAX_RATE
  const dailyRewardsUSD = totalTaxCollected * (userPercentage / 100)
  const dailyRewardsOz = dailyRewardsUSD / price

  const monthlyRewardsOz = dailyRewardsOz * 30
  const annualRewardsOz = dailyRewardsOz * 365

  const formatOz = (oz: number): string => oz.toFixed(6)
  const formatUSD = (usd: number): string =>
    usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const formatSupply = (supply: number): string =>
    (supply / 1000000).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + 'M'

  const results = [
    { title: 'Daily Earnings', oz: dailyRewardsOz, usd: dailyRewardsUSD },
    { title: 'Monthly Projection', oz: monthlyRewardsOz, usd: monthlyRewardsOz * price },
    { title: 'Annual Projection', oz: annualRewardsOz, usd: annualRewardsOz * price },
  ]

  return (
    <section className="px-5 md:px-10 pt-10 pb-20 max-w-[1400px] mx-auto">
      <div
        className="rounded-2xl px-6 py-10 md:px-12 md:py-[50px]"
        style={{
          background: 'rgba(10, 10, 10, 0.95)',
          border: '3px solid #FFD447',
          boxShadow: '0 0 40px rgba(255, 212, 71, 0.4)',
        }}
      >
        <h2
          className="font-vt323 text-2xl md:text-[3rem] text-center text-gold uppercase tracking-[3px] md:tracking-[6px] mb-10 md:mb-[50px]"
          style={{ textShadow: '0 0 20px rgba(255, 212, 71, 0.6)' }}
        >
          GOLD REWARDS CALCULATOR
        </h2>

        {/* Live Stats */}
        <div className="text-center mb-8">
          <p className="font-vt323 text-gold text-lg md:text-[1.3rem] mb-2 tracking-[1px]">
            Live Gold Price: <span className="text-green-400">${formatUSD(price)} / Oz. XAUM</span>
          </p>
          <p className="font-vt323 text-gold text-base md:text-[1.2rem] tracking-[1px] opacity-80">
            Circulating Supply:{' '}
            <span className="text-[#E8C85C]">
              {statsLoading
                ? 'Loading...'
                : statsError
                  ? `${formatSupply(FALLBACK_SUPPLY)} (fallback)`
                  : formatSupply(circulatingSupply)}
            </span>{' '}
            $GM
          </p>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-10 md:mb-[50px]">
          {/* Volume Input */}
          <div>
            <label className="font-vt323 text-lg md:text-[1.3rem] text-gold uppercase block mb-3">
              24h Volume (USD)
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-5 text-xl md:text-[1.5rem] text-gold font-vt323">$</span>
              <input
                type="number"
                value={volume24h}
                onChange={(e) => setVolume24h(e.target.value)}
                className="w-full bg-black/60 border-2 border-gold rounded-lg px-5 py-4 md:py-[18px] pl-11 text-lg md:text-[1.4rem] text-gold font-vt323 outline-none focus:shadow-[0_0_15px_rgba(255,212,71,0.3)]"
              />
            </div>
          </div>

          {/* Holdings Input */}
          <div>
            <label className="font-vt323 text-lg md:text-[1.3rem] text-gold uppercase block mb-3">
              Your $GM Holdings
            </label>
            <div className="relative flex items-center">
              <input
                type="number"
                value={holdings}
                onChange={(e) => setHoldings(e.target.value)}
                className="w-full bg-black/60 border-2 border-gold rounded-lg px-5 py-4 md:py-[18px] text-lg md:text-[1.4rem] text-gold font-vt323 outline-none focus:shadow-[0_0_15px_rgba(255,212,71,0.3)]"
              />
              <span className="absolute right-5 text-lg md:text-[1.3rem] text-[#E8C85C] font-vt323 opacity-70">
                $GM
              </span>
            </div>
          </div>
        </div>

        {/* User Share */}
        {holdingsNum > 0 && (
          <p className="text-center font-vt323 text-[#E8C85C] text-base md:text-[1.2rem] mb-8 opacity-90">
            Your share: {userPercentage.toFixed(6)}% of circulating supply
          </p>
        )}

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {results.map((item, i) => (
            <div
              key={i}
              className="rounded-xl p-6 md:p-8 text-center"
              style={{
                background: 'linear-gradient(135deg, #2a2a15 0%, #1a1a0d 100%)',
                border: '2px solid #FFD447',
                boxShadow: '0 0 25px rgba(255, 212, 71, 0.3)',
              }}
            >
              <div className="text-base md:text-[1.2rem] text-[#E8C85C] font-vt323 uppercase mb-4">
                {item.title}
              </div>
              <div
                className="text-3xl md:text-[2.5rem] text-green-400 font-vt323 font-bold"
                style={{ textShadow: '0 0 15px rgba(0, 255, 102, 0.6)' }}
              >
                {formatOz(item.oz)}
              </div>
              <div className="text-base md:text-[1.2rem] text-gold font-vt323 mt-2 opacity-90">
                Oz. XAUM (~${formatUSD(item.usd)})
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="font-vt323 text-sm md:text-base text-[#E8C85C] text-center mt-10 opacity-70">
          * Calculations based on live XAUM price from DexScreener and real-time circulating supply.
          <br />
          Updates every {statsLoading ? '...' : '30'} seconds.
        </p>
      </div>

      <style jsx>{`
        input[type='number']::-webkit-inner-spin-button,
        input[type='number']::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type='number'] {
          -moz-appearance: textfield;
        }
      `}</style>
    </section>
  )
}
