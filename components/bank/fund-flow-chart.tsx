"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts"

import type { FlowPoint } from "@/lib/mock-bank-data"

export function FundFlowChart({ data }: { data: FlowPoint[] }) {
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="flow-in" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="flow-out" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            vertical={false}
            stroke="var(--border)"
            strokeDasharray="4 10"
          />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          />
          <Tooltip
            cursor={{ stroke: "var(--ring)", strokeDasharray: "4 8" }}
            content={({ active, label, payload }) => {
              if (!active || !payload?.length) {
                return null
              }

              const inflow = payload[0]?.value ?? 0
              const outflow = payload[1]?.value ?? 0

              return (
                <div className="rounded-2xl border border-border/70 bg-background/95 px-3 py-2 text-sm shadow-xl backdrop-blur-md">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    {label}
                  </p>
                  <p className="mt-2 text-foreground">
                    Inflow: <span className="font-semibold">${inflow}K</span>
                  </p>
                  <p className="text-foreground">
                    Outflow: <span className="font-semibold">${outflow}K</span>
                  </p>
                </div>
              )
            }}
          />
          <Area
            type="monotone"
            dataKey="inflow"
            stroke="var(--chart-1)"
            strokeWidth={2.5}
            fill="url(#flow-in)"
            activeDot={{ r: 5, fill: "var(--chart-1)" }}
          />
          <Area
            type="monotone"
            dataKey="outflow"
            stroke="var(--chart-2)"
            strokeWidth={2.5}
            fill="url(#flow-out)"
            activeDot={{ r: 5, fill: "var(--chart-2)" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
