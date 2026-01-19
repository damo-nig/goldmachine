export default function LiveChart() {
  return (
    <section className="px-4 md:px-5 py-5 w-full max-w-[1800px] mx-auto">
      {/* Title */}
      <h2
        className="font-vt323 text-3xl md:text-[4rem] text-center text-gold uppercase tracking-[4px] md:tracking-[8px] mb-8 md:mb-[50px]"
        style={{ textShadow: '0 0 20px rgba(255, 212, 71, 0.6)' }}
      >
        LIVE CHART
      </h2>

      {/* Chart Container with Gold Border */}
      <div
        className="border-4 border-gold rounded-2xl overflow-hidden p-1 bg-gold"
        style={{ boxShadow: '0 0 40px rgba(255, 212, 71, 0.5)' }}
      >
        {/* DexScreener Embed */}
        <div className="relative w-full h-[500px] md:h-[900px] overflow-hidden rounded-xl">
          <iframe
            src="https://dexscreener.com/arbitrum/0x753ba05488cac9b3f7d59ff7d3f13f31bb5edf22?embed=1&theme=dark&tabs=0&info=0&trades=0&loadChartSettings=1&chartLeftToolbar=1&chartType=usd&interval=15"
            className="absolute top-0 left-0 w-full h-full border-none rounded-xl block"
            loading="lazy"
            allowFullScreen
            title="GoldMachine Live Chart"
          />
        </div>
      </div>
    </section>
  )
}
