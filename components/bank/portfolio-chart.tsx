"use client"

import { Cell, Label, Pie, PieChart, ResponsiveContainer } from "recharts"

import type { TreasurySlice } from "@/lib/mock-bank-data"

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
]

export function PortfolioChart({ data }: { data: TreasurySlice[] }) {
  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={68}
            outerRadius={94}
            paddingAngle={4}
            stroke="transparent"
          >
            {data.map((slice, index) => (
              <Cell key={slice.name} fill={COLORS[index % COLORS.length]} />
            ))}
            <Label
              position="center"
              content={({ viewBox }) => {
                if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) {
                  return null
                }

                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy - 8}
                      className="fill-foreground text-xl font-semibold"
                    >
                      $4.82M
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy + 16}
                      className="fill-muted-foreground text-xs"
                    >
                      visible capital
                    </tspan>
                  </text>
                )
              }}
            />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
