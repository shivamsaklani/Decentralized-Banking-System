"use client"

import { CircleDollarSign, HandCoins, PiggyBank, ShieldCheck } from "lucide-react"
import { motion } from "motion/react"

import {
  MetricCard,
  MiniStat,
  SectionIntro,
} from "@/components/bank/portal-primitives"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useWeb3 } from "@/lib/web3-context"
import { useState } from "react"
import { ethers } from "ethers"


export function LendingPage() {
  const { contract, account, refreshUser, user, bankReserve } = useWeb3()
  const [depositAmount, setDepositAmount] = useState("")
  const [borrowAmount, setBorrowAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const hasActiveLoan = user ? user.loanAmount > BigInt(0) : false

  const lendingMetrics = [
    {
      icon: PiggyBank,
      label: "Deposit rate",
      value: "4.9% APY",
      detail: "Current deposit lane returns shown for the guarded liquidity vault.",
      badge: "Deposit",
    },
    {
      icon: HandCoins,
      label: "Borrow rate",
      value: "5.0% APY",
      detail: "Current borrow lane pricing is surfaced independently on this route.",
      badge: "Borrow",
    },
    {
      icon: CircleDollarSign,
      label: "Borrow power",
      value: hasActiveLoan ? "0 ETH" : "Available",
      detail: hasActiveLoan ? "You must repay your active loan before borrowing again." : "You are eligible to borrow against bank liquidity.",
      badge: hasActiveLoan ? "Maxed" : "Ready",
    },
    {
      icon: ShieldCheck,
      label: "Eligibility state",
      value: hasActiveLoan ? "Active Loan" : "Strong",
      detail: "Smart contract validates your address for decentralized loans.",
      badge: user?.isRegistered ? "Qualified" : "Unregistered",
    },
  ]

  const handleDeposit = async () => {
    if (!contract) return
    setIsProcessing(true)
    try {
      const tx = await contract.deposit({ value: ethers.parseEther(depositAmount) })
      await tx.wait()
      await refreshUser()
      setDepositAmount("")
      alert("Deposit Successful! Your balance has been updated.")
    } catch (e) {
      console.error(e)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBorrow = async () => {
    if (!contract || !account) return
    setIsProcessing(true)
    try {
      const amountWei = ethers.parseEther(borrowAmount)
      const interestRate = 5 // 5% static
      
      const nonce = await contract.nonces(account)
      
      // Fetch signature from backend
      const res = await fetch("/api/sign-loan", {
        method: "POST",
        body: JSON.stringify({
          userAddress: account,
          amount: amountWei.toString(),
          interestRate,
          nonce: Number(nonce)
        })
      })
      const data = await res.json()
      
      if (data.error) throw new Error(data.error)
      
      const tx = await contract.takeLoan(amountWei, interestRate, data.signature)
      await tx.wait()
      await refreshUser()
      setBorrowAmount("")
      alert("Loan Approved! The funds have been sent to your wallet.")
    } catch (e) {
      console.error(e)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRepay = async () => {
    if (!contract) return
    setIsProcessing(true)
    try {
      const tx = await contract.repayLoan()
      await tx.wait()
      await refreshUser()
      alert("Loan Repaid Successfully!")
    } catch(e) {
      console.error(e)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Lending"
        title="Route-based page for deposits and borrowing."
        description="`/lending` now acts as its own workspace for deposit and borrow actions, which keeps financial decisions separate from contract browsing or transaction review."
        badge="/lending"
      />

      <motion.section
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {lendingMetrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </motion.section>

      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <motion.section
          className="space-y-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <article className="panel-surface rounded-[1.8rem] p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <SectionIntro eyebrow="Action center" title="Deposit into liquidity" description="Funds settle into the guarded vault." />
              <Badge variant="secondary" className="rounded-full px-3 py-1">Earn 4.9% APY</Badge>
            </div>
            <div className="mt-5 space-y-3">
              <label className="block text-sm font-medium">Amount (ETH)</label>
              <Input type="text" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} placeholder="0.5" className="h-12 rounded-2xl border-border/80 bg-background/65 px-4" />
            </div>
            <Button type="button" onClick={handleDeposit} disabled={isProcessing || !depositAmount} size="lg" className="mt-5 h-12 w-full rounded-2xl text-sm">
              Execute Deposit
            </Button>
          </article>

          <article className="panel-surface rounded-[1.8rem] p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <SectionIntro eyebrow="Action center" title="Borrow funds" description="Loans require bank admin signature." />
              <Badge variant="secondary" className="rounded-full px-3 py-1">Pay 5.0% APY</Badge>
            </div>
            <div className="mt-5 space-y-3">
              <label className="block text-sm font-medium">Amount (ETH)</label>
              <Input type="text" value={borrowAmount} onChange={(e) => setBorrowAmount(e.target.value)} placeholder="1.0" className="h-12 rounded-2xl border-border/80 bg-background/65 px-4" />
            </div>
            <Button type="button" onClick={handleBorrow} disabled={isProcessing || !borrowAmount || !!user?.loanAmount} size="lg" className="mt-5 h-12 w-full rounded-2xl text-sm">
              Execute Borrow
            </Button>
            
            {user && user.loanAmount > BigInt(0) && (
              <div className="mt-6 pt-6 border-t border-border/60">
                <p className="text-sm font-medium mb-3">Active Loan: {ethers.formatEther(user.loanAmount)} ETH</p>
                <Button type="button" variant="outline" onClick={handleRepay} disabled={isProcessing} size="lg" className="h-12 w-full rounded-2xl text-sm">
                  Repay Full Loan
                </Button>
              </div>
            )}
          </article>
        </motion.section>

        <motion.section
          className="space-y-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <article className="panel-surface rounded-[1.8rem] p-5 sm:p-6">
            <SectionIntro
              eyebrow="Policy notes"
              title="Lending guardrails"
              description="This route isolates the most decision-heavy actions, so risk and eligibility notes stay close to the input controls."
            />
            <div className="mt-6 grid gap-3">
              <MiniStat label="Bank Liquidity" value={`${ethers.formatEther(bankReserve)} ETH`} />
              <MiniStat label="Collateral floor" value="100%" />
              <MiniStat label="Preferred deposit asset" value="ETH" />
            </div>
          </article>
        </motion.section>
      </div>
    </div>
  )
}
