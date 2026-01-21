import type { Metadata } from 'next'
import { VT323 } from 'next/font/google'
import './globals.css'
import { NavBar, Footer, GoldBackground } from '@/components/shared'
import { WalletProvider } from '@/contexts'
import { headers } from 'next/headers'

const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-vt323',
  display: 'swap',
})

export const metadata: Metadata = {
  icons: {
    icon: 'https://imagedelivery.net/GyRgSdgDhHz2WNR4fvaN-Q/356b80e8-e343-4685-fa11-7bb7ea1ca500/public',
  },
  title: 'GoldMachine',
  description: 'GoldMachine is an automated protocol for gold-based asset distribution on BNB Chain.',
  keywords: ['GoldMachine', 'BNB Chain', 'BSC', 'DeFi', 'Gold', 'Crypto'],
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''
  const isGenesisPage = pathname.includes('/genesis')

  return (
    <html lang="en" className={vt323.variable}>
      <body className="min-h-screen">
        <WalletProvider>
          {!isGenesisPage && <GoldBackground />}
          {!isGenesisPage && <NavBar />}
          
          {/* Main content with top padding for fixed navbar */}
          <main className={!isGenesisPage ? "pt-[75px] relative z-10" : ""}>
            {children}
          </main>
          
          {!isGenesisPage && <Footer />}
        </WalletProvider>
      </body>
    </html>
  )
}
