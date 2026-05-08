"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { ethers } from "ethers"
import { contractAddress, contractAbi } from "./contract-config"
import toast from "react-hot-toast"

export type UserDetails = {
  isRegistered: boolean
  name: string
  balance: bigint
  loanAmount: bigint
  loanTimestamp: bigint
  interestRate: bigint
}

export type TransactionEvent = {
  id: string
  type: "Deposit" | "Withdraw" | "LoanTaken" | "LoanRepaid" | "Transfer"
  amount: bigint
  interestPaid?: bigint
  remainingPrincipal?: bigint
  date: string
  status: "completed"
}

type Web3ContextType = {
  account: string | null
  provider: ethers.Provider | null
  contract: ethers.Contract | null
  user: UserDetails | null
  bankReserve: bigint
  connectWallet: (forceSelection?: boolean) => Promise<void>
  refreshUser: () => Promise<void>
  fetchUserTransactions: () => Promise<TransactionEvent[]>
  isConnecting: boolean
}

const Web3Context = createContext<Web3ContextType>({
  account: null,
  provider: null,
  contract: null,
  user: null,
  bankReserve: BigInt(0),
  connectWallet: async () => {},
  refreshUser: async () => {},
  fetchUserTransactions: async () => [],
  isConnecting: false,
})

export const useWeb3 = () => useContext(Web3Context)

