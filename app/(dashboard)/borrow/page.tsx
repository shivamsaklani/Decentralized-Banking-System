import type { Metadata } from "next"
import { BorrowPage } from "@/components/bank/borrow-page"

export const metadata: Metadata = {
  title: "Borrow funds",
  description: "Borrow assets against your collateral from the decentralized bank.",
}

export default function BorrowRoutePage() {
  return <BorrowPage />
}
