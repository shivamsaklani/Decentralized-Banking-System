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

export function OverviewPage() {
  const { user, bankReserve } = useWeb3()

  const liveOverview = [
    {
      label: "Available liquidity",
      value: user ? `${ethers.formatEther(user.balance)} ETH` : "0.0 ETH",
      trend: "Bank Balance",
      detail: "Ready to deploy or withdraw instantly.",
    },
    {
      label: "Total Bank Reserve",
      value: `${ethers.formatEther(bankReserve)} ETH`,
      trend: "Liquidity",
      detail: "Total capital locked in the Decentralized Bank.",
    },
    {
      label: "Active Loan",
      value: user ? `${ethers.formatEther(user.loanAmount)} ETH` : "0.0 ETH",
      trend: "Current Debt",
      detail: "Borrowed against your bank signature.",
    },
    {
      label: "Loan Interest Rate",
      value: user ? `${user.interestRate}%` : "0%",
      trend: "APY",
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

      <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/60 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Globe2 className="size-5" />
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Bank Smart Contract Address</p>
          <p className="truncate font-mono text-sm font-medium">{contractAddress}</p>
        </div>
        <Badge variant="secondary" className="rounded-full">Localhost</Badge>
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
