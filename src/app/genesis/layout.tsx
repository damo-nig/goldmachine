import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Genesis | GoldMachine',
  description: 'Exclusive access to GoldMachine Genesis program.',
}

export default function GenesisLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div 
      className="fixed top-0 left-0 right-0 bottom-0 bg-[#0a0a05] overflow-auto"
      style={{ zIndex: 99999, marginTop: '-75px' }}
    >
      {children}
    </div>
  )
}
