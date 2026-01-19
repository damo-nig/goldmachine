import Image from 'next/image'

export default function GoldDivider() {
  return (
    <div className="w-full py-10 flex justify-center items-center gap-5 md:gap-[30px]">
      {/* Left pickaxe */}
      <Image
        src="https://imagedelivery.net/GyRgSdgDhHz2WNR4fvaN-Q/9a1d1ef2-eb1c-472c-fd6d-c1136d61fa00/public"
        alt="Gold Pickaxe"
        width={50}
        height={50}
        className="w-8 h-8 md:w-[50px] md:h-[50px] object-contain drop-shadow-[0_0_10px_rgba(255,215,0,0.6)]"
      />

      {/* Left gold bars */}
      <div className="hidden sm:flex gap-3 items-center">
        <GoldBar width={60} highlightWidth={20} />
        <GoldBar width={40} highlightWidth={12} />
        <GoldBar width={30} highlightWidth={8} />
      </div>

      {/* Center diamond */}
      <div
        className="w-5 h-5 md:w-6 md:h-6 rotate-45 border-2 border-[#8B7500] relative"
        style={{
          background: 'linear-gradient(135deg, #FFD700 0%, #E5C45A 50%, #CBA000 100%)',
          boxShadow: '0 0 30px rgba(255, 215, 0, 0.8), inset 0 2px 0 rgba(255, 255, 255, 0.4)',
        }}
      >
        <div className="absolute top-1 left-1 w-2 h-2 bg-white/50" />
      </div>

      {/* Right gold bars */}
      <div className="hidden sm:flex gap-3 items-center">
        <GoldBar width={30} highlightWidth={8} variant="right" />
        <GoldBar width={40} highlightWidth={12} variant="right" />
        <GoldBar width={60} highlightWidth={20} variant="right" />
      </div>

      {/* Right pickaxe */}
      <Image
        src="https://imagedelivery.net/GyRgSdgDhHz2WNR4fvaN-Q/9a1d1ef2-eb1c-472c-fd6d-c1136d61fa00/public"
        alt="Gold Pickaxe"
        width={50}
        height={50}
        className="w-8 h-8 md:w-[50px] md:h-[50px] object-contain drop-shadow-[0_0_10px_rgba(255,215,0,0.6)]"
      />
    </div>
  )
}

function GoldBar({ 
  width, 
  highlightWidth,
  variant = 'left' 
}: { 
  width: number
  highlightWidth: number
  variant?: 'left' | 'right'
}) {
  const isLeft = variant === 'left'
  
  return (
    <div
      className="h-3 border-2 border-[#8B7500] relative"
      style={{
        width: `${width}px`,
        background: isLeft 
          ? 'linear-gradient(135deg, #FFE55C 0%, #FFD700 50%, #CBA000 100%)'
          : 'linear-gradient(135deg, #FFD700 0%, #CBA000 100%)',
        boxShadow: isLeft
          ? '0 0 20px rgba(255, 215, 0, 0.8), inset 0 2px 0 rgba(255, 255, 255, 0.4)'
          : '0 0 20px rgba(255, 215, 0, 0.6), inset 0 2px 0 rgba(255, 255, 255, 0.3)',
      }}
    >
      <div
        className="absolute top-0.5 left-1 h-0.5"
        style={{
          width: `${highlightWidth}px`,
          background: isLeft ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.6)',
        }}
      />
    </div>
  )
}
