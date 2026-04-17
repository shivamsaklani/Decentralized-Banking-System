"use client"

import dynamic from "next/dynamic"
import { ArrowDownLeft, ArrowUpRight, Landmark, ReceiptText, ShieldCheck } from "lucide-react"
import { motion } from "motion/react"

import {
  InfoPill,
  MetricCard,
  SectionIntro,
} from "@/components/bank/portal-primitives"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { flowData, transactionRecords } from "@/lib/mock-bank-data"

const FundFlowChart = dynamic(
  () =>
    import("@/components/bank/fund-flow-chart").then(
      (module) => module.FundFlowChart
    ),
  { ssr: false }
)

const transactionMetrics = [
  {
    icon: Landmark,
    label: "Inflow settled today",
    value: "$129.8K",
    detail: "Reserve top-ups and returned interest are landing normally.",
    badge: "Incoming",
  },
  {
    icon: ArrowUpRight,
    label: "Outflow sent today",
    value: "$64.7K",
    detail: "Borrow disbursements and treasury rebalances remain visible.",
    badge: "Outgoing",
  },
  {
    icon: ReceiptText,
    label: "Ledger entries",
    value: "48",
    detail: "Recent transaction events are grouped into a dedicated ledger route.",
    badge: "24h view",
  },
  {
    icon: ShieldCheck,
    label: "Settlement quality",
    value: "99.98%",
    detail: "Current ledger reliability stays inside the expected health band.",
    badge: "Stable",
  },
]

export function TransactionsPage() {
  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Transactions"
        title="Route-based ledger view for incoming and outgoing bank activity."
        description="`/transactions` now opens its own page so members can review bank movement without mixing it into contract or lending screens."
        badge="/transactions"
      />

      <motion.section
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {transactionMetrics.map((metric) => (
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
          <SectionIntro
            eyebrow="Bank transactions"
            title="Latest in and out ledger activity"
            description="This page isolates the transaction feed and makes direction, counterparty, and settlement state faster to scan."
            badge="4 recent movements"
          />

          <div className="mt-6 space-y-4">
            {transactionRecords.map((transaction) => {
              const isIncoming = transaction.direction === "in"

              return (
                <article
                  key={`${transaction.title}-${transaction.time}`}
                  className="rounded-[1.5rem] border border-border/70 bg-background/60 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "rounded-2xl p-3",
                          isIncoming
                            ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300"
                            : "bg-sky-500/12 text-sky-700 dark:text-sky-300"
                        )}
                      >
                        {isIncoming ? (
                          <ArrowDownLeft className="size-5" />
                        ) : (
                          <ArrowUpRight className="size-5" />
                        )}
                      </div>
                      <div>
                        <p className="text-base font-semibold">{transaction.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {transaction.contract} • {transaction.counterparty}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p
                        className={cn(
                          "text-lg font-semibold",
                          isIncoming
                            ? "text-emerald-700 dark:text-emerald-300"
                            : "text-sky-700 dark:text-sky-300"
                        )}
                      >
                        {transaction.amount}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {transaction.time}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <Badge variant="secondary" className="rounded-full px-3 py-1">
                      {transaction.status}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Direction: {transaction.direction.toUpperCase()}
                    </p>
                  </div>
                </article>
              )
            })}
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
              eyebrow="Movement pattern"
              title="Recent treasury flow curve"
              description="A transaction-specific chart makes flow review available on its own route."
            />

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <InfoPill label="Positive flow" value="$4.31M" tone="positive" />
              <InfoPill label="Negative flow" value="$2.54M" tone="neutral" />
            </div>

            <div className="mt-6">
              <FundFlowChart data={flowData} />
            </div>
          </article>

          <article className="panel-surface rounded-[1.8rem] p-5 sm:p-6">
            <SectionIntro
              eyebrow="Ledger notes"
              title="Operational visibility"
              description="This route helps members focus only on money movement when they do not need broader dashboard context."
            />
            <div className="mt-6 space-y-3">
              <InfoPill label="Dedicated URL" value="/transactions" tone="neutral" />
              <InfoPill label="Primary goal" value="Review inflow and outflow" tone="positive" />
            </div>
          </article>
        </motion.section>
      </div>
    </div>
  )
}
