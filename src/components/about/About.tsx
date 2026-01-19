'use client'

import { useState, ReactNode } from 'react'

// ==========================================
// TYPES & DATA
// ==========================================

interface NavItem {
  id: string
  label: string
  children?: { id: string; label: string }[]
}

const NAVIGATION: NavItem[] = [
  { id: 'overview', label: 'Overview' },
  {
    id: 'how-it-works',
    label: 'How It Works',
    children: [
      { id: 'mining-tiers', label: 'Mining Tiers' },
      { id: 'xaum-distribution', label: 'XAUM Distribution' },
      { id: 'referral-system', label: 'Referral System' },
    ],
  },
  {
    id: 'tokenomics',
    label: 'Tokenomics',
    children: [
      { id: 'supply', label: 'Supply' },
      { id: 'tax-structure', label: 'Tax Structure' },
    ],
  },
  { id: 'xaum', label: 'What is XAUM?' },
  { id: 'faq', label: 'FAQ' },
]

// ==========================================
// CONTENT SECTIONS
// ==========================================

function InfoBox({ type = 'info', title, children }: { type?: 'info' | 'warning'; title: string; children: ReactNode }) {
  const colors = type === 'warning' 
    ? { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', title: '#ef4444' }
    : { bg: 'rgba(255, 212, 71, 0.1)', border: 'rgba(255, 212, 71, 0.3)', title: '#FFD447' }
  
  return (
    <div className="rounded-lg p-4 md:p-5 mt-6" style={{ background: colors.bg, border: `1px solid ${colors.border}` }}>
      <strong style={{ color: colors.title }}>{title}</strong>
      <p className="mb-0 mt-2">{children}</p>
    </div>
  )
}

function DataTable({ headers, rows }: { headers: string[]; rows: Array<{ cells: Array<{ value: string; color?: string; align?: 'left' | 'right' }> }> }) {
  return (
    <div className="overflow-x-auto mt-4">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-[#333]">
            {headers.map((h, i) => (
              <th key={i} className="p-3 text-[#888] text-left font-normal">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-[#222]">
              {row.cells.map((cell, j) => (
                <td key={j} className="p-3" style={{ color: cell.color || '#ccc', textAlign: cell.align || 'left' }}>
                  {cell.value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const CONTENT: Record<string, { title: string; content: ReactNode }> = {
  overview: {
    title: 'Overview',
    content: (
      <>
        <p><strong className="text-gold">GOLDMACHINE</strong> is an automated gold distribution protocol built on Binance Smart Chain (BSC). It allows holders of $GM tokens to earn real, tokenized gold (XAUM) simply by holding.</p>
        <p>Unlike traditional staking or farming protocols that reward you with more of the same token, GoldMachine distributes actual gold-backed tokens. Every transaction generates tax revenue that is converted to XAUM and distributed proportionally to all eligible holders.</p>
        <h3>Key Features</h3>
        <ul>
          <li><strong>Passive Gold Income:</strong> Earn XAUM automatically just by holding $GM tokens in your wallet.</li>
          <li><strong>Real Gold Backing:</strong> XAUM is backed 1:1 by physical gold stored in secure vaults.</li>
          <li><strong>No Staking Required:</strong> Your tokens stay in your wallet - no locking, no claiming.</li>
          <li><strong>Proportional Rewards:</strong> The more $GM you hold, the larger your share of gold distributions.</li>
          <li><strong>Referral Bonuses:</strong> Earn 10% of your referrals&apos; XAUM rewards.</li>
        </ul>
        <InfoBox title="How is this different?">
          Most reward tokens pay you in inflationary tokens that lose value over time. GoldMachine pays you in gold - an asset that has held value for thousands of years.
        </InfoBox>
      </>
    ),
  },
  'mining-tiers': {
    title: 'Mining Tiers',
    content: (
      <>
        <p>Your $GM holdings determine your &quot;mining rig&quot; tier. Higher tiers mean greater mining power and a larger share of the gold distributions.</p>
        <h3>Tier Breakdown</h3>
        <DataTable
          headers={['Tier', 'Rig Name', 'Required $GM', 'Mining Power']}
          rows={[
            { cells: [{ value: '1', color: '#8B4513' }, { value: 'Rusty Pickaxe', color: '#8B4513' }, { value: '100,000', color: '#E8C85C', align: 'right' }, { value: '1x', color: '#4ade80', align: 'right' }] },
            { cells: [{ value: '2', color: '#CD7F32' }, { value: 'Old School Drill', color: '#CD7F32' }, { value: '500,000', color: '#E8C85C', align: 'right' }, { value: '5x', color: '#4ade80', align: 'right' }] },
            { cells: [{ value: '3', color: '#DAA520' }, { value: 'Gold Excavator', color: '#DAA520' }, { value: '1,000,000', color: '#E8C85C', align: 'right' }, { value: '12x', color: '#4ade80', align: 'right' }] },
            { cells: [{ value: '4', color: '#FFD700' }, { value: 'Gold Crusher', color: '#FFD700' }, { value: '5,000,000', color: '#E8C85C', align: 'right' }, { value: '35x', color: '#4ade80', align: 'right' }] },
            { cells: [{ value: '5', color: '#FFC125' }, { value: 'Gold Refinery', color: '#FFC125' }, { value: '10,000,000', color: '#E8C85C', align: 'right' }, { value: '75x', color: '#4ade80', align: 'right' }] },
            { cells: [{ value: '6', color: '#FFDF00' }, { value: 'Gold Megamine', color: '#FFDF00' }, { value: '20,000,000', color: '#E8C85C', align: 'right' }, { value: '150x', color: '#4ade80', align: 'right' }] },
          ]}
        />
        <InfoBox title="Note:">
          Mining power determines your share of each distribution. A holder with 35x power receives 35 times more XAUM per distribution than a holder with 1x power (relative to their holdings).
        </InfoBox>
      </>
    ),
  },
  'xaum-distribution': {
    title: 'XAUM Distribution',
    content: (
      <>
        <p>Every buy and sell transaction on $GM generates tax revenue. This tax is automatically converted to XAUM (gold-backed tokens) and distributed to all eligible holders.</p>
        <h3>How It Works</h3>
        <ol>
          <li><strong>Transaction occurs:</strong> Someone buys or sells $GM tokens.</li>
          <li><strong>Tax collected:</strong> 8% tax is taken from the transaction.</li>
          <li><strong>Conversion:</strong> Tax revenue is converted to XAUM gold tokens.</li>
          <li><strong>Distribution:</strong> XAUM is distributed proportionally to all eligible holders.</li>
        </ol>
        <h3>Distribution Formula</h3>
        <div className="bg-[#111] border border-[#333] rounded-lg p-5 mt-4 font-mono">
          <code className="text-green-400">Your XAUM = (Your $GM Holdings / Total Eligible Supply) × Tax Collected</code>
        </div>
        <h3>Key Points</h3>
        <ul>
          <li>Distributions happen automatically with every transaction</li>
          <li>No claiming required - XAUM goes directly to your wallet</li>
          <li>Higher trading volume = more XAUM distributed</li>
          <li>You must be whitelisted (referred) to receive distributions</li>
        </ul>
      </>
    ),
  },
  'referral-system': {
    title: 'Referral System',
    content: (
      <>
        <p>GoldMachine uses a referral system to grow the community. When you refer someone, you earn 10% of all the XAUM they receive from distributions.</p>
        <h3>How to Participate</h3>
        <ol>
          <li><strong>Get Referred:</strong> You need an invite code to become eligible for XAUM distributions.</li>
          <li><strong>Get Your Code:</strong> Once whitelisted, you receive your own unique invite code.</li>
          <li><strong>Share & Earn:</strong> Share your code with others and earn 10% of their XAUM rewards.</li>
        </ol>
        <h3>Referral Rewards</h3>
        <ul>
          <li>Earn <strong className="text-green-400">10%</strong> of your referrals&apos; XAUM distributions</li>
          <li>Rewards are paid automatically when your referrals receive XAUM</li>
          <li>No limit on number of referrals</li>
          <li>Track your referrals and earnings in the Dashboard</li>
        </ul>
        <InfoBox type="warning" title="Important:">
          You must be referred (whitelisted) to receive XAUM distributions. Holding $GM without being referred means you won&apos;t receive gold rewards.
        </InfoBox>
      </>
    ),
  },
  supply: {
    title: 'Supply',
    content: (
      <>
        <p>$GM has a fixed total supply with no minting capability. The tokenomics are designed to be deflationary over time.</p>
        <h3>Token Details</h3>
        <DataTable
          headers={['Property', 'Value']}
          rows={[
            { cells: [{ value: 'Total Supply', color: '#888' }, { value: '1,000,000,000 $GM', color: '#FFD447', align: 'right' }] },
            { cells: [{ value: 'Network', color: '#888' }, { value: 'Binance Smart Chain (BSC)', color: '#E8C85C', align: 'right' }] },
            { cells: [{ value: 'Token Type', color: '#888' }, { value: 'BEP-20', color: '#E8C85C', align: 'right' }] },
            { cells: [{ value: 'Mintable', color: '#888' }, { value: 'No', color: '#ef4444', align: 'right' }] },
          ]}
        />
      </>
    ),
  },
  'tax-structure': {
    title: 'Tax Structure',
    content: (
      <>
        <p>Every $GM transaction includes a tax that funds the gold distribution system. This creates a sustainable reward mechanism for holders.</p>
        <h3>Tax Breakdown</h3>
        <DataTable
          headers={['Transaction', 'Tax Rate']}
          rows={[
            { cells: [{ value: 'Buy Tax', color: '#888' }, { value: '8%', color: '#4ade80', align: 'right' }] },
            { cells: [{ value: 'Sell Tax', color: '#888' }, { value: '8%', color: '#ef4444', align: 'right' }] },
            { cells: [{ value: 'Transfer Tax', color: '#888' }, { value: '0%', color: '#E8C85C', align: 'right' }] },
          ]}
        />
        <h3>Where Does the Tax Go?</h3>
        <p>100% of the collected tax is used to purchase XAUM gold tokens, which are then distributed to eligible $GM holders proportionally based on their holdings and mining tier.</p>
      </>
    ),
  },
  xaum: {
    title: 'What is XAUM?',
    content: (
      <>
        <p><strong className="text-gold">XAUM</strong> is a gold-backed token created by Matrixdock. Each XAUM token is backed 1:1 by physical gold stored in secure, audited vaults.</p>
        <h3>Key Features of XAUM</h3>
        <ul>
          <li><strong>1:1 Gold Backing:</strong> Each token represents ownership of real physical gold.</li>
          <li><strong>Redeemable:</strong> XAUM can be redeemed for physical gold delivery.</li>
          <li><strong>Audited:</strong> Gold reserves are regularly audited and verified.</li>
          <li><strong>Liquid:</strong> Trade XAUM on decentralized exchanges anytime.</li>
        </ul>
        <h3>Learn More</h3>
        <p>For detailed information about XAUM, gold redemption, and vault audits, visit the official Matrixdock website:</p>
        <a
          href="https://www.matrixdock.com/xaum"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 mt-2 bg-gold/20 border border-gold rounded-lg text-gold no-underline font-vt323 text-[1.1rem] hover:bg-gold/30 transition-colors"
        >
          Visit Matrixdock →
        </a>
      </>
    ),
  },
  faq: {
    title: 'FAQ',
    content: (
      <>
        <div className="mb-6">
          <h3 className="text-gold mb-2">How do I start earning XAUM?</h3>
          <p>Buy $GM tokens, get referred using an invite code, and hold. That&apos;s it! XAUM will be distributed to your wallet automatically with every transaction.</p>
        </div>
        <div className="mb-6">
          <h3 className="text-gold mb-2">Do I need to stake my tokens?</h3>
          <p>No. Your $GM tokens stay in your wallet. There&apos;s no staking, locking, or claiming required. Simply hold and receive XAUM automatically.</p>
        </div>
        <div className="mb-6">
          <h3 className="text-gold mb-2">Why do I need to be referred?</h3>
          <p>The referral system helps grow the community organically. Being whitelisted through a referral ensures you&apos;re part of the distribution system and allows your referrer to earn bonus rewards.</p>
        </div>
        <div className="mb-6">
          <h3 className="text-gold mb-2">How often are rewards distributed?</h3>
          <p>Rewards are distributed with every $GM transaction. The more trading activity, the more frequent the distributions.</p>
        </div>
        <div className="mb-6">
          <h3 className="text-gold mb-2">Can I redeem XAUM for physical gold?</h3>
          <p>Yes! XAUM can be redeemed for physical gold through the Matrixdock platform. Visit <a href="https://www.matrixdock.com/xaum" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">matrixdock.com/xaum</a> for details.</p>
        </div>
        <div>
          <h3 className="text-gold mb-2">What&apos;s the minimum holding to earn rewards?</h3>
          <p>There&apos;s no minimum holding to receive distributions. However, reaching the first mining tier (100,000 $GM) significantly increases your mining power and rewards.</p>
        </div>
      </>
    ),
  },
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function About() {
  const [activeSection, setActiveSection] = useState('overview')
  const [expandedItems, setExpandedItems] = useState<string[]>(['how-it-works', 'tokenomics'])
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const handleNavClick = (id: string, hasChildren: boolean) => {
    if (hasChildren) {
      toggleExpanded(id)
    } else {
      setActiveSection(id)
      setMobileMenuOpen(false)
    }
  }

  const currentContent = CONTENT[activeSection] || CONTENT.overview

  return (
    <div className="flex min-h-screen bg-[#0a0a05]">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 p-2 bg-[#111] border border-gold/30 rounded-lg text-gold"
      >
        {mobileMenuOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen w-[280px] min-w-[280px]
          bg-[#0d0d07] border-r border-gold/15 pt-12 pb-8 overflow-y-auto z-40
          transform transition-transform duration-300
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <nav className="mt-8 lg:mt-0">
          {NAVIGATION.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => handleNavClick(item.id, !!item.children)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className="w-full px-6 py-3 text-left font-vt323 text-[1.1rem] flex justify-between items-center transition-all duration-200"
                style={{
                  background:
                    activeSection === item.id
                      ? 'rgba(255, 212, 71, 0.15)'
                      : hoveredItem === item.id
                        ? 'rgba(255, 212, 71, 0.08)'
                        : 'transparent',
                  borderLeft: activeSection === item.id ? '3px solid #FFD447' : '3px solid transparent',
                  color: activeSection === item.id ? '#FFD447' : '#999',
                }}
              >
                <span>{item.label}</span>
                {item.children && (
                  <span
                    className="text-xs transition-transform duration-200"
                    style={{ transform: expandedItems.includes(item.id) ? 'rotate(90deg)' : 'rotate(0deg)' }}
                  >
                    ▶
                  </span>
                )}
              </button>

              {item.children && expandedItems.includes(item.id) && (
                <div>
                  {item.children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => {
                        setActiveSection(child.id)
                        setMobileMenuOpen(false)
                      }}
                      onMouseEnter={() => setHoveredItem(child.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className="w-full px-6 pl-11 py-2.5 text-left font-vt323 text-base transition-all duration-200"
                      style={{
                        background:
                          activeSection === child.id
                            ? 'rgba(255, 212, 71, 0.15)'
                            : hoveredItem === child.id
                              ? 'rgba(255, 212, 71, 0.08)'
                              : 'transparent',
                        borderLeft: activeSection === child.id ? '3px solid #FFD447' : '3px solid transparent',
                        color: activeSection === child.id ? '#FFD447' : '#777',
                      }}
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Main Content */}
      <main className="flex-1 px-6 py-12 md:px-12 lg:px-20 lg:py-12 max-w-[900px]">
        <h1 className="font-vt323 text-3xl md:text-[2.8rem] text-white mb-8 tracking-[2px]">
          {currentContent.title}
        </h1>

        <div className="text-base leading-relaxed text-[#ccc] about-content">
          {currentContent.content}
        </div>
      </main>

      {/* Right spacer */}
      <div className="hidden xl:block w-[100px] min-w-[100px]" />

      <style jsx global>{`
        .about-content p { margin-bottom: 16px; }
        .about-content h3 {
          font-family: 'VT323', monospace;
          font-size: 1.4rem;
          color: #E8C85C;
          margin-top: 32px;
          margin-bottom: 16px;
          letter-spacing: 1px;
        }
        .about-content ul, .about-content ol {
          margin-bottom: 16px;
          padding-left: 24px;
        }
        .about-content li { margin-bottom: 8px; }
        .about-content strong { color: #E8C85C; }
      `}</style>
    </div>
  )
}
