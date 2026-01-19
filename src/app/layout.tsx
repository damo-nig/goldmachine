import type { Metadata } from 'next'
import { VT323 } from 'next/font/google'
import './globals.css'
import { NavBar, Footer, GoldBackground } from '@/components/shared'
import { WalletProvider } from '@/contexts'

const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-vt323',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'GoldMachine | Gold-Based Asset Distribution on BNB Chain',
  description: 'GoldMachine is an automated protocol for gold-based asset distribution on BNB Chain.',
  keywords: ['GoldMachine', 'BNB Chain', 'BSC', 'DeFi', 'Gold', 'Crypto'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={vt323.variable}>
      <body className="min-h-screen">
        <WalletProvider>
          <GoldBackground />
          <NavBar />
          
          {/* Main content with top padding for fixed navbar */}
          <main className="pt-[75px] relative z-10">
            {children}
          </main>
          
          <Footer />
        </WalletProvider>
      </body>
    </html>
  )
}
