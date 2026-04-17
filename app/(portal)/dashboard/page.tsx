import type { Metadata } from "next"

import { OverviewPage } from "@/components/bank/overview-page"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview route for the decentralized banking member portal.",
}

export default function DashboardPage() {
  return <OverviewPage />
}
