import { ShieldCheck } from "lucide-react"

import { cn } from "@/lib/utils"

type AppLogoProps = {
  className?: string
  compact?: boolean
}

export function AppLogo({ className, compact = false }: AppLogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative flex size-11 items-center justify-center rounded-[1.35rem] border border-white/25 bg-primary text-primary-foreground shadow-[0_20px_60px_-28px_var(--primary)]">
        <ShieldCheck className="size-5" />
        <div className="absolute inset-1 rounded-[1rem] border border-white/15" />
      </div>

      {!compact ? (
        <div className="min-w-0">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.36em] text-primary/80">
            AstraVault
          </p>
          <p className="truncate text-sm text-muted-foreground">
            Decentralized banking interface
          </p>
        </div>
      ) : null}
    </div>
  )
}
