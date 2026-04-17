export type LandingNavItem = {
  label: string
  href: string
  description: string
}

export type TrustMetric = {
  value: string
  label: string
  detail: string
}

export type ProductPillar = {
  eyebrow: string
  title: string
  description: string
}

export type ContractPreview = {
  name: string
  chain: string
  tvl: string
  status: string
}

export type OverviewCard = {
  label: string
  value: string
  trend: string
  detail: string
}

export type FlowPoint = {
  month: string
  inflow: number
  outflow: number
}

export type TreasurySlice = {
  name: string
  value: number
  amount: string
}

export type ContractRecord = {
  name: string
  network: string
  type: string
  yield: string
  collateral: string
  maturity: string
  status: string
}

export type TransactionRecord = {
  title: string
  contract: string
  counterparty: string
  direction: "in" | "out"
  amount: string
  time: string
  status: string
}

export type ActionPanel = {
  title: string
  amount: string
  rate: string
  note: string
  accent: string
  action: string
}

export type ProtocolEvent = {
  title: string
  detail: string
  severity: "healthy" | "watch" | "alert"
}

export const landingNavItems: LandingNavItem[] = [
  {
    label: "Overview",
    href: "#overview",
    description: "See the core banking experience.",
  },
  {
    label: "Contracts",
    href: "#contracts",
    description: "Audit-ready smart contract access.",
  },
  {
    label: "Flows",
    href: "#flows",
    description: "Track bank inflows and outflows live.",
  },
  {
    label: "Lending",
    href: "#lending",
    description: "Borrow or deposit from one workspace.",
  },
]

export const trustMetrics: TrustMetric[] = [
  {
    value: "$128M",
    label: "secured liquidity routed",
    detail: "Across lending, reserve, and settlement pools.",
  },
  {
    value: "99.98%",
    label: "settlement reliability",
    detail: "Observed across the last 90 days of mocked flows.",
  },
  {
    value: "18",
    label: "audited smart vaults",
    detail: "Contracts surfaced in one adaptive member workspace.",
  },
]

export const productPillars: ProductPillar[] = [
  {
    eyebrow: "Personal dashboard",
    title: "A member space that feels like a private banking terminal.",
    description:
      "Each account has a dedicated dashboard with fund balances, credit health, contract snapshots, and actionable next steps.",
  },
  {
    eyebrow: "Contract visibility",
    title: "Smart contracts are readable instead of intimidating.",
    description:
      "Vault state, maturity windows, collateral status, and yield expectations are presented as calm, high-signal cards.",
  },
  {
    eyebrow: "Bank movement tracking",
    title: "Incoming and outgoing bank transactions stay front and center.",
    description:
      "Treasury inflows, borrower disbursements, deposit settlements, and reserve rebalances are grouped into a fast-scanning ledger.",
  },
  {
    eyebrow: "Responsive control",
    title: "The full banking workflow works cleanly on mobile and desktop.",
    description:
      "Desktop uses a fixed navigation rail while mobile gets a left-slide menu that keeps actions within thumb reach.",
  },
]

export const contractPreview: ContractPreview[] = [
  {
    name: "Liquidity Guard Vault",
    chain: "Polygon",
    tvl: "$1.8M",
    status: "Audited",
  },
  {
    name: "Prime Collateral Pool",
    chain: "Ethereum",
    tvl: "$960K",
    status: "Healthy",
  },
  {
    name: "Yield Reserve Escrow",
    chain: "Base",
    tvl: "$420K",
    status: "Refreshing",
  },
]

export const dashboardOverview: OverviewCard[] = [
  {
    label: "Available liquidity",
    value: "$842,500",
    trend: "+12.8%",
    detail: "Ready to deploy or withdraw instantly.",
  },
  {
    label: "Funds under contract",
    value: "$3.98M",
    trend: "+8 contracts",
    detail: "Spread across yield, reserve, and loan facilities.",
  },
  {
    label: "Borrow power",
    value: "$615,000",
    trend: "182% ratio",
    detail: "Backed by diversified collateral baskets.",
  },
  {
    label: "Net blended APY",
    value: "5.42%",
    trend: "+0.63%",
    detail: "Across the current mix of deposits and loans.",
  },
]

