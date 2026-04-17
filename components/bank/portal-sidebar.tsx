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

      <SidebarSectionLabel className="mt-6">Policy status</SidebarSectionLabel>
      <SidebarPolicyCard />

      <SidebarRelationshipCard className="mt-4" />
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

function SidebarAccountCard({ compact = false }: { compact?: boolean }) {
  return (
    <div className="rounded-[1.7rem] border border-border/70 bg-background/60 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Core account</p>
          <p className="mt-2 text-2xl font-semibold">$4.82M</p>
        </div>
        <Badge variant="secondary" className="rounded-full px-3 py-1">
          Healthy
        </Badge>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Member funds visible across contracts, reserves, and lending lanes.
      </p>
      {!compact ? (
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <div className="rounded-[1rem] border border-border/70 bg-background/65 px-3 py-2">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Liquidity
            </p>
            <p className="mt-1 text-sm font-semibold">$842.5K</p>
          </div>
          <div className="rounded-[1rem] border border-border/70 bg-background/65 px-3 py-2">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Borrow power
            </p>
            <p className="mt-1 text-sm font-semibold">$615K</p>
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
    <nav className={cn("space-y-2", mobile ? "mt-3" : "mt-3")}>
      {portalRoutes.map((item) => {
        const Icon = item.icon
        const isActive = currentPath === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "block rounded-[1.35rem] border px-4 py-3 transition-colors",
              isActive
                ? "border-primary/30 bg-primary/10"
                : "border-border/70 bg-background/60 hover:border-primary/20 hover:bg-primary/5"
            )}
            onClick={onNavigate}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-3">
                <span
                  className={cn(
                    "rounded-2xl border p-2",
                    isActive
                      ? "border-primary/25 bg-primary/15 text-primary"
                      : "border-border/70 bg-background/65 text-muted-foreground"
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <span>
                  <span className="block text-sm font-medium">{item.label}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {item.description}
                  </span>
                </span>
              </span>
              <ChevronRight
                className={cn(
                  "size-4",
                  isActive ? "text-primary" : "text-muted-foreground"
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
    <div className="rounded-[1.7rem] border border-border/70 bg-background/60 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">Coverage and safeguards</p>
        <ShieldCheck className="size-4 text-primary" />
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Deposits, loans, and contract actions remain inside current mock policy
        thresholds.
      </p>
      <div className="mt-4 space-y-2">
        <SidebarPolicyRow label="Coverage ratio" value="182%" />
        <SidebarPolicyRow label="Settlement quality" value="99.98%" />
        <SidebarPolicyRow label="Multisig rotation" value="3 days" />
      </div>
    </div>
  )
}

function SidebarPolicyRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[1rem] border border-border/70 bg-background/65 px-3 py-2">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  )
}

function SidebarRelationshipCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "mt-auto rounded-[1.7rem] border border-border/70 bg-background/60 p-4",
        className
      )}
    >
      <p className="text-sm font-medium">Relationship desk</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Governance support, audits, and treasury coordination remain available
        from the mock member team.
      </p>
      <Badge variant="outline" className="mt-4 rounded-full px-3 py-1">
        Always available
      </Badge>
    </div>
  )
}
