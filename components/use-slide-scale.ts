"use client"

import { useEffect, useRef, useState } from "react"

export function useSlideScale(designWidth: number, designHeight: number) {
  const [scale, setScale] = useState(1)
  const [viewportWidth, setViewportWidth] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(0)
  const viewportRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const viewport = viewportRef.current

    if (!viewport) {
      return
    }

    const updateScale = (width: number, height: number) => {
      const padding = width <= 900 ? 12 : 24

      setViewportWidth(width)
      setViewportHeight(height)
      setScale(
        Math.max(
          0.1,
          Math.min(
            (width - padding * 2) / designWidth,
            (height - padding * 2) / designHeight
          )
        )
      )
    }

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0]

      if (!entry) {
        return
      }

      updateScale(entry.contentRect.width, entry.contentRect.height)
    })

    resizeObserver.observe(viewport)

    return () => {
      resizeObserver.disconnect()
    }
  }, [designHeight, designWidth])

  return {
    isResponsiveViewport: false,
    scale,
    viewportHeight,
    viewportWidth,
    viewportRef,
  }
}
