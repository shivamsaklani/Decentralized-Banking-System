"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, LockKeyhole, ShieldCheck, Wallet2 } from "lucide-react"
import { motion } from "motion/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { contractPreview } from "@/lib/mock-bank-data"

export function HeroLoginPanel() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    startTransition(() => {
      router.push("/dashboard")
    })
  }

  return (
    <div className="relative pb-4 lg:pb-14">
      <motion.div
        className="absolute inset-x-8 top-8 h-40 rounded-full bg-primary/25 blur-3xl"
        animate={{ opacity: [0.4, 0.7, 0.4], scale: [0.96, 1.03, 0.96] }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
      />

      <motion.div
        className="panel-surface relative z-10 rounded-[2rem] p-5 sm:p-6"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="rounded-full px-3 py-1">
            Wallet synced
          </Badge>
          <Badge variant="outline" className="rounded-full px-3 py-1">
            2FA ready
          </Badge>
        </div>

        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.3em] text-primary/80">
              Member Access
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-balance">
              Sign in to your banking workspace
            </h2>
          </div>
          <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-right">
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              Authentication
            </p>
            <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
              Secure channel active
            </p>
          </div>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="wallet-address">
              Wallet or member ID
            </label>
            <Input
              id="wallet-address"
              type="text"
              defaultValue="0x7C4A...91F2"
              className="h-12 rounded-2xl border-border/80 bg-background/75 px-4"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="member-email">
              Email address
            </label>
            <Input
              id="member-email"
              type="email"
              defaultValue="member@astravault.bank"
              className="h-12 rounded-2xl border-border/80 bg-background/75 px-4"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_160px]">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="access-code">
                Access phrase
              </label>
              <Input
                id="access-code"
                type="password"
                defaultValue="vault-prototype"
                className="h-12 rounded-2xl border-border/80 bg-background/75 px-4"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="two-factor">
                2FA
              </label>
              <Input
                id="two-factor"
                type="text"
                defaultValue="480221"
                className="h-12 rounded-2xl border-border/80 bg-background/75 px-4"
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="h-12 w-full rounded-2xl text-sm"
          >
            {isPending ? "Opening dashboard..." : "Authenticate and continue"}
            <ArrowRight className="size-4" />
          </Button>
        </form>

        <div className="mt-5 grid gap-3 rounded-[1.75rem] border border-border/70 bg-background/65 p-4 sm:grid-cols-2">
          <div className="rounded-[1.4rem] border border-border/70 bg-background/70 p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Wallet2 className="size-4 text-primary" />
              Wallet trust state
            </div>
            <p className="mt-3 text-2xl font-semibold">$4.82M</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Total visible funds across liquid reserves and live contracts.
            </p>
          </div>

          <div className="rounded-[1.4rem] border border-border/70 bg-background/70 p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <LockKeyhole className="size-4 text-primary" />
              Current access level
            </div>
            <p className="mt-3 text-2xl font-semibold">Tier 03</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Mock private-banking privileges with contract and liquidity controls.
            </p>
          </div>
        </div>

        <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="size-4 text-primary" />
          UI prototype only. This demo routes into a mock dashboard without a live backend.
        </p>
      </motion.div>

      <motion.div
        className="panel-surface absolute -bottom-3 left-4 right-4 hidden rounded-[1.75rem] p-4 lg:block"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.15, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.3em] text-primary/80">
              Live vault preview
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Contracts that will appear inside the user dashboard.
            </p>
          </div>
          <Badge variant="outline" className="rounded-full px-3 py-1">
            Updated 2m ago
          </Badge>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {contractPreview.map((contract) => (
            <div
              key={contract.name}
              className="rounded-[1.4rem] border border-border/70 bg-background/70 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium">{contract.name}</p>
                <Badge variant="secondary" className="rounded-full px-2.5 py-1">
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
      </motion.div>
    </div>
  )
}
