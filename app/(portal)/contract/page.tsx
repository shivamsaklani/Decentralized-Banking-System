import type { Metadata } from "next"

import { ContractsPage } from "@/components/bank/contracts-page"

export const metadata: Metadata = {
  title: "Contracts",
  description: "Route-based contract page for the decentralized banking portal.",
}

export default function ContractPage() {
  return <ContractsPage />
}
