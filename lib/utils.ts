import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getErrorMessage(error: any): string {
  if (typeof error === "string") return error

  // Ethers v6 Error parsing
  const reason = error?.reason || error?.message || ""
  
  if (reason.includes("user rejected action") || reason.includes("ACTION_REJECTED")) {
    return "Transaction cancelled by user."
  }
  
  if (reason.includes("insufficient funds") || reason.includes("INSUFFICIENT_FUNDS")) {
    return "Insufficient funds for this transaction."
  }

  if (reason.includes("execution reverted:")) {
    return reason.split("execution reverted:")[1]?.trim() || "Transaction reverted by smart contract."
  }

  // Handle nested error objects
  if (error?.error?.message) {
    return getErrorMessage(error.error.message)
  }

  // Default to a cleaner version of the message
  return reason.split("(")[0].trim() || "An unexpected error occurred."
}

const ETH_PRICE_USD = 3250.42 // Static price for consistent UI

export function formatUSD(ethAmount: bigint | string): string {
  const eth = typeof ethAmount === "bigint" ? parseFloat(ethers.formatEther(ethAmount)) : parseFloat(ethAmount)
  const usdValue = eth * ETH_PRICE_USD
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(usdValue)
}

import { ethers } from "ethers"
