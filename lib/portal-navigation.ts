import type { LucideIcon } from "lucide-react"
import {
  ArrowUpRight,
  FileLock2,
  HandCoins,
  LayoutDashboard,
} from "lucide-react"

export type PortalRoute = {
  label: string
  href: string
  icon: LucideIcon
  description: string
  eyebrow: string
  title: string
  subtitle: string
  searchPlaceholder: string
}

export const portalRoutes: PortalRoute[] = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Funds, treasury mix, and protocol health.",
    eyebrow: "Member workspace",
    title: "Aarav Shah • Liquidity Partner",
    subtitle:
      "Track available funds, current contract exposure, treasury allocation, and member health in one route-first view.",
    searchPlaceholder: "Search funds, policy signals, or summaries",
  },
  {
    label: "Contracts",
    href: "/contract",
    icon: FileLock2,
    description: "Live smart agreements and maturity windows.",
    eyebrow: "Contract workspace",
    title: "Smart Contract Command Center",
    subtitle:
      "Review active vaults, collateral positions, agreement maturity, and audit-adjacent contract context from a dedicated page.",
    searchPlaceholder: "Search contract name, network, or status",
  },
  {
    label: "Transactions",
    href: "/transactions",
    icon: ArrowUpRight,
    description: "Incoming and outgoing bank ledger activity.",
    eyebrow: "Ledger workspace",
    title: "Treasury Movement Ledger",
    subtitle:
      "Inspect recent bank inflows and outflows, settlement state, and movement patterns without leaving the member portal.",
    searchPlaceholder: "Search transaction, counterparty, or direction",
  },
  {
    label: "Lending",
    href: "/lending",
    icon: HandCoins,
    description: "Deposit funds or borrow against collateral.",
    eyebrow: "Lending workspace",
    title: "Borrow And Deposit Studio",
    subtitle:
      "Preview deposit opportunities, borrowing capacity, and credit guardrails from a dedicated lending interface.",
    searchPlaceholder: "Search loan lane, deposit rate, or policy term",
  },
]

export function getPortalRoute(pathname: string) {
  return portalRoutes.find((route) => route.href === pathname) ?? portalRoutes[0]
}
