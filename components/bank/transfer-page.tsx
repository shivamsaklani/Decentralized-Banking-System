"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Copy, Camera, Send, QrCode, ArrowRightLeft } from "lucide-react"
import QRCode from "react-qr-code"
import { Scanner } from "@yudiel/react-qr-scanner"
import toast from "react-hot-toast"
import { ethers } from "ethers"

import { useWeb3 } from "@/lib/web3-context"
import { SectionIntro, MiniStat } from "@/components/bank/portal-primitives"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function TransferPage() {
  const { account, contract, user, refreshUser } = useWeb3()
  const [activeTab, setActiveTab] = useState<"send" | "receive">("receive")
  const [isProcessing, setIsProcessing] = useState(false)

  // Send State
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [showScanner, setShowScanner] = useState(false)

  const copyToClipboard = () => {
    if (account) {
      navigator.clipboard.writeText(account)
      toast.success("Address copied to clipboard!")
    }
  }

  const handleScan = (text: string) => {
    if (text) {
      // Very basic validation for Ethereum address
      if (text.startsWith("0x") && text.length === 42) {
        setRecipient(text)
        setShowScanner(false)
        toast.success("Address scanned successfully!")
      } else {
        toast.error("Invalid Ethereum address format.")
      }
    }
  }

  const handleTransfer = async () => {
    if (!contract || !recipient || !amount) return

    setIsProcessing(true)
    const toastId = toast.loading("Confirming transfer on-chain...")

    try {
      const amountWei = ethers.parseEther(amount)
      const tx = await contract.transfer(recipient, amountWei)
      await tx.wait()

      toast.success("Transfer successful!", { id: toastId })
      setAmount("")
      setRecipient("")
      await refreshUser()
    } catch (e: any) {
      console.error(e)
      toast.error(e?.reason || "Transfer failed.", { id: toastId })
    } finally {
      setIsProcessing(false)
    }
  }

  const formatEth = (val: bigint | undefined) => {
    if (!val) return "0.00 ETH"
    const formatted = ethers.formatEther(val)
    const num = parseFloat(formatted)
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) + " ETH"
  }

  return (
    <div className="space-y-6">
      <SectionIntro
        eyebrow="Transfer workspace"
        title="QR Payment Terminal"
        description="Instantly move funds between internal bank balances using a secure, on-chain QR code scanner."
        badge="/transfer"
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_400px]">
        {/* Left Column: Terminal */}
        <motion.section
          className="panel-surface rounded-[2.5rem] p-6 sm:p-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <p className="text-xl font-bold tracking-tight text-foreground">Peer-to-Peer Transfer</p>
              <p className="text-sm font-medium text-muted-foreground mt-1">Send or receive bank funds seamlessly.</p>
            </div>

            {/* Custom Tab Switcher */}
            <div className="flex items-center rounded-2xl bg-background/50 p-1.5 border border-border/50">
              <button
                onClick={() => setActiveTab("receive")}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-bold transition-all",
                  activeTab === "receive"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <QrCode className="size-4" />
                Receive
              </button>
              <button
                onClick={() => setActiveTab("send")}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-bold transition-all",
                  activeTab === "send"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Send className="size-4" />
                Send
              </button>
            </div>
          </div>

          <div className="relative rounded-[2rem] border border-border/40 bg-background/30 p-8 min-h-[400px]">
            <AnimatePresence mode="wait">
              {activeTab === "receive" && (
                <motion.div
                  key="receive"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center py-6"
                >
                  <p className="text-sm font-bold uppercase tracking-widest text-primary mb-8">Your Payment QR</p>

                  <div className="relative p-6 bg-white rounded-3xl shadow-xl shadow-primary/5">
                    {account ? (
                      <QRCode
                        value={account}
                        size={220}
                        bgColor="#ffffff"
                        fgColor="#020817"
                        level="H"
                      />
                    ) : (
                      <div className="flex size-[220px] items-center justify-center bg-gray-100 rounded-xl">
                        <p className="text-xs text-gray-500">Connect wallet</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 flex flex-col items-center gap-4 text-center">
                    <p className="text-sm font-mono bg-background/80 px-4 py-2 rounded-xl border border-border/50 select-all">
                      {account ? `${account.substring(0, 10)}...${account.substring(34)}` : "Not connected"}
                    </p>
                    <Button
                      variant="outline"
                      className="rounded-xl font-bold bg-background/50 border-primary/20 hover:bg-primary hover:text-primary-foreground"
                      onClick={copyToClipboard}
                    >
                      <Copy className="size-4 mr-2" />
                      Copy Address
                    </Button>
                  </div>
                </motion.div>
              )}

              {activeTab === "send" && (
                <motion.div
                  key="send"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-md mx-auto"
                >
                  {showScanner ? (
                    <div className="space-y-6">
                      <div className="overflow-hidden rounded-3xl border-2 border-primary/30 shadow-lg shadow-primary/10">
                        <Scanner
                          onScan={(result) => handleScan(result[0].rawValue)}
                          components={{
                            finder: true
                          }}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        className="w-full rounded-xl font-bold"
                        onClick={() => setShowScanner(false)}
                      >
                        Cancel Scanner
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[0.7rem] font-bold uppercase tracking-widest text-muted-foreground">
                          Recipient Address
                        </label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="0x..."
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            className="rounded-2xl border-border/50 bg-background/50 px-5 h-14 font-mono text-sm"
                          />
                          <Button
                            className="size-14 rounded-2xl shrink-0"
                            onClick={() => setShowScanner(true)}
                          >
                            <Camera className="size-5" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[0.7rem] font-bold uppercase tracking-widest text-muted-foreground">
                          Transfer Amount (ETH)
                        </label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="rounded-2xl border-border/50 bg-background/50 px-5 h-14 text-lg font-bold"
                        />
                      </div>

                      <div className="pt-4">
                        <Button
                          className="w-full h-14 rounded-2xl text-base font-bold shadow-lg shadow-primary/20"
                          disabled={isProcessing || !recipient || !amount}
                          onClick={handleTransfer}
                        >
                          {isProcessing ? (
                            "Processing..."
                          ) : (
                            <>
                              Send Funds <ArrowRightLeft className="ml-2 size-5" />
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Right Column: Context */}
        <motion.section
          className="space-y-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <article className="panel-surface rounded-[2.5rem] border border-border/50 bg-card/20 p-8 backdrop-blur-xl">
            <SectionIntro
              eyebrow="Safety Notes"
              title="Transfer Policy"
              description="Review our protocol rules for sending internal bank funds."
            />
            <div className="mt-8 grid gap-4">
              <MiniStat label="Your Available Balance" value={formatEth(user?.balance)} />
              <MiniStat label="Settlement Speed" value="Instant (On-chain)" />
              <MiniStat label="Transaction Fee" value="0.00 ETH (Bank covered)" />
            </div>

            <div className="mt-8 rounded-3xl bg-primary/5 p-5 border border-primary/10">
              <p className="text-[0.7rem] font-bold uppercase tracking-wider text-primary">Zero-Trust Settlement</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground/80">
                Transfers executed via this terminal move funds directly between user balances within the Decentralized Bank smart contract. They do not trigger an external ETH withdrawal.
              </p>
            </div>
          </article>
        </motion.section>
      </div>
    </div>
  )
}
