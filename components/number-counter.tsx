'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

interface NumberCounterProps {
  from?: number
  to: number
  duration?: number
  decimals?: number
  suffix?: string
  prefix?: string
}

export function NumberCounter({
  from = 0,
  to,
  duration = 2,
  decimals = 0,
  suffix = '',
  prefix = '',
}: NumberCounterProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(from)

  useEffect(() => {
    if (!isInView) return

    let startTime: number | null = null
    let animationFrameId: number

    const animate = (currentTime: number) => {
      if (startTime === null) {
        startTime = currentTime
      }

      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / (duration * 1000), 1)

      const value = from + (to - from) * progress
      setCount(parseFloat(value.toFixed(decimals)))

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate)
      }
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrameId)
  }, [isInView, from, to, duration, decimals])

  return (
    <span ref={ref}>
      {prefix}
      {count}
      {suffix}
    </span>
  )
}
