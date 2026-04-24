"use client"

import { PiggyBank, ShieldCheck, Wallet2, TrendingUp } from "lucide-react"
import { motion } from "motion/react"

import {
  MetricCard,
  MiniStat,
  SectionIntro,
} from "@/components/bank/portal-primitives"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useWeb3 } from "@/lib/web3-context"
import { useState } from "react"
import { ethers } from "ethers"
import toast from "react-hot-toast"
import { getErrorMessage, formatUSD } from "@/lib/utils"

export function DepositPage() {
  const { contract, refreshUser, user, bankReserve } = useWeb3()
  const [depositAmount, setDepositAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const formatEth = (val: bigint) => {
    const formatted = ethers.formatEther(val)
    const num = parseFloat(formatted)
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) + " ETH"
  }

  const depositMetrics = [
    {
      icon: PiggyBank,
      label: "Deposit rate",
      value: "4.9% APY",
      detail: "Current deposit returns for the guarded liquidity vault.",
      badge: "Market Rate",
    },
    {
      icon: Wallet2,
      label: "Your Balance",
      value: user ? formatEth(user.balance) : "0.00 ETH",
      detail: user ? `Approximately ${formatUSD(user.balance)}` : "No deposits active.",
      badge: "Live",
    },
    {
      icon: TrendingUp,
      label: "Estimated Earnings",
      value: user ? formatEth((user.balance * BigInt(49)) / BigInt(1000)) : "0.00 ETH",
      detail: user ? `Forecast: ${formatUSD((user.balance * BigInt(49)) / BigInt(1000))} per year.` : "Calculated on current balance.",
      badge: "Forecast",
    },
    {
      icon: ShieldCheck,
      label: "Security State",
      value: "Verified",
      detail: "Funds are secured by audited smart contract logic.",
      badge: "Protected",
    },
  ]

  const handleDeposit = async () => {
    if (!contract) return
    setIsProcessing(true)
    const toastId = toast.loading("Confirm deposit in your wallet...")
    try {
      const tx = await contract.deposit({ value: ethers.parseEther(depositAmount) })
      toast.loading("Transaction submitted, waiting for confirmation...", { id: toastId })
      await tx.wait()
      await refreshUser()
      setDepositAmount("")
      toast.success("Deposit Successful! Your balance has been updated.", { id: toastId })
    } catch (e: any) {
      console.error(e)
      toast.error(getErrorMessage(e), { id: toastId })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Deposit Workspace"
        title="Grow your capital with the Decentralized Bank."
        description="Deposit your ETH to earn competitive interest rates and contribute to the bank's total liquidity reserve."
        badge="/deposit"
      />

      <motion.section
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {depositMetrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </motion.section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <motion.section
          className="space-y-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <article className="panel-surface relative overflow-hidden rounded-[2.5rem] border border-border/50 bg-card/30 p-8 backdrop-blur-xl">
            <div className="absolute -right-20 -top-20 size-64 rounded-full bg-primary/5 blur-[100px]" />
            
            <div className="relative flex items-start justify-between gap-3">
              <SectionIntro 
                eyebrow="Action Center" 
                title="Deposit into liquidity" 
                description="Your funds are immediately moved into the bank vault and start earning interest." 
              />
              <Badge variant="secondary" className="rounded-full bg-emerald-500/10 px-4 py-1.5 text-[0.7rem] font-bold text-emerald-600 border-emerald-500/20">
                Earn 4.9% APY
              </Badge>
            </div>

            <div className="relative mt-8 space-y-4">
              <div className="space-y-2">
                <label className="text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground/80">Amount to Deposit (ETH)</label>
                <div className="relative">
                  <Input 
                    type="text" 
                    value={depositAmount} 
                    onChange={(e) => setDepositAmount(e.target.value)} 
                    placeholder="0.00" 
                    className="h-16 rounded-3xl border-border/40 bg-background/40 px-6 font-mono text-xl focus:ring-primary/20" 
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 rounded-xl bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                    ETH
                  </div>
                </div>
              </div>

              <Button 
                type="button" 
                onClick={handleDeposit} 
                disabled={isProcessing || !depositAmount} 
                size="lg" 
                className="h-16 w-full rounded-[1.5rem] bg-primary text-base font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                {isProcessing ? "Processing..." : "Confirm Deposit"}
              </Button>
            </div>
          </article>
        </motion.section>

        <motion.section
          className="space-y-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <article className="panel-surface rounded-[2.5rem] border border-border/50 bg-card/20 p-8 backdrop-blur-xl">
            <SectionIntro
              eyebrow="Network Notes"
              title="Deposit Guardrails"
              description="Review important safety and protocol information before depositing your funds."
            />
            <div className="mt-8 grid gap-4">
              <MiniStat label="Bank Total Reserve" value={formatEth(bankReserve)} />
              <MiniStat label="Transaction Speed" value="~15-30 Seconds" />
              <MiniStat label="Network" value="Ethereum Sepolia" />
            </div>
            
            <div className="mt-8 rounded-3xl bg-primary/5 p-5 border border-primary/10">
              <p className="text-[0.7rem] font-bold uppercase tracking-wider text-primary">Protocol Tip</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground/80">
                The bank's reserve is used to provide loans to other users. As more people borrow, your interest rate may dynamically adjust to maintain liquidity.
              </p>
            </div>
          </article>
        </motion.section>
      </div>
    </div>
  )
}
