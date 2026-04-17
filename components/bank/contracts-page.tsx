"use client"

import { FileBadge2, Globe2, ShieldCheck, TimerReset } from "lucide-react"
import { motion } from "motion/react"

import {
  MetricCard,
  MiniStat,
  SectionIntro,
} from "@/components/bank/portal-primitives"
import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { contractPreview, contractRecords } from "@/lib/mock-bank-data"

const contractMetrics = [
  {
    icon: FileBadge2,
    label: "Active agreements",
    value: "12",
    detail: "Vaults and borrowing facilities visible in the member portal.",
    badge: "+3 this quarter",
  },
  {
    icon: ShieldCheck,
    label: "Audited surfaces",
    value: "18",
    detail: "Contracts surfaced with health, maturity, and collateral context.",
    badge: "High confidence",
  },
  {
    icon: Globe2,
    label: "Networks covered",
    value: "3",
    detail: "Ethereum, Polygon, and Base remain in the current mock scope.",
    badge: "Multi-chain",
  },
  {
    icon: TimerReset,
    label: "Nearest maturity",
    value: "14 Sep",
    detail: "The next scheduled contract milestone is clearly surfaced here.",
    badge: "26 days",
  },
]

export function ContractsPage() {
  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Contracts"
        title="Dedicated route for live smart agreements."
        description="`/contract` now opens its own page instead of jumping to an anchor. This keeps contract review, status checks, and maturity windows isolated from the other banking workflows."
        badge="/contract"
      />

      <motion.section
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {contractMetrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </motion.section>

      <div className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
        <motion.section
          className="panel-surface rounded-[1.8rem] p-5 sm:p-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SectionIntro
              eyebrow="Smart contracts"
              title="Active funds and agreement windows"
              description="Vaults, borrowing lines, and protection facilities are grouped into one focused contract page."
            />
            <AvatarGroup>
              <Avatar size="sm">
                <AvatarFallback>AU</AvatarFallback>
              </Avatar>
              <Avatar size="sm">
                <AvatarFallback>RM</AvatarFallback>
              </Avatar>
              <Avatar size="sm">
                <AvatarFallback>GC</AvatarFallback>
              </Avatar>
            </AvatarGroup>
          </div>

          <div className="mt-6 space-y-4">
            {contractRecords.map((contract) => (
              <article
                key={contract.name}
                className="rounded-[1.5rem] border border-border/70 bg-background/60 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold">{contract.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {contract.type} • {contract.network}
                    </p>
                  </div>
                  <Badge
                    variant={
                      contract.status === "Monitored" ? "outline" : "secondary"
                    }
                    className="rounded-full px-3 py-1"
                  >
                    {contract.status}
                  </Badge>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <MiniStat label="Rate" value={contract.yield} />
                  <MiniStat label="Collateral" value={contract.collateral} />
                  <MiniStat label="Maturity" value={contract.maturity} />
                </div>
              </article>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="space-y-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <article className="panel-surface rounded-[1.8rem] p-5 sm:p-6">
            <SectionIntro
              eyebrow="Vault preview"
              title="Contracts about to require attention"
              description="A compact list for routes that need quick review or carry the highest user visibility."
            />

            <div className="mt-6 space-y-3">
              {contractPreview.map((contract) => (
                <div
                  key={contract.name}
                  className="rounded-[1.35rem] border border-border/70 bg-background/60 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">{contract.name}</p>
                    <Badge variant="secondary" className="rounded-full px-3 py-1">
                      {contract.status}
                    </Badge>
                  </div>
                  <p className="mt-3 text-xl font-semibold">{contract.tvl}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Network: {contract.chain}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <article className="panel-surface rounded-[1.8rem] p-5 sm:p-6">
            <SectionIntro
              eyebrow="Readability"
              title="Why this route exists"
              description="Contracts often get buried inside summary dashboards. This route gives them their own space, which makes the sidebar and navigation easier to reason about."
            />
            <div className="mt-6 space-y-3">
              <MiniStat label="Dedicated URL" value="/contract" />
              <MiniStat label="Main focus" value="Agreement health" />
              <MiniStat label="Primary action" value="Review contract state" />
            </div>
          </article>
        </motion.section>
      </div>
    </div>
  )
}
