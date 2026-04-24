import type { LucideIcon } from "lucide-react"
import {
  ArrowUpRight,
  FileLock2,
  HandCoins,
  LayoutDashboard,
  Wallet2,
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
    title: "Personal Bank Dashboard",
    subtitle:
      "Track your active balance, contract exposure, and active loans in a single real-time view.",
    searchPlaceholder: "Search funds or transaction history",
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
    label: "Deposit",
    href: "/deposit",
    icon: Wallet2,
    description: "Deposit funds into the bank vault.",
    eyebrow: "Deposit workspace",
    title: "Liquid Assets Studio",
    subtitle:
      "Preview deposit opportunities and grow your available capital by funding the decentralized bank.",
    searchPlaceholder: "Search deposit rate or policy term",
  },
  {
    label: "Borrow",
    href: "/borrow",
    icon: HandCoins,
    description: "Borrow funds against your collateral.",
    eyebrow: "Borrowing workspace",
    title: "Credit Capacity Studio",
    subtitle:
      "Check your borrowing capacity and manage your active loans from this dedicated interface.",
    searchPlaceholder: "Search loan lane or credit guardrail",
  },
]

export function getPortalRoute(pathname: string) {
  return portalRoutes.find((route) => route.href === pathname) ?? portalRoutes[0]
}
