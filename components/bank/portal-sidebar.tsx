import Link from "next/link"
import { ChevronRight, ShieldCheck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { portalRoutes } from "@/lib/portal-navigation"

type PortalSidebarProps = {
  currentPath: string
  mobile?: boolean
  onNavigate?: () => void
}

export function PortalSidebar({
  currentPath,
  mobile = false,
  onNavigate,
}: PortalSidebarProps) {
  return (
    <div className={cn("flex h-full flex-col", mobile ? "p-0" : "p-5")}>
      <SidebarAccountCard compact={mobile} />

      <SidebarSectionLabel className={mobile ? "mt-6" : "mt-6"}>
        Workspace routes
      </SidebarSectionLabel>
      <SidebarNavigation
        currentPath={currentPath}
        mobile={mobile}
        onNavigate={onNavigate}
      />
    </div>
  )
}

function SidebarSectionLabel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <p
      className={cn(
        "font-mono text-[0.68rem] uppercase tracking-[0.34em] text-primary/80",
        className
      )}
    >
      {children}
    </p>
  )
}

import { useWeb3 } from "@/lib/web3-context"
import { ethers } from "ethers"
import { formatUSD } from "@/lib/utils"

function SidebarAccountCard({ compact = false }: { compact?: boolean }) {
  const { user } = useWeb3()
  
  const formatEth = (val: bigint) => {
    const formatted = ethers.formatEther(val)
    const num = parseFloat(formatted)
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) + " ETH"
  }

  const balance = user ? formatEth(user.balance) : "0.00 ETH"
  const balanceUSD = user ? formatUSD(user.balance) : "$0.00"
  const loan = user ? formatEth(user.loanAmount) : "0.00 ETH"
  const loanUSD = user ? formatUSD(user.loanAmount) : "$0.00"

  return (
    <div className="group relative overflow-hidden rounded-[2rem] border border-border/50 bg-primary/5 p-5 backdrop-blur-xl transition-all hover:bg-primary/[0.08]">
      <div className="absolute -right-10 -top-10 size-32 rounded-full bg-primary/10 blur-3xl transition-all group-hover:bg-primary/20" />
      
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.15em] text-muted-foreground/80">Active Balance</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-2xl font-bold tracking-tight text-foreground">{balance}</p>
            <p className="text-sm font-medium text-muted-foreground/70">({balanceUSD})</p>
          </div>
        </div>
        <Badge variant="secondary" className="rounded-full bg-emerald-500/10 px-3 py-1 text-[0.65rem] font-bold text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
          Healthy
        </Badge>
      </div>
      <p className="relative mt-3 text-xs leading-relaxed text-muted-foreground/70">
        Live blockchain state for your connected wallet address.
      </p>
      {!compact ? (
        <div className="relative mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <div className="rounded-[1.25rem] border border-border/40 bg-background/40 p-3 backdrop-blur-md transition-all hover:border-primary/30">
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">
              Total Deposit
            </p>
            <p className="mt-1 text-sm font-bold text-foreground">{balance}</p>
            <p className="text-[0.65rem] font-medium text-muted-foreground/70">{balanceUSD}</p>
          </div>
          <div className="rounded-[1.25rem] border border-border/40 bg-background/40 p-3 backdrop-blur-md transition-all hover:border-primary/30">
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">
              Active Loan
            </p>
            <p className="mt-1 text-sm font-bold text-foreground">{loan}</p>
            <p className="text-[0.65rem] font-medium text-muted-foreground/70">{loanUSD}</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function SidebarNavigation({
  currentPath,
  mobile,
  onNavigate,
}: {
  currentPath: string
  mobile?: boolean
  onNavigate?: () => void
}) {
  return (
    <nav className={cn("space-y-3", mobile ? "mt-4" : "mt-4")}>
      {portalRoutes.map((item) => {
        const Icon = item.icon
        const isActive = currentPath === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "group block rounded-[1.5rem] border p-1 transition-all duration-300",
              isActive
                ? "border-primary/20 bg-primary/10 shadow-[0_10px_20px_-10px_rgba(var(--primary),0.2)]"
                : "border-transparent hover:border-border/60 hover:bg-muted/50"
            )}
            onClick={onNavigate}
          >
            <div className="flex items-center justify-between gap-3 p-2">
              <span className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex size-10 items-center justify-center rounded-2xl border transition-all duration-300 group-hover:scale-110",
                    isActive
                      ? "border-primary/20 bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "border-border/60 bg-background text-muted-foreground group-hover:border-primary/40 group-hover:text-primary"
                  )}
                >
                  <Icon className="size-5" />
                </span>
                <span>
                  <span className={cn("block text-sm font-bold transition-colors", isActive ? "text-primary" : "text-foreground group-hover:text-primary")}>
                    {item.label}
                  </span>
                  <span className="block text-[0.65rem] font-medium text-muted-foreground/70">
                    {item.description}
                  </span>
                </span>
              </span>
              <ChevronRight
                className={cn(
                  "size-4 transition-transform duration-300 group-hover:translate-x-1",
                  isActive ? "text-primary" : "text-muted-foreground/40 group-hover:text-primary"
                )}
              />
            </div>
          </Link>
        )
      })}
    </nav>
  )
}

function SidebarPolicyCard() {
  return (
    <div className="group rounded-[2rem] border border-border/50 bg-background/40 p-5 backdrop-blur-md transition-all hover:bg-background/60">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-foreground">Coverage and safeguards</p>
        <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
          <ShieldCheck className="size-4" />
        </div>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground/70">
        Deposits, loans, and contract actions remain inside current mock policy
        thresholds.
      </p>
      <div className="mt-5 space-y-2">
        <SidebarPolicyRow label="Coverage ratio" value="182%" tone="positive" />
        <SidebarPolicyRow label="Settlement quality" value="99.98%" tone="positive" />
        <SidebarPolicyRow label="Multisig rotation" value="3 days" tone="neutral" />
      </div>
    </div>
  )
}

function SidebarPolicyRow({
  label,
  value,
  tone = "neutral",
}: {
  label: string
  value: string
  tone?: "positive" | "neutral"
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[1.25rem] border border-border/40 bg-background/50 px-4 py-2.5 transition-all hover:border-primary/20">
      <p className="text-[0.7rem] font-medium text-muted-foreground">{label}</p>
      <p className={cn("text-[0.7rem] font-bold", tone === "positive" ? "text-emerald-500" : "text-primary")}>{value}</p>
    </div>
  )
}

function SidebarRelationshipCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "group relative mt-auto overflow-hidden rounded-[2rem] border border-border/50 bg-card/30 p-5 backdrop-blur-md transition-all hover:bg-card/50",
        className
      )}
    >
      <div className="absolute -bottom-10 -left-10 size-32 rounded-full bg-primary/5 blur-3xl transition-all group-hover:bg-primary/10" />
      
      <p className="relative text-sm font-bold text-foreground">Relationship desk</p>
      <p className="relative mt-2 text-xs leading-relaxed text-muted-foreground/70">
        Governance support, audits, and treasury coordination remain available
        from the mock member team.
      </p>
      <Badge variant="outline" className="relative mt-5 rounded-full border-primary/20 bg-primary/5 px-4 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-primary">
        Always available
      </Badge>
    </div>
  )
}
