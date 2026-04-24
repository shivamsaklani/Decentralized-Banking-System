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
    <article className="group relative overflow-hidden rounded-[1.75rem] border border-border/50 bg-card/40 p-6 backdrop-blur-md transition-all hover:-translate-y-1 hover:border-primary/30 hover:bg-card/60 hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.3)]">
      <div className="absolute -right-4 -top-4 size-24 rounded-full bg-primary/5 blur-3xl transition-all group-hover:bg-primary/10" />
      
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-2xl border border-primary/20 bg-primary/10 p-3.5 text-primary transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="size-5" />
        </div>
        {badge ? (
          <Badge variant="outline" className="rounded-full border-primary/20 bg-primary/5 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-primary/80">
            {badge}
          </Badge>
        ) : null}
      </div>
      
      <div className="relative mt-6">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.15em] text-muted-foreground/80">{label}</p>
        <p className="mt-2 truncate text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {value}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground/70">{detail}</p>
      </div>
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
