import Link from "next/link"
import {
  ArrowRight,
  ChartNoAxesCombined,
  FileLock2,
  HandCoins,
  LayoutDashboard,
  ShieldCheck,
  Smartphone,
} from "lucide-react"

import { HeroLoginPanel } from "@/components/bank/hero-login-panel"
import { SiteHeader } from "@/components/bank/site-header"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const trustMetrics = [
  { value: "99.98%", label: "Ledger health", detail: "Near-zero drift between contract state and UI feeds." },
  { value: "$4.8M+", label: "Visible treasury", detail: "Mock aggregated liquidity across all active vaults." },
  { value: "0ms", label: "Settlement lag", detail: "Transactions reflect instantly upon block confirmation." },
]

const productPillars = [
  { eyebrow: "Monitoring", title: "Live treasury flow", description: "Each action reflects instantly across inflow and outflow ledger cards." },
  { eyebrow: "Architecture", title: "Contract workspace", description: "Isolate agreements into their own route to maintain deep visibility." },
  { eyebrow: "Efficiency", title: "Action cards", description: "Lending, deposits, and transfers happen through focused input shells." },
  { eyebrow: "Mobility", title: "Responsive shell", description: "The entire banking portal is built to be manageable on any device." },
]

const pillarIcons = [
  LayoutDashboard,
  FileLock2,
  ChartNoAxesCombined,
  Smartphone,
]

const contractHighlights = [
  {
    title: "Dedicated user dashboards",
    detail:
      "Each member sees funds, contracts, transaction flow, and lending controls from one route-first workspace.",
  },
  {
    title: "Readable contract state",
    detail:
      "Maturity dates, collateral coverage, and yield status stay visible without digging through protocol internals.",
  },
  {
    title: "Treasury-safe transaction history",
    detail:
      "Incoming and outgoing bank transactions are grouped into a clean ledger that is easy to scan on mobile.",
  },
]

const lendingCards = [
  {
    title: "Deposit flow",
    metric: "4.9% APY",
    detail: "Move capital into guarded liquidity pools with a single action card.",
    icon: ShieldCheck,
  },
  {
    title: "Borrow flow",
    metric: "6.2% APR",
    detail: "Preview borrowing power and collateral health before initiating a loan.",
    icon: HandCoins,
  },
]

export default function Home() {
  return (
    <div className="pb-24">
      <SiteHeader />

      <main>
        <section className="shell-container pt-8 sm:pt-12 lg:pt-16">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <Badge className="rounded-full px-3 py-1 text-xs" variant="secondary">
                Next.js banking UI concept
              </Badge>
              <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[1.02] tracking-tight text-balance sm:text-6xl lg:text-7xl">
                Decentralized banking with a calm, premium member experience.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                This UI prototype gives each user a dedicated dashboard to monitor
                funds, smart contracts, bank inflows and outflows, and lending
                actions from a responsive interface built for desktop and mobile.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/dashboard"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-12 rounded-2xl px-5"
                  )}
                >
                  Open dashboard preview
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="#overview"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-12 rounded-2xl border-border/80 bg-background/70 px-5 backdrop-blur-md"
                  )}
                >
                  Explore the interface
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {trustMetrics.map((metric) => (
                  <article
                    key={metric.label}
                    className="rounded-[1.6rem] border border-border/70 bg-card/80 p-5 shadow-[0_24px_80px_-58px_rgba(5,19,30,0.9)] backdrop-blur-xl"
                  >
                    <p className="text-3xl font-semibold">{metric.value}</p>
                    <p className="mt-2 text-sm font-medium">{metric.label}</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {metric.detail}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <HeroLoginPanel />
          </div>
        </section>

        <section id="overview" className="shell-container mt-16 sm:mt-20">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.34em] text-primary/80">
                Interface pillars
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Designed around the exact banking workflows you asked for.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-muted-foreground">
              The experience stays focused on visibility, confidence, and fast
              action: login, funds, contracts, transaction flows, deposits, and
              loans all live inside a modern banking shell.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {productPillars.map((pillar, index) => {
              const Icon = pillarIcons[index]

              return (
                <article
                  key={pillar.title}
                  className="panel-surface rounded-[1.8rem] p-5 sm:p-6"
                >
                  <div className="w-fit rounded-2xl border border-primary/20 bg-primary/10 p-3 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <p className="mt-5 font-mono text-[0.68rem] uppercase tracking-[0.34em] text-primary/80">
                    {pillar.eyebrow}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight text-balance">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {pillar.description}
                  </p>
                </article>
              )
            })}
          </div>
        </section>

        <section className="shell-container mt-6">
          <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
            <article
              id="contracts"
              className="panel-surface rounded-[1.9rem] p-6 sm:p-7"
            >
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.34em] text-primary/80">
                Contracts
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                Smart contracts stay readable and actionable.
              </h2>
              <div className="mt-6 space-y-4">
                {contractHighlights.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[1.45rem] border border-border/70 bg-background/60 p-4"
                  >
                    <p className="text-base font-semibold">{item.title}</p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            <article
              id="flows"
              className="panel-surface soft-grid rounded-[1.9rem] p-6 sm:p-7"
            >
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.34em] text-primary/80">
                Transaction flows
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                Bank inflows and outflows are surfaced like a live command view.
              </h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[1.5rem] border border-border/70 bg-background/70 p-5">
                  <p className="text-sm text-muted-foreground">In transactions</p>
                  <p className="mt-3 text-3xl font-semibold text-emerald-700 dark:text-emerald-300">
                    +$129K
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Reserve top-ups and interest returns from active vaults.
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-border/70 bg-background/70 p-5">
                  <p className="text-sm text-muted-foreground">Out transactions</p>
                  <p className="mt-3 text-3xl font-semibold text-sky-700 dark:text-sky-300">
                    -$64.7K
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Borrow disbursements and treasury protection rebalances.
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-border/70 bg-background/70 p-5">
                  <p className="text-sm text-muted-foreground">Settlement state</p>
                  <p className="mt-3 text-3xl font-semibold">99.98%</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Clean ledger visibility across current mocked bank actions.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section id="lending" className="shell-container mt-6">
          <div className="panel-surface rounded-[2rem] p-6 sm:p-7">
            <div className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr] xl:items-center">
              <div>
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.34em] text-primary/80">
                  Lending and deposits
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Borrow or deposit from the same user-facing workspace.
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
                  The dashboard includes clear action cards for adding deposits,
                  previewing returns, requesting loans, and understanding how each
                  action affects available funds and contract state.
                </p>
                <Link
                  href="/lending"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "mt-6 h-12 rounded-2xl px-5"
                  )}
                >
                  Jump to lending actions
                  <ArrowRight className="size-4" />
                </Link>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {lendingCards.map((card) => {
                  const Icon = card.icon

                  return (
                    <article
                      key={card.title}
                      className="rounded-[1.6rem] border border-border/70 bg-background/70 p-5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="rounded-2xl border border-primary/20 bg-primary/10 p-3 text-primary">
                          <Icon className="size-5" />
                        </div>
                        <Badge variant="secondary" className="rounded-full px-3 py-1">
                          {card.metric}
                        </Badge>
                      </div>
                      <h3 className="mt-5 text-xl font-semibold">{card.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground">
                        {card.detail}
                      </p>
                    </article>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
