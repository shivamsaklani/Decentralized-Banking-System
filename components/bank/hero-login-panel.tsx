"use client"

import { useRouter } from "next/navigation"
import { ArrowRight, LockKeyhole, ShieldCheck, Wallet2 } from "lucide-react"
import { motion } from "motion/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ethers } from "ethers"
import { useWeb3 } from "@/lib/web3-context"
import { useState } from "react"
import toast from "react-hot-toast"
import { getErrorMessage, formatUSD } from "@/lib/utils"

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
    const toastId = toast.loading("Confirm transaction in your wallet...")
    try {
      const tx = await contract.registerUser("Member")
      toast.loading("Transaction submitted, waiting for confirmation...", { id: toastId })
      await tx.wait()
      await refreshUser()
      toast.success("Registered successfully!", { id: toastId })
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Registration failed", error)
      toast.error(getErrorMessage(error), { id: toastId })
    } finally {
      setIsRegistering(false)
    }
  }

  const handleContinue = () => {
    router.push("/dashboard")
  }

  const formatEth = (val: bigint) => {
    const formatted = ethers.formatEther(val)
    const num = parseFloat(formatted)
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) + " ETH"
  }

  return (
    <div className="relative pb-4 lg:pb-14">
      {/* Background Glow */}
      <motion.div
        className="absolute inset-x-8 top-8 h-64 rounded-full bg-primary/20 blur-[120px]"
        animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }}
      />

      <motion.div
        className="relative z-10 overflow-hidden rounded-[2.5rem] border border-border/50 bg-card/40 p-6 backdrop-blur-2xl transition-all sm:p-8"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <div className="absolute -right-20 -top-20 size-64 rounded-full bg-primary/5 blur-[80px]" />

        <div className="relative flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="rounded-full bg-emerald-500/10 px-3 py-1 text-[0.65rem] font-bold text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
            Wallet synced
          </Badge>
          <Badge variant="outline" className="rounded-full px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground/80 border-border/60">
            2FA ready
          </Badge>
        </div>

        <div className="relative mt-6 flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.3em] text-primary/80">
              Member Access
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
              Sign in to your banking workspace
            </h2>
          </div>
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-2 text-right transition-colors hover:bg-emerald-500/10">
            <p className="text-[0.6rem] font-bold uppercase tracking-wider text-emerald-600/70">
              Auth Channel
            </p>
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
              SECURE
            </p>
          </div>
        </div>

        <div className="relative mt-8 space-y-4">
          {!account ? (
            <Button
              onClick={handleConnect}
              disabled={isConnecting}
              size="lg"
              className="group h-14 w-full rounded-[1.25rem] bg-primary text-base font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              {isConnecting ? "Connecting Wallet..." : "Connect Web3 Wallet"}
              <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
            </Button>
          ) : !user?.isRegistered ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 px-5 py-4">
                <p className="text-sm font-bold text-amber-700 dark:text-amber-400">
                  Wallet: {account.slice(0, 6)}...{account.slice(-4)}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-amber-600/80 dark:text-amber-400/80">
                  You are not yet registered in the Decentralized Bank. Click below to initialize your account.
                </p>
              </div>
              <Button
                onClick={handleRegister}
                disabled={isRegistering}
                size="lg"
                className="group h-14 w-full rounded-[1.25rem] bg-primary text-base font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
              >
                {isRegistering ? "Registering on-chain..." : "Initialize Account"}
                <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-4">
                <p className="text-sm font-bold text-emerald-900 dark:text-emerald-100">
                  Welcome back, {user.name}!
                </p>
                <p className="mt-1 text-xs text-emerald-700/80 dark:text-emerald-400/80">
                  Secure Wallet: {account.slice(0, 6)}...{account.slice(-4)}
                </p>
              </div>
              <Button
                onClick={handleContinue}
                size="lg"
                className="group h-14 w-full rounded-[1.25rem] bg-primary text-base font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
              >
                Enter Member Portal
                <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          )}
        </div>

        <div className="relative mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.5rem] border border-border/40 bg-background/30 p-5 backdrop-blur-md transition-all hover:border-primary/30">
            <div className="flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground/80">
              <Wallet2 className="size-4 text-primary" />
              Bank Reserves
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">{formatEth(bankReserve)}</p>
            <p className="mt-2 text-[0.65rem] leading-relaxed text-muted-foreground/60">
              Value: {formatUSD(bankReserve)} secured on-chain.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-border/40 bg-background/30 p-5 backdrop-blur-md transition-all hover:border-primary/30">
            <div className="flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground/80">
              <LockKeyhole className="size-4 text-primary" />
              Status
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">{user?.isRegistered ? "Verified" : "Guest"}</p>
            <p className="mt-2 text-[0.65rem] leading-relaxed text-muted-foreground/60">
              {user?.isRegistered ? "Full member access enabled." : "Register to access bank facilities."}
            </p>
          </div>
        </div>

        <div className="relative mt-6 rounded-2xl bg-primary/5 p-4 border border-primary/10 transition-colors hover:bg-primary/10">
          <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground/90">
            <ShieldCheck className="size-4 text-primary shrink-0" />
            Direct Smart Contract Integration Active (Sepolia)
          </p>
        </div>
      </motion.div>
    </div>
  )
}
