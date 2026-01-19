"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface Snowflake {
  x: number
  y: number
  radius: number
  speed: number
  opacity: number
  drift: number
}

interface SnowfallProps {
  className?: string
  quantity?: number
  color?: string
  minSpeed?: number
  maxSpeed?: number
}

export function Snowfall({
  className = "",
  quantity = 100,
  color = "#ffffff",
  minSpeed = 0.5,
  maxSpeed = 2,
}: SnowfallProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const snowflakesRef = useRef<Snowflake[]>([])
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = container.offsetWidth * dpr
      canvas.height = container.offsetHeight * dpr
      canvas.style.width = `${container.offsetWidth}px`
      canvas.style.height = `${container.offsetHeight}px`
      ctx.scale(dpr, dpr)
    }

    const createSnowflakes = () => {
      const width = container.offsetWidth
      const snowflakes: Snowflake[] = []

      for (let i = 0; i < quantity; i++) {
        snowflakes.push({
          x: Math.random() * width,
          y: Math.random() * container.offsetHeight,
          radius: Math.random() * 2 + 1,
          speed: Math.random() * (maxSpeed - minSpeed) + minSpeed,
          opacity: Math.random() * 0.5 + 0.3,
          drift: Math.random() * 2 - 1, // Random horizontal drift
        })
      }

      snowflakesRef.current = snowflakes
    }

    const hexToRgb = (hex: string) => {
      hex = hex.replace("#", "")
      if (hex.length === 3) {
        hex = hex.split("").map((c) => c + c).join("")
      }
      const hexInt = parseInt(hex, 16)
      return [
        (hexInt >> 16) & 255,
        (hexInt >> 8) & 255,
        hexInt & 255,
      ]
    }

    const rgb = hexToRgb(color)

    const animate = () => {
      const width = container.offsetWidth
      const height = container.offsetHeight

      ctx.clearRect(0, 0, width, height)

      snowflakesRef.current.forEach((flake) => {
        // Update position
        flake.y += flake.speed
        flake.x += Math.sin(flake.y * 0.01) * 0.3 + flake.drift * 0.1

        // Reset to top when reaching bottom
        if (flake.y > height + flake.radius) {
          flake.y = -flake.radius
          flake.x = Math.random() * width
        }

        // Wrap horizontally
        if (flake.x > width + flake.radius) {
          flake.x = -flake.radius
        } else if (flake.x < -flake.radius) {
          flake.x = width + flake.radius
        }

        // Draw snowflake
        ctx.beginPath()
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${flake.opacity})`
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    // Initialize
    resizeCanvas()
    createSnowflakes()
    animate()

    // Handle resize
    const handleResize = () => {
      resizeCanvas()
      createSnowflakes()
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener("resize", handleResize)
    }
  }, [quantity, color, minSpeed, maxSpeed])

  return (
    <div
      ref={containerRef}
      className={cn("pointer-events-none absolute inset-0", className)}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="size-full" />
    </div>
  )
}
