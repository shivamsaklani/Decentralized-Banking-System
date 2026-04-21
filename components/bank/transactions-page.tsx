"use client"

import { useEffect, useState } from "react"
import { ArrowDownLeft, ArrowUpRight, Loader2 } from "lucide-react"
import { motion } from "motion/react"

import {
  InfoPill,
  SectionIntro,
} from "@/components/bank/portal-primitives"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
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

          <div className="mt-6 space-y-4">
            {isLoading ? (
              <div className="flex justify-center p-8 text-muted-foreground">
                <Loader2 className="size-6 animate-spin" />
              </div>
            ) : transactions.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-border/70 p-8 text-center text-muted-foreground">
                No transaction history found on the blockchain.
              </div>
            ) : (
              transactions.map((transaction) => {
                const isIncoming = transaction.type === "Deposit" || transaction.type === "LoanTaken"

                return (
                  <article
                    key={transaction.id}
                    className="rounded-[1.5rem] border border-border/70 bg-background/60 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "rounded-2xl p-3",
                            isIncoming
                              ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300"
                              : "bg-sky-500/12 text-sky-700 dark:text-sky-300"
                          )}
                        >
                          {isIncoming ? (
                            <ArrowDownLeft className="size-5" />
                          ) : (
                            <ArrowUpRight className="size-5" />
                          )}
                        </div>
                        <div>
                          <p className="text-base font-semibold">{transaction.type}</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Smart Contract Interaction
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p
                          className={cn(
                            "text-lg font-semibold",
                            isIncoming
                              ? "text-emerald-700 dark:text-emerald-300"
                              : "text-sky-700 dark:text-sky-300"
                          )}
                        >
                          {ethers.formatEther(transaction.amount)} ETH
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {transaction.date}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <Badge variant="secondary" className="rounded-full px-3 py-1">
                        Confirmed
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        Direction: {isIncoming ? "IN" : "OUT"}
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
