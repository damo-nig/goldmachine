'use client'

import { useEffect, useRef } from 'react'

const CURSOR_URL = 'https://imagedelivery.net/GyRgSdgDhHz2WNR4fvaN-Q/2bf25307-6a9f-4661-b429-783870f0d900/public'

export default function GoldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePos = useRef({ x: 0, y: 0 })

  // Custom gold shovel cursor effect
  useEffect(() => {
    document.body.style.cursor = `url(${CURSOR_URL}) 6 0, auto`

    const style = document.createElement('style')
    style.id = 'gold-cursor-styles'
    style.innerHTML = `
      @keyframes shovelGlow {
        0% { filter: drop-shadow(0 0 0px rgba(255, 215, 0, 0)); transform: scale(1); }
        50% { filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8)); transform: scale(1.25); }
        100% { filter: drop-shadow(0 0 0px rgba(255, 215, 0, 0)); transform: scale(1); }
      }

      html, body, * {
        cursor: url("${CURSOR_URL}") 6 0, auto !important;
      }

      a, button, [role="button"], input[type="button"], input[type="submit"] {
        cursor: url("${CURSOR_URL}") 6 0, auto !important;
        transition: filter 0.25s ease-in-out;
      }

      a:hover, button:hover, [role="button"]:hover, input[type="button"]:hover, input[type="submit"]:hover {
        animation: shovelGlow 0.8s ease-in-out infinite;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.body.style.cursor = 'auto'
      const existingStyle = document.getElementById('gold-cursor-styles')
      if (existingStyle) existingStyle.remove()
    }
  }, [])

  // Canvas particle animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    const canvasWidth = () => canvas.width
    const canvasHeight = () => canvas.height

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      const height = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight,
        5000
      )
      canvas.height = height
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    window.addEventListener('scroll', resizeCanvas)

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Gold Bar class
    class GoldBar {
      x = 0
      y = 0
      width = 0
      height = 0
      speed = 0
      rotation = 0
      rotationSpeed = 0
      opacity = 0
      drift = 0

      constructor() {
        this.reset()
        this.y = Math.random() * canvasHeight()
        this.rotationSpeed = (Math.random() - 0.5) * 0.02
      }

      reset() {
        this.width = 20 + Math.random() * 30
        this.height = this.width * 0.4
        this.x = Math.random() * canvasWidth()
        this.y = -this.height
        this.speed = 0.3 + Math.random() * 0.8
        this.rotation = Math.random() * Math.PI * 2
        this.opacity = 0.3 + Math.random() * 0.4
        this.drift = (Math.random() - 0.5) * 0.5
      }

      update(mouseX: number, mouseY: number) {
        this.y += this.speed
        this.x += this.drift
        this.rotation += this.rotationSpeed

        const parallaxX = (mouseX - canvasWidth() / 2) * 0.005
        const parallaxY = (mouseY - canvasHeight() / 2) * 0.002

        this.x += parallaxX * 0.05
        this.y += parallaxY * 0.02

        if (this.y > canvasHeight() + this.height) {
          this.reset()
        }

        if (this.x < -this.width || this.x > canvasWidth() + this.width) {
          this.x = Math.random() * canvasWidth()
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save()
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2)
        ctx.rotate(this.rotation)

        const pixelSize = 4
        const cols = Math.floor(this.width / pixelSize)
        const rows = Math.floor(this.height / pixelSize)

        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            const brightness = 0.7 + Math.random() * 0.3
            const goldShade = Math.floor(brightness * 255)

            ctx.fillStyle = `rgba(${goldShade}, ${Math.floor(goldShade * 0.84)}, ${Math.floor(goldShade * 0.3)}, ${this.opacity})`
            ctx.fillRect(
              -this.width / 2 + i * pixelSize,
              -this.height / 2 + j * pixelSize,
              pixelSize,
              pixelSize
            )
          }
        }

        ctx.fillStyle = `rgba(255, 230, 120, ${this.opacity * 0.6})`
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, pixelSize)

        ctx.restore()
      }
    }

    // Particle class
    class Particle {
      x = 0
      y = 0
      size = 0
      speed = 0
      opacity = 0
      twinkle = 0

      constructor() {
        this.reset()
        this.y = Math.random() * canvasHeight()
      }

      reset() {
        this.x = Math.random() * canvasWidth()
        this.y = -10
        this.size = 1 + Math.random() * 2
        this.speed = 0.5 + Math.random() * 1.5
        this.opacity = Math.random()
        this.twinkle = Math.random() * Math.PI * 2
      }

      update() {
        this.y += this.speed
        this.twinkle += 0.05

        if (this.y > canvasHeight()) {
          this.reset()
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        const twinkleOpacity = this.opacity * (0.5 + Math.sin(this.twinkle) * 0.5)
        ctx.fillStyle = `rgba(255, 215, 0, ${twinkleOpacity})`
        ctx.fillRect(this.x, this.y, this.size, this.size)
      }
    }

    // Initialize particles
    const goldBars: GoldBar[] = []
    for (let i = 0; i < 50; i++) {
      goldBars.push(new GoldBar())
    }

    const particles: Particle[] = []
    for (let i = 0; i < 120; i++) {
      particles.push(new Particle())
    }

    // Animation loop
    const animate = () => {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight())
      gradient.addColorStop(0, '#0a0a0a')
      gradient.addColorStop(0.5, '#1a1a1a')
      gradient.addColorStop(1, '#0f0f0f')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvasWidth(), canvasHeight())

      particles.forEach((particle) => {
        particle.update()
        particle.draw(ctx)
      })

      goldBars.forEach((bar) => {
        bar.update(mousePos.current.x, mousePos.current.y)
        bar.draw(ctx)
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('scroll', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-screen h-full pointer-events-none -z-10"
    />
  )
}
