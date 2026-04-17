"use client"

import { CircleDollarSign, HandCoins, PiggyBank, ShieldCheck } from "lucide-react"
import { motion } from "motion/react"

import {
  MetricCard,
  MiniStat,
  SectionIntro,
} from "@/components/bank/portal-primitives"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { actionPanels, protocolEvents } from "@/lib/mock-bank-data"
import { cn } from "@/lib/utils"

const lendingMetrics = [
  {
    icon: PiggyBank,
    label: "Deposit rate",
    value: "4.9% APY",
    detail: "Current deposit lane returns shown for the guarded liquidity vault.",
    badge: "Deposit",
  },
  {
    icon: HandCoins,
    label: "Borrow rate",
    value: "6.2% APR",
    detail: "Current borrow lane pricing is surfaced independently on this route.",
    badge: "Borrow",
  },
  {
    icon: CircleDollarSign,
    label: "Borrow power",
    value: "$615K",
    detail: "Available capacity based on current collateral coverage.",
    badge: "182% ratio",
  },
  {
    icon: ShieldCheck,
    label: "Eligibility state",
    value: "Strong",
    detail: "Mock policy engine shows safe room for both loan and deposit actions.",
    badge: "Qualified",
  },
]

export function LendingPage() {
  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Lending"
        title="Route-based page for deposits and borrowing."
        description="`/lending` now acts as its own workspace for deposit and borrow actions, which keeps financial decisions separate from contract browsing or transaction review."
        badge="/lending"
      />

      <motion.section
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {lendingMetrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </motion.section>

      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <motion.section
          className="space-y-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          {actionPanels.map((panel) => (
            <article
              key={panel.title}
              className="panel-surface rounded-[1.8rem] p-5 sm:p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <SectionIntro
                  eyebrow="Action center"
                  title={panel.title}
                  description={panel.note}
                />
                <Badge variant="secondary" className="rounded-full px-3 py-1">
                  {panel.rate}
                </Badge>
              </div>

              <div className="mt-5 space-y-3">
                <label className="block text-sm font-medium" htmlFor={panel.title}>
                  Amount
                </label>
                <Input
                  id={panel.title}
                  type="text"
                  defaultValue={panel.amount}
                  className="h-12 rounded-2xl border-border/80 bg-background/65 px-4"
                />
              </div>

              <div className="mt-5 flex items-center justify-between gap-4 rounded-[1.3rem] border border-border/70 bg-background/60 p-4">
                <div>
                  <p className="text-sm font-medium">Collateral readiness</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Mock credit engine indicates strong eligibility.
                  </p>
                </div>
                <p className="text-lg font-semibold text-primary">
                  {panel.accent === "emerald" ? "98%" : "91%"}
                </p>
              </div>

              <Button
                type="button"
                size="lg"
                className="mt-5 h-12 w-full rounded-2xl text-sm"
              >
                {panel.action}
              </Button>
            </article>
          ))}
        </motion.section>

        <motion.section
          className="space-y-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <article className="panel-surface rounded-[1.8rem] p-5 sm:p-6">
            <SectionIntro
              eyebrow="Policy notes"
              title="Lending guardrails"
              description="This route isolates the most decision-heavy actions, so risk and eligibility notes stay close to the input controls."
            />
            <div className="mt-6 grid gap-3">
              <MiniStat label="Available stablecoin lane" value="$615,000" />
              <MiniStat label="Collateral floor" value="150%" />
              <MiniStat label="Preferred deposit asset" value="USDC" />
            </div>
          </article>

          <article className="panel-surface rounded-[1.8rem] p-5 sm:p-6">
            <SectionIntro
              eyebrow="Signals"
              title="Recent policy events"
              description="Operational signals remain visible here so users do not need to navigate away before acting."
            />
            <div className="mt-6 space-y-3">
              {protocolEvents.map((event) => (
                <div
                  key={event.title}
                  className="rounded-[1.25rem] border border-border/70 bg-background/60 p-4"
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
          </article>
        </motion.section>
      </div>
    </div>
  )
}
