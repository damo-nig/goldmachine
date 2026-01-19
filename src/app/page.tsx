import { GoldDivider } from '@/components/shared'
import {
  BrandHeader,
  StatsGrid,
  HowItWorks,
  RedeemGold,
  JoinTheRush,
  LiveChart,
} from '@/components/home'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <BrandHeader />
      <GoldDivider />
      <StatsGrid />
      <GoldDivider />
      <HowItWorks />
      <GoldDivider />
      <RedeemGold />
      <GoldDivider />
      <JoinTheRush />
      <GoldDivider />
      <LiveChart />
    </div>
  )
}
