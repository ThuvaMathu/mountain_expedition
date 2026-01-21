"use client"

import { useEffect, useRef, useState } from "react"
import createGlobe, { COBEOptions } from "cobe"
import { useMotionValue, useSpring } from "motion/react"
import { MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

const MOVEMENT_DAMPING = 1400

interface MarkerData {
  location: [number, number]
  size: number
  id: string
}

interface GlobeState {
  phi: number
  theta: number
  width: number
  height: number
}

export function GlobeWithPins({
  className,
  config,
  markers,
  activeMarkerId,
  onMarkerClick,
}: {
  className?: string
  config: COBEOptions
  markers: MarkerData[]
  activeMarkerId?: string
  onMarkerClick?: (id: string) => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const pointerInteracting = useRef<number | null>(null)
  const pointerInteractionMovement = useRef(0)
  const [globeState, setGlobeState] = useState<GlobeState | null>(null)
  const [markerPositions, setMarkerPositions] = useState<Array<{ id: string; x: number; y: number; visible: boolean }>>([])

  const r = useMotionValue(0)
  const rs = useSpring(r, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  })

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab"
    }
  }

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current
      pointerInteractionMovement.current = delta
      r.set(r.get() + delta / MOVEMENT_DAMPING)
    }
  }

  // Convert 3D coordinate to 2D screen position
  const project = (lat: number, lon: number, state: GlobeState, width: number) => {
    const phi = (90 - lat) * (Math.PI / 180)
    const theta = (lon + 180) * (Math.PI / 180)

    const r = 0.5 * width // radius of globe in pixels

    // Apply rotation
    const x = r * Math.sin(phi) * Math.cos(theta - state.phi - Math.PI)
    const y = r * Math.cos(phi)
    const z = r * Math.sin(phi) * Math.sin(theta - state.phi - Math.PI)

    // Check if marker is on the front side of the globe
    const visible = z > 0

    // Project to 2D (center of canvas + offset)
    const centerX = width / 2
    const centerY = width / 2

    // Simple orthographic projection
    const screenX = centerX + x
    const screenY = centerY - y * 0.4 // flatten y for perspective

    return { x: screenX, y: screenY, visible }
  }

  useEffect(() => {
    let phi = 0
    let width = 0

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth
      }
    }

    window.addEventListener("resize", onResize)
    onResize()

    const globe = createGlobe(canvasRef.current!, {
      ...config,
      width: width * 2,
      height: width * 2,
      onRender: (state) => {
        if (!pointerInteracting.current) phi += 0.002
        state.phi = phi + rs.get()
        state.width = width * 2
        state.height = width * 2

        // Update state for marker positioning
        setGlobeState({
          phi: state.phi,
          theta: state.theta,
          width,
          height: width,
        })

        // Calculate marker positions
        const currentState: GlobeState = {
          phi: state.phi,
          theta: state.theta,
          width,
          height: width,
        }
        const positions = markers.map((marker) => {
          const pos = project(marker.location[0], marker.location[1], currentState, width)
          return {
            id: marker.id,
            x: pos.x / 2, // divide by 2 since canvas is 2x resolution
            y: pos.y / 2,
            visible: pos.visible,
          }
        })
        setMarkerPositions(positions)
      },
    })

    setTimeout(() => (canvasRef.current!.style.opacity = "1"), 0)
    return () => {
      globe.destroy()
      window.removeEventListener("resize", onResize)
    }
  }, [rs, config, markers])

  return (
    <div ref={containerRef} className={cn(
      "absolute inset-0 mx-auto aspect-[1/1] w-full max-w-[600px]",
      className
    )}>
      <canvas
        className="size-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]"
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX
          updatePointerInteraction(e.clientX)
        }}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />

      {/* Overlay Pin Icons */}
      {markerPositions.map((pos) => {
        if (!pos.visible) return null
        const marker = markers.find((m) => m.id === pos.id)
        if (!marker) return null

        const isActive = activeMarkerId === pos.id

        return (
          <button
            key={pos.id}
            onClick={() => onMarkerClick?.(pos.id)}
            className="absolute transform -translate-x-1/2 -translate-y-full transition-transform hover:scale-110 cursor-pointer group"
            style={{
              left: `${pos.x}px`,
              top: `${pos.y}px`,
            }}
            title={marker.id}
          >
            <MapPin
              className={cn(
                "drop-shadow-lg transition-colors",
                isActive
                  ? "w-8 h-8 text-amber-500"
                  : "w-6 h-6 text-teal-600 group-hover:text-teal-700"
              )}
              fill={isActive ? "currentColor" : "white"}
            />
            {/* Pulse effect for active marker */}
            {isActive && (
              <span className="absolute inset-0 animate-ping rounded-full bg-amber-400/30" />
            )}
          </button>
        )
      })}
    </div>
  )
}
