import { NextResponse } from "next/server"
import { ethers } from "ethers"

export async function POST(request: Request) {
  try {
    const { userAddress, amount, interestRate, nonce } = await request.json()

    if (!userAddress || !amount || !interestRate || nonce === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Hardhat Account #0 Private Key (Admin)
    const adminPrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
    const adminWallet = new ethers.Wallet(adminPrivateKey)

    // Construct the message hash exactly as done in Solidity:
    // keccak256(abi.encodePacked(msg.sender, _amount, _interestRate, nonce));
    // Note: Since ethers v6, we use ethers.solidityPackedKeccak256
    const messageHash = ethers.solidityPackedKeccak256(
      ["address", "uint256", "uint256", "uint256"],
      [userAddress, amount, interestRate, nonce]
    )

    // Sign the hash
    const signature = await adminWallet.signMessage(ethers.getBytes(messageHash))

    return NextResponse.json({ signature })
  } catch (error) {
    console.error("Error signing loan:", error)
    return NextResponse.json({ error: "Failed to sign loan" }, { status: 500 })
  }
}
