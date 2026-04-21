import type { Metadata } from "next"

import { LendingPage } from "@/components/bank/lending-page"

export const metadata: Metadata = {
  title: "Lending",
  description: "Route-based lending page for deposits and borrowing actions.",
}

export default function LendingRoutePage() {
  return <LendingPage />
}
