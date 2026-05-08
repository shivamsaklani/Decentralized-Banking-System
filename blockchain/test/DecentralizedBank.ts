import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("DecentralizedBank", function () {
  async function deployBankFixture() {
    const [admin, user1, user2] = await ethers.getSigners();

    const DecentralizedBank = await ethers.getContractFactory("DecentralizedBank");
    const bank = await DecentralizedBank.deploy();

    return { bank, admin, user1, user2 };
  }

  describe("Deployment", function () {
    it("Should set the right admin", async function () {
      const { bank, admin } = await loadFixture(deployBankFixture);
      expect(await bank.bankAdmin()).to.equal(admin.address);
    });
  });

  describe("User Registration", function () {
    it("Should allow a user to register", async function () {
      const { bank, user1 } = await loadFixture(deployBankFixture);
      await expect(bank.connect(user1).registerUser("Alice"))
        .to.emit(bank, "UserRegistered")
        .withArgs(user1.address, "Alice");
      
      const userData = await bank.users(user1.address);
      expect(userData.isRegistered).to.be.true;
      expect(userData.name).to.equal("Alice");
    });
  });

  describe("Deposits and Withdrawals", function () {
    it("Should allow deposits and increase balance", async function () {
      const { bank, user1 } = await loadFixture(deployBankFixture);
      await bank.connect(user1).registerUser("Alice");
      
      const depositAmount = ethers.parseEther("1");
      await expect(bank.connect(user1).deposit({ value: depositAmount }))
        .to.emit(bank, "Deposit")
        .withArgs(user1.address, depositAmount);
        
      const userData = await bank.users(user1.address);
      expect(userData.balance).to.equal(depositAmount);
    });

    it("Should allow withdrawals and decrease balance", async function () {
      const { bank, user1 } = await loadFixture(deployBankFixture);
      await bank.connect(user1).registerUser("Alice");
      
      const depositAmount = ethers.parseEther("1");
      await bank.connect(user1).deposit({ value: depositAmount });
      
      const withdrawAmount = ethers.parseEther("0.5");
      await expect(bank.connect(user1).withdraw(withdrawAmount))
        .to.emit(bank, "Withdraw")
        .withArgs(user1.address, withdrawAmount);
        
      const userData = await bank.users(user1.address);
      expect(userData.balance).to.equal(ethers.parseEther("0.5"));
    });
  });

  describe("Transfers", function () {
    it("Should transfer money to another registered user", async function () {
      const { bank, user1, user2 } = await loadFixture(deployBankFixture);
      
      await bank.connect(user1).registerUser("Alice");
      await bank.connect(user2).registerUser("Bob");
      
      await bank.connect(user1).deposit({ value: ethers.parseEther("2") });
      
      await expect(bank.connect(user1).transfer(user2.address, ethers.parseEther("1")))
        .to.emit(bank, "Transfer")
        .withArgs(user1.address, user2.address, ethers.parseEther("1"));
        
      const user1Data = await bank.users(user1.address);
      const user2Data = await bank.users(user2.address);
      
      expect(user1Data.balance).to.equal(ethers.parseEther("1"));
      expect(user2Data.balance).to.equal(ethers.parseEther("1"));
    });
  });

  describe("Bank Withdrawals", function () {
    it("Should allow bank to withdraw user funds with valid user signature", async function () {
      const { bank, admin, user1 } = await loadFixture(deployBankFixture);
      await bank.connect(user1).registerUser("Alice");
      
      const depositAmount = ethers.parseEther("2");
      await bank.connect(user1).deposit({ value: depositAmount });
      
      const withdrawAmount = ethers.parseEther("1");
      const nonce = await bank.nonces(user1.address);
      
      // User signs that they allow the bank to withdraw
      const messageHash = ethers.solidityPackedKeccak256(
        ["string", "address", "uint256", "uint256"],
        ["WITHDRAW", user1.address, withdrawAmount, nonce]
      );
      const signature = await user1.signMessage(ethers.getBytes(messageHash));
      
      const initialAdminBalance = await ethers.provider.getBalance(admin.address);
      
      const tx = await bank.connect(admin).adminWithdrawUserFunds(user1.address, withdrawAmount, signature);
      const receipt = await tx.wait();
      
      const userData = await bank.users(user1.address);
      expect(userData.balance).to.equal(ethers.parseEther("1"));
      
      // Admin should have received the funds (accounting for gas)
      const finalAdminBalance = await ethers.provider.getBalance(admin.address);
      expect(finalAdminBalance).to.be.gt(initialAdminBalance);
    });

    it("Should fail if bank tries to withdraw user funds without valid user signature", async function () {
      const { bank, admin, user1, user2 } = await loadFixture(deployBankFixture);
      await bank.connect(user1).registerUser("Alice");
      await bank.connect(user1).deposit({ value: ethers.parseEther("2") });
      
      const withdrawAmount = ethers.parseEther("1");
      const nonce = await bank.nonces(user1.address);
      
      const messageHash = ethers.solidityPackedKeccak256(
        ["string", "address", "uint256", "uint256"],
        ["WITHDRAW", user1.address, withdrawAmount, nonce]
      );
      // User2 signs instead of User1
      const signature = await user2.signMessage(ethers.getBytes(messageHash));
      
      await expect(bank.connect(admin).adminWithdrawUserFunds(user1.address, withdrawAmount, signature))
        .to.be.revertedWith("Invalid user signature");
    });
  });

  describe("Loans", function () {
    it("Should fail to take a loan without valid bank signature", async function () {
      const { bank, user1, user2 } = await loadFixture(deployBankFixture);
      await bank.connect(user1).registerUser("Alice");
      
      const loanAmount = ethers.parseEther("1");
      const interestRate = 5;
      
      // user2 signs instead of admin
      const nonce = await bank.nonces(user1.address);
      const messageHash = ethers.solidityPackedKeccak256(
        ["address", "uint256", "uint256", "uint256"],
        [user1.address, loanAmount, interestRate, nonce]
      );
      const signature = await user2.signMessage(ethers.getBytes(messageHash));
      
      await expect(bank.connect(user1).takeLoan(loanAmount, interestRate, signature))
        .to.be.revertedWith("Invalid bank signature");
    });

    it("Should allow taking a loan with valid bank signature", async function () {
      const { bank, admin, user1 } = await loadFixture(deployBankFixture);
      await bank.connect(user1).registerUser("Alice");
      
      // Fund the bank so it has liquidity
      await bank.connect(admin).fundBank({ value: ethers.parseEther("10") });
      
      const loanAmount = ethers.parseEther("1");
      const interestRate = 5; // 5%
      
      const nonce = await bank.nonces(user1.address);
      const messageHash = ethers.solidityPackedKeccak256(
        ["address", "uint256", "uint256", "uint256"],
        [user1.address, loanAmount, interestRate, nonce]
      );
      const signature = await admin.signMessage(ethers.getBytes(messageHash));
      
      await expect(bank.connect(user1).takeLoan(loanAmount, interestRate, signature))
        .to.emit(bank, "LoanTaken")
        .withArgs(user1.address, loanAmount, interestRate);
        
      const userData = await bank.users(user1.address);
      expect(userData.loanAmount).to.equal(loanAmount);
      // Loan should be added to user's bank balance
      expect(userData.balance).to.equal(loanAmount);
    });

    it("Should calculate interest correctly over time", async function () {
      const { bank, admin, user1 } = await loadFixture(deployBankFixture);
      await bank.connect(user1).registerUser("Alice");
      await bank.connect(admin).fundBank({ value: ethers.parseEther("100") });
      
      const loanAmount = ethers.parseEther("10"); // Use 10 instead of 100 to leave some room if needed
      const interestRate = 10; // 10%
      
      const nonce = await bank.nonces(user1.address);
      const messageHash = ethers.solidityPackedKeccak256(
        ["address", "uint256", "uint256", "uint256"],
        [user1.address, loanAmount, interestRate, nonce]
      );
      const signature = await admin.signMessage(ethers.getBytes(messageHash));
      
      await bank.connect(user1).takeLoan(loanAmount, interestRate, signature);
      
      // Advance time by 365 days
      await time.increase(365 * 24 * 60 * 60);
      
      const interest = await bank.calculateInterest(user1.address);
      // 10 * 10% = 1
      expect(interest).to.equal(ethers.parseEther("1"));
    });

    it("Should allow repaying a loan", async function () {
      const { bank, admin, user1 } = await loadFixture(deployBankFixture);
      await bank.connect(user1).registerUser("Alice");
      await bank.connect(admin).fundBank({ value: ethers.parseEther("10") });
      
      const loanAmount = ethers.parseEther("1");
      const interestRate = 10;
      
      const nonce = await bank.nonces(user1.address);
      const messageHash = ethers.solidityPackedKeccak256(
        ["address", "uint256", "uint256", "uint256"],
        [user1.address, loanAmount, interestRate, nonce]
      );
      const signature = await admin.signMessage(ethers.getBytes(messageHash));
      
      await bank.connect(user1).takeLoan(loanAmount, interestRate, signature);
      
      // Advance time by 1 year
      await time.increase(365 * 24 * 60 * 60);
      
      // Interest should be roughly 0.1 ether, but could be slightly higher due to transaction mining time
      const interest = await bank.calculateInterest(user1.address);
      expect(interest).to.be.gte(ethers.parseEther("0.1"));
      
      // User deposits extra 0.2 ether to comfortably cover interest and any extra time
      await bank.connect(user1).deposit({ value: ethers.parseEther("0.2") });
      
      const tx = await bank.connect(user1).repayLoan({ value: loanAmount + interest });
      await tx.wait();
      
      const userData = await bank.users(user1.address);
      // loanAmount should be 0 or very close to it (if extra interest accrued in the tx block)
      expect(userData.loanAmount).to.be.closeTo(0, 1000000000000); 
    });

    it("Should allow partial repayment and calculate interest on remaining principal", async function () {
      const { bank, admin, user1 } = await loadFixture(deployBankFixture);
      await bank.connect(user1).registerUser("Alice");
      await bank.connect(admin).fundBank({ value: ethers.parseEther("100") });
      
      const loanAmount = ethers.parseEther("10");
      const interestRate = 10; // 10%
      
      const nonce = await bank.nonces(user1.address);
      const messageHash = ethers.solidityPackedKeccak256(
        ["address", "uint256", "uint256", "uint256"],
        [user1.address, loanAmount, interestRate, nonce]
      );
      const signature = await admin.signMessage(ethers.getBytes(messageHash));
      
      await bank.connect(user1).takeLoan(loanAmount, interestRate, signature);
      
      // Advance time by 1 year
      await time.increase(365 * 24 * 60 * 60);
      
      // Interest is 1 ETH. Total due is 11 ETH.
      const interest = await bank.calculateInterest(user1.address);
      expect(interest).to.be.gte(ethers.parseEther("1"));
      
      // Repay 5 ETH (part of interest and part of principal)
      // Since interest is ~1 ETH, ~4 ETH goes to principal. Remaining principal should be ~6 ETH.
      const partialRepayment = ethers.parseEther("5");
      await bank.connect(user1).deposit({ value: ethers.parseEther("5") });
      
      // We don't use .withArgs here because of the timing precision
      const repayTx = await bank.connect(user1).repayLoan({ value: partialRepayment });
      await expect(repayTx).to.emit(bank, "LoanRepaid");
        
      const userData = await bank.users(user1.address);
      // loanAmount should be close to 6 ETH
      expect(userData.loanAmount).to.be.closeTo(ethers.parseEther("6"), 1000000000000);
      
      // Advance time by another year
      await time.increase(365 * 24 * 60 * 60);
      
      // New interest should be close to 6 * 10% = 0.6 ETH
      const newInterest = await bank.calculateInterest(user1.address);
      expect(newInterest).to.be.closeTo(ethers.parseEther("0.6"), 1000000000000);
    });
  });
});
