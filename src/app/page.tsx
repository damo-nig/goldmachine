'use client';

import { useState, useEffect } from 'react';
import { GoldDivider } from '@/components/shared';
import {
  BrandHeader,
  StatsGrid,
  HowItWorks,
  RedeemGold,
  JoinTheRush,
  LiveChart,
} from '@/components/home';
import GoldMachineLoader from '@/components/home/GoldMachineLoader';

export default function HomePage() {
  const [showLoader, setShowLoader] = useState(true);
  const [hasSeenLoader, setHasSeenLoader] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem('gm-loader-seen');
    if (seen) {
      setShowLoader(false);
      setHasSeenLoader(true);
    }
  }, []);

  const handleLoaderComplete = () => {
    sessionStorage.setItem('gm-loader-seen', 'true');
    setShowLoader(false);
  };

  if (showLoader && !hasSeenLoader) {
    return <GoldMachineLoader onComplete={handleLoaderComplete} />;
  }

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
  );
}
