"use client"

import dynamic from "next/dynamic"
import {
  CircleDollarSign,
  FileLock2,
  Globe2,
  Sparkles,
  Wallet2,
} from "lucide-react"
import { motion } from "motion/react"

import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  InfoPill,
  MetricCard,
  MiniStat,
  SectionIntro,
} from "@/components/bank/portal-primitives"
import { cn } from "@/lib/utils"
import { useWeb3 } from "@/lib/web3-context"
import { contractAddress } from "@/lib/contract-config"
import { ethers } from "ethers"

const overviewIcons = [Wallet2, FileLock2, CircleDollarSign, Sparkles]

import { formatUSD } from "@/lib/utils"

export function OverviewPage() {
  const { user, bankReserve } = useWeb3()

  const formatEth = (val: bigint | string) => {
    const formatted = ethers.formatEther(val)
    const num = parseFloat(formatted)
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) + " ETH"
  }

  const liveOverview = [
    {
      label: "Available liquidity",
      value: user ? formatEth(user.balance) : "0.00 ETH",
      trend: user ? formatUSD(user.balance) : "$0.00",
      detail: "Ready to deploy or withdraw instantly.",
    },
    {
      label: "Total Bank Reserve",
      value: formatEth(bankReserve),
      trend: formatUSD(bankReserve),
      detail: "Total capital locked in the Decentralized Bank.",
    },
    {
      label: "Active Loan",
      value: user ? formatEth(user.loanAmount) : "0.00 ETH",
      trend: user ? formatUSD(user.loanAmount) : "$0.00",
      detail: "Borrowed against your bank signature.",
    },
    {
      label: "Loan Interest Rate",
      value: user ? `${user.interestRate}%` : "0%",
      trend: "Fixed",
      detail: "Across the current active loan.",
    },
  ]

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Overview"
        title="Core member banking metrics at a glance."
        description="This route is the dashboard landing page. It keeps high-signal liquidity, treasury, and protocol health information together."
        badge="/dashboard"
      />

      <div className="group flex items-center gap-4 rounded-2xl border border-border/70 bg-background/60 p-4 transition-all hover:bg-background/80">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
          <Globe2 className="size-6" />
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-[0.65rem] font-bold text-muted-foreground uppercase tracking-[0.2em]">Bank Smart Contract Address</p>
          <p className="mt-1 truncate font-mono text-sm font-medium text-primary">{contractAddress}</p>
        </div>
        <Badge variant="secondary" className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-3 py-1 font-semibold tracking-wide">
          Sepolia Testnet
        </Badge>
      </div>

      <motion.section
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {liveOverview.map((item, index) => (
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


    </div>
  )
}
