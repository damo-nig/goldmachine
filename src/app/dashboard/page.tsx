import { MiningRigs, ReferralDashboard } from '@/components/dashboard'
import { GoldDivider } from '@/components/shared'

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <MiningRigs xaumDecimals={4} />
      <GoldDivider />
      <ReferralDashboard xaumDecimals={4} />
    </div>
  )
}
