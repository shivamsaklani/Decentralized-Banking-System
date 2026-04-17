"use client"

import dynamic from "next/dynamic"
import {
  CircleDollarSign,
  FileLock2,
  Sparkles,
  Wallet2,
} from "lucide-react"
import { motion } from "motion/react"

import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  dashboardOverview,
  flowData,
  protocolEvents,
  treasuryBreakdown,
  contractRecords,
} from "@/lib/mock-bank-data"
import {
  InfoPill,
  MetricCard,
  MiniStat,
  SectionIntro,
} from "@/components/bank/portal-primitives"
import { cn } from "@/lib/utils"

const FundFlowChart = dynamic(
  () =>
    import("@/components/bank/fund-flow-chart").then(
      (module) => module.FundFlowChart
    ),
  { ssr: false }
)

const PortfolioChart = dynamic(
  () =>
    import("@/components/bank/portfolio-chart").then(
      (module) => module.PortfolioChart
    ),
  { ssr: false }
)

const overviewIcons = [Wallet2, FileLock2, CircleDollarSign, Sparkles]

export function OverviewPage() {
  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Overview"
        title="Core member banking metrics at a glance."
        description="This route is the dashboard landing page. It keeps high-signal liquidity, treasury, and protocol health information together before you branch into contracts, transactions, or lending."
        badge="/dashboard"
      />

      <motion.section
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {dashboardOverview.map((item, index) => (
          <MetricCard
            key={item.label}
            icon={overviewIcons[index]}
            label={item.label}
            value={item.value}
            detail={item.detail}
            badge={item.trend}
          />
        ))}
      </motion.section>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <motion.section
          className="panel-surface rounded-[1.8rem] p-5 sm:p-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <SectionIntro
            eyebrow="Fund movement"
            title="Bank inflow and outflow overview"
            badge="Last 7 months"
          />

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <InfoPill label="Inflow volume" value="$4.31M" tone="positive" />
            <InfoPill label="Outflow volume" value="$2.54M" tone="neutral" />
          </div>

          <div className="mt-6">
            <FundFlowChart data={flowData} />
          </div>
        </motion.section>

        <motion.section
          className="panel-surface rounded-[1.8rem] p-5 sm:p-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <SectionIntro
            eyebrow="Treasury mix"
            title="Visible capital distribution"
            badge="Healthy allocation"
          />

          <div className="mt-4">
            <PortfolioChart data={treasuryBreakdown} />
          </div>

          <div className="mt-4 space-y-3">
            {treasuryBreakdown.map((slice, index) => (
              <div
                key={slice.name}
                className="rounded-[1.25rem] border border-border/70 bg-background/60 p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: `var(--chart-${index + 1})` }}
                    />
                    <p className="text-sm font-medium">{slice.name}</p>
                  </div>
                  <p className="text-sm font-semibold">{slice.amount}</p>
                </div>
                <div className="mt-3 h-2 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${slice.value}%`,
                      backgroundColor: `var(--chart-${index + 1})`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <motion.section
          className="panel-surface rounded-[1.8rem] p-5 sm:p-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <SectionIntro
            eyebrow="Protocol health"
            title="Operational guardrails"
            description="Key solvency and operational events stay accessible from the overview route."
          />

          <div className="mt-6 rounded-[1.5rem] border border-border/70 bg-background/60 p-4">
            <p className="text-sm font-medium">Relationship team</p>
            <div className="mt-4 flex items-center justify-between gap-4">
              <AvatarGroup>
                <Avatar>
                  <AvatarFallback>RM</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback>CT</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback>AU</AvatarFallback>
                </Avatar>
              </AvatarGroup>
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                Always available
              </Badge>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            {protocolEvents.map((event) => (
              <div
                key={event.title}
                className="rounded-[1.35rem] border border-border/70 bg-background/60 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">{event.title}</p>
                  <span
                    className={cn(
                      "size-2.5 rounded-full",
                      event.severity === "healthy"
                        ? "bg-emerald-500"
                        : event.severity === "watch"
                          ? "bg-amber-400"
                          : "bg-rose-500"
                    )}
                  />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {event.detail}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="panel-surface rounded-[1.8rem] p-5 sm:p-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <SectionIntro
            eyebrow="Contract snapshot"
            title="Quick agreement health"
            description="Overview keeps the most relevant contract windows visible without moving to the contract route."
          />

          <div className="mt-6 space-y-4">
            {contractRecords.slice(0, 2).map((contract) => (
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
                  <Badge variant="secondary" className="rounded-full px-3 py-1">
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
      </div>
    </div>
  )
}
