"use client"

import { useEffect, useState } from "react"
import { ArrowDownLeft, ArrowUpRight, Loader2 } from "lucide-react"
import { motion } from "motion/react"

import {
  InfoPill,
  SectionIntro,
} from "@/components/bank/portal-primitives"
import { Badge } from "@/components/ui/badge"
import { cn, formatUSD } from "@/lib/utils"
import { useWeb3, TransactionEvent } from "@/lib/web3-context"
import { ethers } from "ethers"

export function TransactionsPage() {
  const { fetchUserTransactions, account } = useWeb3()
  const [transactions, setTransactions] = useState<TransactionEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadTransactions = async () => {
      setIsLoading(true)
      try {
        const txs = await fetchUserTransactions()
        if (isMounted) {
          setTransactions(txs)
        }
      } catch (e) {
        console.error(e)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    if (account) {
      loadTransactions()
    } else {
      setIsLoading(false)
    }

    return () => {
      isMounted = false
    }
  }, [account, fetchUserTransactions])

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Transactions"
        title="Route-based ledger view for incoming and outgoing bank activity."
        description="This page isolates your transaction feed directly from the Decentralized Bank smart contract."
        badge="/transactions"
      />

      <div className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
        <motion.section
          className="panel-surface rounded-[1.8rem] p-5 sm:p-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <SectionIntro
            eyebrow="Bank transactions"
            title="Latest in and out ledger activity"
            description="Your live on-chain history."
            badge={`${transactions.length} events`}
          />

          <div className="mt-8 overflow-y-auto pr-2 max-h-[600px] space-y-4 scrollbar-thin scrollbar-thumb-primary/10 hover:scrollbar-thumb-primary/20">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
                <Loader2 className="size-8 animate-spin text-primary" />
                <p className="mt-4 text-sm font-medium tracking-tight">Fetching on-chain activity...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-border/70 p-12 text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  No transaction history found on the blockchain.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {transactions.map((transaction, index) => {
                  const isIncoming = transaction.type === "Deposit" || transaction.type === "LoanTaken"

                  return (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="group relative flex items-center justify-between p-4 sm:p-5 rounded-[1.4rem] hover:bg-muted/40 transition-colors border border-transparent hover:border-border/50"
                    >
                      <div className="flex items-center gap-4 sm:gap-5">
                        <div
                          className={cn(
                            "flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm border",
                            isIncoming
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                              : "bg-foreground/5 border-foreground/10 text-foreground/70 group-hover:text-foreground transition-colors"
                          )}
                        >
                          {isIncoming ? (
                            <ArrowDownLeft className="size-5" />
                          ) : (
                            <ArrowUpRight className="size-5" />
                          )}
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-bold tracking-wide text-foreground">
                            {transaction.type}
                          </span>
                          <div className="flex items-center gap-2 text-[0.65rem] font-medium text-muted-foreground uppercase tracking-wider">
                            <span className="flex items-center gap-1.5">
                              <div className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></div> 
                              Confirmed
                            </span>
                            <span className="opacity-40">•</span>
                            <span>Block {transaction.date.split(" ")[1]}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 text-right">
                        <span
                          className={cn(
                            "text-base font-extrabold tracking-tight",
                            isIncoming ? "text-emerald-500" : "text-foreground"
                          )}
                        >
                          {isIncoming ? "+" : "-"}{ethers.formatEther(transaction.amount)} ETH
                        </span>
                        {transaction.type === "LoanRepaid" && transaction.interestPaid !== undefined ? (
                          <span className="text-[0.65rem] font-bold text-rose-500/80 uppercase tracking-wider">
                            + {ethers.formatEther(transaction.interestPaid)} ETH Interest
                          </span>
                        ) : (
                          <span className="text-[0.65rem] font-bold text-muted-foreground/50 uppercase tracking-wider">
                            {formatUSD(transaction.amount)}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        </motion.section>

        <motion.section
          className="space-y-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <article className="panel-surface rounded-[1.8rem] p-5 sm:p-6">
            <SectionIntro
              eyebrow="Ledger notes"
              title="Operational visibility"
              description="This route helps members focus only on money movement when they do not need broader dashboard context."
            />
            <div className="mt-6 space-y-3">
              <InfoPill label="Dedicated URL" value="/transactions" tone="neutral" />
              <InfoPill label="Primary goal" value="Review inflow and outflow" tone="positive" />
              <InfoPill label="Data Source" value="Blockchain Logs" tone="positive" />
            </div>
          </article>
        </motion.section>
      </div>
    </div>
  )
}
