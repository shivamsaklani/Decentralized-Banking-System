import type { Metadata } from "next"

import { TransactionsPage } from "@/components/bank/transactions-page"

export const metadata: Metadata = {
  title: "Transactions",
  description:
    "Route-based transactions page for incoming and outgoing bank activity.",
}

export default function TransactionsRoutePage() {
  return <TransactionsPage />
}
