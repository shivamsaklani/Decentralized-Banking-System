import type { Metadata } from "next"
import { DepositPage } from "@/components/bank/deposit-page"

export const metadata: Metadata = {
  title: "Deposit funds",
  description: "Deposit your assets into the decentralized bank.",
}

export default function DepositRoutePage() {
  return <DepositPage />
}
