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
                <p className="mt-4 text-sm font-medium">Fetching on-chain activity...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-border/70 p-12 text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  No transaction history found on the blockchain.
                </p>
              </div>
            ) : (
              transactions.map((transaction) => {
                const isIncoming = transaction.type === "Deposit" || transaction.type === "LoanTaken"

                return (
                  <article
                    key={transaction.id}
                    className="group rounded-[1.8rem] border border-border/40 bg-background/30 p-5 backdrop-blur-md transition-all hover:border-primary/30 hover:bg-background/50"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "rounded-2xl p-3 shadow-sm",
                            isIncoming
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-sky-500/10 text-sky-600 dark:text-sky-400"
                          )}
                        >
                          {isIncoming ? (
                            <ArrowDownLeft className="size-5" />
                          ) : (
                            <ArrowUpRight className="size-5" />
                          )}
                        </div>
                        <div>
                          <p className="text-base font-bold tracking-tight">{transaction.type}</p>
                          <p className="text-[0.7rem] font-bold uppercase tracking-wider text-muted-foreground/60">
                            Block {transaction.date.split(" ")[1]}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p
                          className={cn(
                            "text-lg font-bold tracking-tight",
                            isIncoming
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-sky-600 dark:text-sky-400"
                          )}
                        >
                          {isIncoming ? "+" : "-"}{ethers.formatEther(transaction.amount)} ETH
                        </p>
                        {transaction.type === "LoanRepaid" && transaction.interestPaid !== undefined && (
                           <p className="text-[0.7rem] font-bold text-emerald-500 mt-1">
                            + {ethers.formatEther(transaction.interestPaid)} ETH Interest
                           </p>
                        )}
                        <p className="text-[0.7rem] font-bold text-muted-foreground/50">
                          {formatUSD(transaction.amount)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[0.65rem] font-bold uppercase tracking-widest text-emerald-600/80">Confirmed</span>
                      </div>
                      <p className="text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground/40">
                        Dir: {isIncoming ? "IN" : "OUT"}
                      </p>
                    </div>
                  </article>
                )
              })
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
