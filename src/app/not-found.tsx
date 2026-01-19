import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5">
      <div
        className="text-center px-8 py-16 md:px-16 md:py-20 rounded-xl max-w-lg"
        style={{
          background: 'rgba(10, 10, 10, 0.95)',
          border: '3px solid #FFD447',
          boxShadow: '0 0 40px rgba(255, 212, 71, 0.3)',
        }}
      >
        <div className="text-6xl mb-6">⛏️</div>
        <h1
          className="font-vt323 text-4xl md:text-6xl text-gold mb-4 tracking-[4px]"
          style={{ textShadow: '0 0 20px rgba(255, 212, 71, 0.6)' }}
        >
          404
        </h1>
        <p className="font-vt323 text-xl md:text-2xl text-[#E8C85C] mb-8">
          THIS MINE IS EMPTY
        </p>
        <p className="font-vt323 text-base text-[#888] mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-4 bg-gold text-black font-vt323 text-lg uppercase tracking-[2px] rounded-lg no-underline hover:bg-gold/90 transition-colors"
          style={{ boxShadow: '0 0 20px rgba(255, 212, 71, 0.4)' }}
        >
          BACK TO HOME
        </Link>
      </div>
    </div>
  )
}
