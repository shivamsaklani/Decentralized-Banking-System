import { NextResponse } from "next/server"
import { ethers } from "ethers"

export async function POST(request: Request) {
  try {
    const { userAddress, amount, interestRate, nonce } = await request.json()

    if (!userAddress || !amount || !interestRate || nonce === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Use the private key from environment variables
    const adminPrivateKey = process.env.PRIVATE_KEY
    if (!adminPrivateKey) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }
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
