"use client"

import { HandCoins, CircleDollarSign, ShieldCheck, Receipt, AlertCircle } from "lucide-react"
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
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import toast from "react-hot-toast"
import { getErrorMessage, formatUSD } from "@/lib/utils"

export function BorrowPage() {
  const { contract, account, refreshUser, user, bankReserve, fetchUserTransactions } = useWeb3()
  const [borrowAmount, setBorrowAmount] = useState("")
  const [repayAmount, setRepayAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [accruedInterest, setAccruedInterest] = useState(BigInt(0))
  const [repaymentHistory, setRepaymentHistory] = useState<any[]>([])

  const hasActiveLoan = user ? user.loanAmount > BigInt(0) : false

  useEffect(() => {
    let isMounted = true
    const loadData = async () => {
      if (contract && account && hasActiveLoan) {
        try {
          const [interest, txs] = await Promise.all([
            contract.calculateInterest(account),
            fetchUserTransactions()
          ])
          if (isMounted) {
            setAccruedInterest(interest)
            setRepaymentHistory(txs.filter(tx => tx.type === "LoanRepaid"))
          }
        } catch (e) {
          console.error("Error loading loan data:", e)
        }
      }
    }
    loadData()
    const interval = setInterval(async () => {
      if (contract && account && hasActiveLoan) {
        const interest = await contract.calculateInterest(account)
        if (isMounted) setAccruedInterest(interest)
      }
    }, 5000)
    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [contract, account, hasActiveLoan, fetchUserTransactions])

  const formatEth = (val: bigint, decimals = 4) => {
    if (val === BigInt(0)) return "0.00 ETH"
    const formatted = ethers.formatEther(val)
    const num = parseFloat(formatted)
    
    // If the value is very small, show more decimals (up to 8 for UI readability)
    if (num > 0 && num < 0.001) {
      return num.toLocaleString(undefined, { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 8 
      }) + " ETH"
    }
    
    return num.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: decimals 
    }) + " ETH"
  }

  const borrowMetrics = [
    {
      icon: HandCoins,
      label: "Borrow rate",
      value: "5.0% APY",
      detail: "Fixed interest rate for all loans on the Sepolia network.",
      badge: "Fixed",
    },
    {
      icon: Receipt,
      label: "Active Loan",
      value: user ? formatEth(user.loanAmount) : "0.00 ETH",
      detail: user ? `Total debt: ${formatUSD(user.loanAmount)}` : "No active debt.",
      badge: hasActiveLoan ? "Action Required" : "None",
    },
    {
      icon: CircleDollarSign,
      label: "Credit Capacity",
      value: hasActiveLoan ? "0.00 ETH" : "Available",
      detail: hasActiveLoan ? "Repay your existing loan to borrow more." : "You are eligible for a new loan.",
      badge: hasActiveLoan ? "At Limit" : "Ready",
    },
    {
      icon: ShieldCheck,
      label: "Admin Verification",
      value: "Required",
      detail: "All loans must be cryptographically signed by the bank.",
      badge: "Secure",
    },
  ]

  const handleBorrow = async () => {
    if (!contract || !account) return
    setIsProcessing(true)
    const toastId = toast.loading("Processing loan request...")
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

      toast.loading("Confirm loan in MetaMask...", { id: toastId })
      const tx = await contract.takeLoan(amountWei, interestRate, data.signature)
      toast.loading("Deploying funds, please wait...", { id: toastId })
      await tx.wait()
      await refreshUser()
      setBorrowAmount("")
      toast.success("Loan Approved! Funds have been sent to your wallet.", { id: toastId })
    } catch (e: any) {
      console.error(e)
      toast.error(getErrorMessage(e), { id: toastId })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRepay = async (isFull: boolean) => {
    if (!contract) return
    setIsProcessing(true)
    const toastId = toast.loading(isFull ? "Processing full repayment..." : "Processing partial repayment...")
    try {
      let amountWei
      if (isFull) {
        const interest = await contract.calculateInterest(account)
        amountWei = user!.loanAmount + interest + ethers.parseEther("0.0001") // Add dust buffer for mining time
      } else {
        amountWei = ethers.parseEther(repayAmount)
      }

      const tx = await contract.repayLoan({ value: amountWei })
      toast.loading("Confirming repayment on-chain...", { id: toastId })
      await tx.wait()
      await refreshUser()
      setRepayAmount("")
      toast.success(isFull ? "Loan fully repaid!" : "Partial repayment successful!", { id: toastId })
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
        eyebrow="Borrowing Workspace"
        title="Access instant liquidity against your credit."
        description="Borrow funds directly from the bank's liquidity pool. All loans are managed via cryptographic signatures for maximum security."
        badge="/borrow"
      />

      <motion.section
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {borrowMetrics.map((metric) => (
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
          {!hasActiveLoan ? (
            <article className="panel-surface relative overflow-hidden rounded-[2.5rem] border border-border/50 bg-card/30 p-8 backdrop-blur-xl">
              <div className="absolute -right-20 -top-20 size-64 rounded-full bg-primary/5 blur-[100px]" />

              <div className="relative flex items-start justify-between gap-3">
                <SectionIntro
                  eyebrow="Action Center"
                  title="Borrow funds"
                  description="Loans require a bank admin signature and happen instantly after approval."
                />
                <Badge variant="secondary" className="rounded-full bg-primary/10 px-4 py-1.5 text-[0.7rem] font-bold text-primary border-primary/20">
                  5.0% Fixed APY
                </Badge>
              </div>

              <div className="relative mt-8 space-y-4">
                <div className="space-y-2">
                  <label className="text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground/80">Borrow Amount (ETH)</label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={borrowAmount}
                      onChange={(e) => setBorrowAmount(e.target.value)}
                      placeholder="0.00"
                      className="h-16 rounded-3xl border-border/40 bg-background/40 pl-6 pr-16 font-mono text-xl focus:ring-primary/20"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 rounded-xl bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                      ETH
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleBorrow}
                  disabled={isProcessing || !borrowAmount}
                  size="lg"
                  className="h-16 w-full rounded-[1.5rem] bg-primary text-base font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  {isProcessing ? "Verifying..." : "Execute Borrow"}
                </Button>
              </div>
            </article>
          ) : (
            <article className="panel-surface relative overflow-hidden rounded-[2.5rem] border border-border/50 bg-card/40 p-8 backdrop-blur-xl">
              <div className="relative flex items-start justify-between gap-3">
                <SectionIntro
                  eyebrow="Active Loan"
                  title="Manage Repayment"
                  description="Pay back your loan in full or in portions. Interest is only charged on the remaining principal."
                />
                <Badge variant="secondary" className="rounded-full bg-amber-500/10 px-4 py-1.5 text-[0.7rem] font-bold text-amber-600 border-amber-500/20">
                  Repayment Due
                </Badge>
              </div>

              <div className="mt-8 space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-background/50 p-6 border border-border/40 min-w-0">
                    <p className="text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">Principal</p>
                    <p className="text-xl font-bold text-foreground truncate" title={formatEth(user?.loanAmount || BigInt(0))}>{formatEth(user?.loanAmount || BigInt(0))}</p>
                  </div>
                  <div className="rounded-3xl bg-background/50 p-6 border border-border/40 min-w-0">
                    <p className="text-[0.65rem] font-bold uppercase tracking-widest text-amber-600/60 mb-1">Accrued Interest</p>
                    <p className="text-xl font-bold text-amber-600 truncate" title={formatEth(accruedInterest)}>{formatEth(accruedInterest)}</p>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground/80">Repayment Amount (ETH)</label>
                    <div className="relative">
                      <Input
                        type="text"
                        value={repayAmount}
                        onChange={(e) => setRepayAmount(e.target.value)}
                        placeholder="0.00"
                        className="h-16 rounded-3xl border-border/40 bg-background/40 pl-6 pr-24 font-mono text-xl focus:ring-primary/20"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                        <button
                          onClick={() => setRepayAmount(ethers.formatEther(user!.loanAmount + accruedInterest))}
                          className="rounded-xl bg-primary/10 px-3 py-1 text-[0.6rem] font-bold text-primary hover:bg-primary/20 transition-colors"
                        >
                          MAX
                        </button>
                        <div className="rounded-xl bg-primary/10 px-3 py-1 text-xs font-bold text-primary">ETH</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      type="button"
                      onClick={() => handleRepay(false)}
                      disabled={isProcessing || !repayAmount}
                      size="lg"
                      className="h-16 flex-1 rounded-[1.5rem] bg-primary text-base font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      Repay Partial
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleRepay(true)}
                      disabled={isProcessing}
                      size="lg"
                      variant="outline"
                      className="h-16 flex-1 rounded-[1.5rem] border-primary/30 bg-primary/5 text-primary text-base font-bold transition-all hover:bg-primary hover:text-primary-foreground"
                    >
                      Repay Full
                    </Button>
                  </div>
                </div>

              </div>
            </article>
          )}
        </motion.section>

        <motion.section
          className="space-y-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <article className="panel-surface rounded-[2.5rem] border border-border/50 bg-card/20 p-8 backdrop-blur-xl">
            <SectionIntro
              eyebrow="Safety Notes"
              title="Borrowing Policy"
              description="Review our protocol rules for taking and managing decentralized loans."
            />
            <div className="mt-8 grid gap-4">
              <MiniStat label="Bank Liquidity" value={formatEth(bankReserve)} />
              <MiniStat label="Max Borrowing" value="100% of collateral" />
              <MiniStat label="Default Period" value="N/A (Smart Contract Managed)" />
            </div>

            <div className="mt-8 rounded-3xl bg-amber-500/5 p-5 border border-amber-500/10">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <AlertCircle className="size-4" />
                <p className="text-[0.7rem] font-bold uppercase tracking-wider">Interest Notice</p>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground/80">
                Interest starts accruing the moment you take a loan. You are responsible for monitoring your debt level.
              </p>
            </div>
          </article>

          {repaymentHistory.length > 0 && (
            <article className="panel-surface rounded-[2.5rem] border border-border/50 bg-card/20 p-8 backdrop-blur-xl">
              <SectionIntro
                eyebrow="History"
                title="Recent Repayments"
                description="Your most recent loan repayments and interest paid."
              />
              <div className="mt-8 space-y-3">
                {repaymentHistory.slice(0, 4).map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl bg-background/30 border border-border/20 text-xs">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-foreground">Principal: {formatEth(tx.amount)}</span>
                      <span className="text-muted-foreground/60">{tx.date}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-500">Interest: {formatEth(tx.interestPaid || BigInt(0))}</span>
                      <p className="text-[0.6rem] text-muted-foreground/40 mt-1 uppercase">Remaining: {formatEth(tx.remainingPrincipal || BigInt(0))}</p>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          )}
        </motion.section>
      </div>
    </div>
  )
}