export function Web3Provider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null)
  const [provider, setProvider] = useState<ethers.Provider | null>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [user, setUser] = useState<UserDetails | null>(null)
  const [bankReserve, setBankReserve] = useState<bigint>(BigInt(0))
  const [isConnecting, setIsConnecting] = useState(false)

  const fetchUser = async (currentContract: ethers.Contract, currentAccount: string) => {
    try {
      const userData = await currentContract.users(currentAccount)
      const fetchedUser = {
        isRegistered: userData.isRegistered,
        name: userData.name,
        balance: userData.balance,
        loanAmount: userData.loanAmount,
        loanTimestamp: userData.loanTimestamp,
        interestRate: userData.interestRate,
      }
      setUser(fetchedUser)
      return fetchedUser
    } catch (error) {
      console.error("Error fetching user data:", error)
      return null
    }
  }
  const fetchBankReserve = async (currentContract: ethers.Contract, currentProvider: ethers.Provider | null) => {
    try {
      const reserve = await currentContract.totalBankReserve()
      setBankReserve(reserve)
    } catch (error) {
      console.error("Error fetching bank reserve:", error)
    }
  }

  const fetchUserTransactions = async (): Promise<TransactionEvent[]> => {
    if (!contract || !account) return []
    
    try {
      // Query events from the DecentralizedBank contract
      const deposits = await contract.queryFilter(contract.filters.Deposit(account))
      const withdraws = await contract.queryFilter(contract.filters.Withdraw(account))
      const loans = await contract.queryFilter(contract.filters.LoanTaken(account))
      const repays = await contract.queryFilter(contract.filters.LoanRepaid(account))
      
      const allEvents = [
        ...deposits.map(e => ({ type: "Deposit" as const, event: e as ethers.EventLog })),
        ...withdraws.map(e => ({ type: "Withdraw" as const, event: e as ethers.EventLog })),
        ...loans.map(e => ({ type: "LoanTaken" as const, event: e as ethers.EventLog })),
        ...repays.map(e => ({ type: "LoanRepaid" as const, event: e as ethers.EventLog }))
      ]
      
      // Sort by block number descending
      allEvents.sort((a, b) => b.event.blockNumber - a.event.blockNumber)
      
      // Format to our TransactionEvent type
      return allEvents.map((item, index) => {
        let amount = BigInt(0)
        let interestPaid = undefined
        let remainingPrincipal = undefined
        
        // Parse the amount from the event args depending on event type
        if (item.type === "Deposit" || item.type === "Withdraw") {
          amount = item.event.args[1] // amount is the 2nd arg
        } else if (item.type === "LoanTaken") {
          amount = item.event.args[1] // amount is the 2nd arg
        } else if (item.type === "LoanRepaid") {
          // New LoanRepaid: (address indexed user, uint256 principalPaid, uint256 interestPaid, uint256 remainingPrincipal)
          amount = item.event.args[1] // principalPaid
          interestPaid = item.event.args[2]
          remainingPrincipal = item.event.args[3]
        }

        return {
          id: `${item.event.transactionHash}-${item.event.index}`,
          type: item.type,
          amount,
          interestPaid,
          remainingPrincipal,
          date: `Block ${item.event.blockNumber}`, // Since timestamps are slow to fetch per block locally
          status: "completed"
        }
      })
    } catch (error) {
      console.error("Failed to fetch transactions", error)
      return []
    }
  }
  const connectWallet = async (forceSelection = false) => {
    setIsConnecting(true)
    try {
      if (typeof window !== "undefined" && (window as any).ethereum) {
        const browserProvider = new ethers.BrowserProvider((window as any).ethereum)
        
        if (forceSelection) {
          try {
            await browserProvider.send("wallet_requestPermissions", [{ eth_accounts: {} }])
          } catch (e) {
            console.warn("User cancelled account selection", e)
            setIsConnecting(false)
            return
          }
        } else {
          await browserProvider.send("eth_requestAccounts", [])
        }

        const signer = await browserProvider.getSigner()
        const address = await signer.getAddress()
        
        const bankContract = new ethers.Contract(contractAddress, contractAbi, signer)
        
        await fetchUser(bankContract, address)
        await fetchBankReserve(bankContract, browserProvider)

        setProvider(browserProvider)
        setAccount(address)
        setContract(bankContract)
      } else {
        console.warn("MetaMask not found. Falling back to local Hardhat node.")
        // Fallback for local testing (Hardhat Account #1)
        const localProvider = new ethers.JsonRpcProvider("http://localhost:8545")
        // Use Account #1 (Account #0 is the bank admin)
        const localWallet = new ethers.Wallet("0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d", localProvider)
        const address = localWallet.address
        
        const bankContract = new ethers.Contract(contractAddress, contractAbi, localWallet)
        
        await fetchUser(bankContract, address)
        await fetchBankReserve(bankContract, localProvider)

        setProvider(localProvider)
        setAccount(address)
        setContract(bankContract)
      }
    } catch (error) {
      console.error("Failed to connect wallet", error)
      toast.error("Failed to connect wallet. Ensure local node is running if using fallback.")
    } finally {
      setIsConnecting(false)
    }
  }

  const refreshUser = async () => {
    if (contract && account) {
      await fetchUser(contract, account)
      await fetchBankReserve(contract, provider)
    }
  }



  // Handle account change
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          connectWallet()
        } else {
          setAccount(null)
          setContract(null)
          setUser(null)
        }
      }

      const handleChainChanged = () => {
        // Recommended by MetaMask: reload the page on chain change to avoid state desync
        window.location.reload()
      }

      const eth = (window as any).ethereum
      if (eth && typeof eth.on === "function") {
        try {
          eth.on("accountsChanged", handleAccountsChanged)
          eth.on("chainChanged", handleChainChanged)
        } catch (e) {
          console.warn("Could not attach ethereum event listeners", e)
        }
      }

      return () => {
        if (eth && typeof eth.removeListener === "function") {
          try {
            eth.removeListener("accountsChanged", handleAccountsChanged)
            eth.removeListener("chainChanged", handleChainChanged)
          } catch (e) {
            // Ignore teardown errors
          }
        }
      }
    }
  }, [])

  return (
    <Web3Context.Provider
      value={{
        account,
        provider,
        contract,
        user,
        bankReserve,
        connectWallet,
        refreshUser,
        fetchUserTransactions,
        isConnecting,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}
