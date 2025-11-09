"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

type Option = { value: string; label: string }

export function TabsToggle({
  defaultValue,
  options,
}: {
  defaultValue: string
  options: Option[]
}) {
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    // Try to sync with the currently active Radix tab if present
    const active = document.querySelector(
      `[data-radix-v2-tabs-trigger][data-state="active"]`
    ) as HTMLElement | null
    const v = active?.getAttribute("data-value")
    if (v) setValue(v)
  }, [])

  return (
    <div className="md:hidden mb-2">
      <div className="flex gap-2 rounded-lg bg-blue-50 p-1">
        {options.map((o) => {
          const active = o.value === value
          return (
            <Button
              key={o.value}
              size="sm"
              variant={active ? "default" : "ghost"}
              className={
                active
                  ? "px-3 h-9 bg-blue-600 text-white"
                  : "px-3 h-9 text-blue-700 hover:bg-blue-100"
              }
              onClick={() => {
                setValue(o.value)
                const el = document.querySelector(
                  `[data-radix-v2-tabs-trigger][data-value="${o.value}"]`
                ) as HTMLElement | null
                el?.click()
              }}
            >
              {o.label}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

