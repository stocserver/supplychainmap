"use client"

import React from "react"

type Option = { value: string; label: string }

export function TabsSelect({
  defaultValue,
  options,
  id = "tabs-select",
}: {
  defaultValue: string
  options: Option[]
  id?: string
}) {
  return (
    <div className="md:hidden mb-2">
      <label htmlFor={id} className="sr-only">
        Select section
      </label>
      <select
        id={id}
        className="w-full rounded-md border bg-background px-3 py-2 text-sm"
        defaultValue={defaultValue}
        onChange={(e) => {
          const val = e.target.value
          const el = document.querySelector(
            `[data-radix-v2-tabs-trigger][data-value="${val}"]`
          ) as HTMLElement | null
          el?.click()
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

