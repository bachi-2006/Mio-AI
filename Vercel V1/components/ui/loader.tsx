"use client"

import { useEffect } from "react"
import { dotPulse } from "ldrs"

export function Loader() {
  useEffect(() => {
    dotPulse.register()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center">
      <l-dot-pulse size="43" speed="1.3" color="var(--primary-color, #0EA5E9)"></l-dot-pulse>
    </div>
  )
}
