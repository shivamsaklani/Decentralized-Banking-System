import { ethers } from "hardhat";

async function main() {
  const address = process.env.WALLET_ADDRESS;
  
  if (!address) {
    console.error("❌ Please provide a WALLET_ADDRESS environment variable.");
    console.log("Example: WALLET_ADDRESS=0xYourAddress npx hardhat run scripts/fund-wallet.ts --network localhost");
    process.exit(1);
  }

  console.log(`Funding ${address} with 100 ETH...`);

  // Get the first default Hardhat account (which has 10,000 ETH)
  const [sender] = await ethers.getSigners();
  
  const tx = await sender.sendTransaction({
    to: address,
    value: ethers.parseEther("100.0"), // Send 100 ETH
  });

  await tx.wait();
  
  const newBalance = await ethers.provider.getBalance(address);
  console.log(`✅ Successfully sent 100 ETH!`);
  console.log(`💰 New Balance: ${ethers.formatEther(newBalance)} ETH`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
