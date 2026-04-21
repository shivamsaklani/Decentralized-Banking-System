"use client"

import { FileBadge2, Globe2, ShieldCheck, TimerReset, Copy } from "lucide-react"
import { motion } from "motion/react"

import {
  MetricCard,
  MiniStat,
  SectionIntro,
} from "@/components/bank/portal-primitives"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useWeb3 } from "@/lib/web3-context"
import { contractAddress } from "@/lib/contract-config"
import { ethers } from "ethers"

export function ContractsPage() {
  const { bankReserve, account } = useWeb3()

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractAddress)
    alert("Contract Address Copied!")
  }

  const contractMetrics = [
    {
      icon: FileBadge2,
      label: "Active contracts",
      value: "1",
      detail: "The master Decentralized Bank Solidity contract.",
      badge: "Master",
    },
    {
      icon: ShieldCheck,
      label: "Total Value Locked",
      value: `${ethers.formatEther(bankReserve)} ETH`,
      detail: "Total liquidity currently secured by the contract.",
      badge: "Secured",
    },
    {
      icon: Globe2,
      label: "Network",
      value: "Localhost",
      detail: "Ethereum local hardhat node for testing.",
      badge: "Chain 31337",
    },
    {
      icon: TimerReset,
      label: "Your Connection",
      value: account ? "Active" : "Disconnected",
      detail: account ? `Linked to ${account.slice(0, 6)}...` : "Please connect your wallet.",
      badge: account ? "Online" : "Offline",
    },
  ]

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Contracts"
        title="Dedicated route for live smart agreements."
        description="This page isolates the master smart contract details that run the Decentralized Banking System."
        badge="/contract"
      />

      <motion.section
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {contractMetrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </motion.section>

      <div className="grid gap-6 xl:grid-cols-[1fr]">
        <motion.section
          className="panel-surface rounded-[1.8rem] p-5 sm:p-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SectionIntro
              eyebrow="Smart contracts"
              title="AstraVault Core Contract"
              description="The primary Solidity smart contract governing all deposits, loans, and yield."
            />
            <Button variant="secondary" onClick={copyToClipboard} className="rounded-full gap-2">
              <Copy className="size-4" />
              Copy Address
            </Button>
          </div>

          <div className="mt-6 space-y-4">
            <article className="rounded-[1.5rem] border border-border/70 bg-background/60 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold flex items-center gap-2">
                    DecentralizedBank.sol
                    <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-xs font-mono">
                      v1.0.0
                    </Badge>
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground font-mono">
                    {contractAddress}
                  </p>
                </div>
                <Badge variant="outline" className="rounded-full px-3 py-1 bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                  Verified & Active
                </Badge>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <MiniStat label="Language" value="Solidity ^0.8.20" />
                <MiniStat label="Functions" value="7 Exposed Methods" />
                <MiniStat label="Access Control" value="Admin / Registered" />
              </div>
            </article>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
