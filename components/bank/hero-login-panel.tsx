"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, LockKeyhole, ShieldCheck, Wallet2 } from "lucide-react"
import { motion } from "motion/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ethers } from "ethers"
import { useWeb3 } from "@/lib/web3-context"
import { useState } from "react"

export function HeroLoginPanel() {
  const router = useRouter()
  const { account, user, connectWallet, contract, refreshUser, isConnecting, bankReserve } = useWeb3()
  const [isRegistering, setIsRegistering] = useState(false)

  const handleConnect = async () => {
    await connectWallet()
  }

  const handleRegister = async () => {
    if (!contract || !account) return
    setIsRegistering(true)
    try {
      const tx = await contract.registerUser("Member")
      await tx.wait()
      await refreshUser()
      router.push("/dashboard")
    } catch (error) {
      console.error("Registration failed", error)
    } finally {
      setIsRegistering(false)
    }
  }

  const handleContinue = () => {
    router.push("/dashboard")
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

        <div className="mt-6 space-y-4">
          {!account ? (
            <Button
              onClick={handleConnect}
              disabled={isConnecting}
              size="lg"
              className="h-12 w-full rounded-2xl text-sm"
            >
              {isConnecting ? "Connecting Wallet..." : "Connect Web3 Wallet"}
              <ArrowRight className="size-4" />
            </Button>
          ) : !user?.isRegistered ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 px-4 py-3">
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  Wallet connected: {account.slice(0, 6)}...{account.slice(-4)}
                </p>
                <p className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-1">
                  You are not registered in the Decentralized Bank.
                </p>
              </div>
              <Button
                onClick={handleRegister}
                disabled={isRegistering}
                size="lg"
                className="h-12 w-full rounded-2xl text-sm"
              >
                {isRegistering ? "Registering on-chain..." : "Register Account"}
                <ArrowRight className="size-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3">
                <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                  Welcome back, {user.name}!
                </p>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                  Wallet: {account.slice(0, 6)}...{account.slice(-4)}
                </p>
              </div>
              <Button
                onClick={handleContinue}
                size="lg"
                className="h-12 w-full rounded-2xl text-sm"
              >
                Go to Dashboard
                <ArrowRight className="size-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="mt-5 grid gap-3 rounded-[1.75rem] border border-border/70 bg-background/65 p-4 sm:grid-cols-2">
          <div className="rounded-[1.4rem] border border-border/70 bg-background/70 p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Wallet2 className="size-4 text-primary" />
              Total Bank Reserve
            </div>
            <p className="mt-3 text-2xl font-semibold">{ethers.formatEther(bankReserve)} ETH</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Total liquidity currently secured by the smart contract.
            </p>
          </div>

          <div className="rounded-[1.4rem] border border-border/70 bg-background/70 p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <LockKeyhole className="size-4 text-primary" />
              Member status
            </div>
            <p className="mt-3 text-2xl font-semibold">{user?.isRegistered ? "Verified" : "Guest"}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {user?.isRegistered ? "You have full access to bank facilities." : "Connect and register to start banking."}
            </p>
          </div>
        </div>

        <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="size-4 text-primary" />
          Full-stack integrated. This dashboard connects directly to the Decentralized Bank smart contract.
        </p>
      </motion.div>

    </div>
  )
}