export const flowData: FlowPoint[] = [
  { month: "Jan", inflow: 420, outflow: 250 },
  { month: "Feb", inflow: 530, outflow: 320 },
  { month: "Mar", inflow: 490, outflow: 300 },
  { month: "Apr", inflow: 610, outflow: 360 },
  { month: "May", inflow: 730, outflow: 410 },
  { month: "Jun", inflow: 690, outflow: 380 },
  { month: "Jul", inflow: 840, outflow: 520 },
]

export const treasuryBreakdown: TreasurySlice[] = [
  { name: "Liquid reserves", value: 34, amount: "$1.64M" },
  { name: "Loan facilities", value: 27, amount: "$1.30M" },
  { name: "Yield contracts", value: 23, amount: "$1.11M" },
  { name: "Insurance buffer", value: 16, amount: "$770K" },
]

export const contractRecords: ContractRecord[] = [
  {
    name: "Prime Yield Loop",
    network: "Ethereum",
    type: "Deposit vault",
    yield: "4.9% APY",
    collateral: "USDC reserve",
    maturity: "14 Sep 2026",
    status: "Stable",
  },
  {
    name: "Invoice Credit Lane",
    network: "Polygon",
    type: "Borrow line",
    yield: "6.2% APR",
    collateral: "ETH basket",
    maturity: "02 Nov 2026",
    status: "Monitored",
  },
  {
    name: "Treasury Buffer Node",
    network: "Base",
    type: "Protection vault",
    yield: "3.1% APY",
    collateral: "DAI reserve",
    maturity: "Always on",
    status: "Healthy",
  },
]

export const transactionRecords: TransactionRecord[] = [
  {
    title: "Reserve top-up received",
    contract: "Prime Yield Loop",
    counterparty: "Bank treasury",
    direction: "in",
    amount: "+$120,000",
    time: "08:42 UTC",
    status: "Confirmed",
  },
  {
    title: "Borrow line disbursed",
    contract: "Invoice Credit Lane",
    counterparty: "Member wallet",
    direction: "out",
    amount: "-$48,500",
    time: "07:18 UTC",
    status: "Settled",
  },
  {
    title: "Interest payout returned",
    contract: "Prime Yield Loop",
    counterparty: "Yield reserve",
    direction: "in",
    amount: "+$9,840",
    time: "06:05 UTC",
    status: "Cleared",
  },
  {
    title: "Insurance buffer rebalance",
    contract: "Treasury Buffer Node",
    counterparty: "Protection multisig",
    direction: "out",
    amount: "-$16,200",
    time: "Yesterday",
    status: "Pending review",
  },
]

export const actionPanels: ActionPanel[] = [
  {
    title: "Deposit into liquidity",
    amount: "25,000 USDC",
    rate: "Earn 4.9% APY",
    note: "Funds settle into the guarded vault and become visible in the contract list immediately.",
    accent: "emerald",
    action: "Preview deposit",
  },
  {
    title: "Borrow against collateral",
    amount: "8,500 DAI",
    rate: "Pay 6.2% APR",
    note: "The line stays inside policy while the collateral ratio holds above the bank threshold.",
    accent: "cyan",
    action: "Preview loan",
  },
]

export const protocolEvents: ProtocolEvent[] = [
  {
    title: "Daily reserve proof synced",
    detail: "Latest solvency snapshot arrived at 07:40 UTC.",
    severity: "healthy",
  },
  {
    title: "Liquidation buffer above target",
    detail: "Current blended coverage is 182% against policy floor.",
    severity: "healthy",
  },
  {
    title: "Multisig rotation window",
    detail: "Operational key rotation is due in 3 days.",
    severity: "watch",
  },
]
