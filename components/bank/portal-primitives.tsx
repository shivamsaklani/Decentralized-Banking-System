import type { LucideIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type SectionIntroProps = {
  eyebrow: string
  title: string
  description?: string
  badge?: string
  className?: string
}

type MetricCardProps = {
  icon: LucideIcon
  label: string
  value: string
  detail: string
  badge?: string
}

export function SectionIntro({
  eyebrow,
  title,
  description,
  badge,
  className,
}: SectionIntroProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
    >
      <div className="max-w-2xl">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.34em] text-primary/80">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>

      {badge ? (
        <Badge variant="outline" className="rounded-full px-3 py-1">
          {badge}
        </Badge>
      ) : null}
    </div>
  )
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
  badge,
}: MetricCardProps) {
  return (
    <article className="rounded-[1.6rem] border border-border/70 bg-card/85 p-5 shadow-[0_24px_80px_-58px_rgba(5,19,30,0.9)]">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-2xl border border-primary/20 bg-primary/10 p-3 text-primary">
          <Icon className="size-5" />
        </div>
        {badge ? (
          <Badge variant="outline" className="rounded-full px-3 py-1">
            {badge}
          </Badge>
        ) : null}
      </div>
      <p className="mt-5 text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-2 text-sm text-muted-foreground">{detail}</p>
    </article>
  )
}

export function InfoPill({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: "positive" | "neutral"
}) {
  return (
    <div className="rounded-[1.25rem] border border-border/70 bg-background/65 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{label}</p>
        <span
          className={cn(
            "size-2.5 rounded-full",
            tone === "positive" ? "bg-emerald-500" : "bg-primary"
          )}
        />
      </div>
      <p className="mt-2 text-base font-semibold">{value}</p>
    </div>
  )
}

export function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.1rem] border border-border/70 bg-background/65 p-3">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold">{value}</p>
    </div>
  )
}
