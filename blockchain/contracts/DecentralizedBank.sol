// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

contract DecentralizedBank {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    address public bankAdmin;

    struct User {
        bool isRegistered;
        string name;
        uint256 balance;
        uint256 loanAmount;
        uint256 loanTimestamp;
        uint256 interestRate;
    }

    mapping(address => User) public users;
    mapping(address => uint256) public nonces;

    uint256 public totalBankReserve;

    event UserRegistered(address indexed user, string name);
    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event Transfer(address indexed from, address indexed to, uint256 amount);
    event LoanTaken(address indexed user, uint256 amount, uint256 interestRate);
    event LoanRepaid(address indexed user, uint256 principalPaid, uint256 interestPaid, uint256 remainingPrincipal);

    modifier onlyRegistered() {
        require(users[msg.sender].isRegistered, "User not registered");
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == bankAdmin, "Not bank admin");
        _;
    }

    constructor() {
        bankAdmin = msg.sender;
    }

    // 1. User Registration
    function registerUser(string memory _name) external {
        require(!users[msg.sender].isRegistered, "Already registered");
        users[msg.sender] = User({
            isRegistered: true,
            name: _name,
            balance: 0,
            loanAmount: 0,
            loanTimestamp: 0,
            interestRate: 0
        });
        emit UserRegistered(msg.sender, _name);
    }

    // 2. Deposit Funds
    function deposit() external payable onlyRegistered {
        require(msg.value > 0, "Deposit amount must be > 0");
        users[msg.sender].balance += msg.value;
        totalBankReserve += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    // 3. Withdraw Funds
    function withdraw(uint256 _amount) external onlyRegistered {
        require(users[msg.sender].balance >= _amount, "Insufficient balance");
        users[msg.sender].balance -= _amount;
        totalBankReserve -= _amount;
        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, "Transfer failed");
        emit Withdraw(msg.sender, _amount);
    }

    // 4. Transfer to another user within the bank
    function transfer(address _to, uint256 _amount) external onlyRegistered {
        require(users[_to].isRegistered, "Recipient not registered");
        require(users[msg.sender].balance >= _amount, "Insufficient balance");
        
        users[msg.sender].balance -= _amount;
        users[_to].balance += _amount;
        
        emit Transfer(msg.sender, _to, _amount);
    }

    // Bank taking user money requires user signature
    function adminWithdrawUserFunds(address _user, uint256 _amount, bytes memory _signature) external onlyAdmin {
        require(users[_user].balance >= _amount, "Insufficient user balance");
        
        uint256 nonce = nonces[_user];
        // User signs that they allow the bank to withdraw this amount
        bytes32 messageHash = keccak256(abi.encodePacked("WITHDRAW", _user, _amount, nonce));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        
        address signer = ethSignedMessageHash.recover(_signature);
        require(signer == _user, "Invalid user signature");

        nonces[_user]++;

        users[_user].balance -= _amount;
        totalBankReserve -= _amount;
        
        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, "Transfer failed");
    }

    // 5. Take Loan with Bank Signature
    function takeLoan(uint256 _amount, uint256 _interestRate, bytes memory _signature) external onlyRegistered {
        require(users[msg.sender].loanAmount == 0, "Already have an active loan");
        require(_amount > 0, "Loan amount must be > 0");

        uint256 nonce = nonces[msg.sender];
        bytes32 messageHash = keccak256(abi.encodePacked(msg.sender, _amount, _interestRate, nonce));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        
        address signer = ethSignedMessageHash.recover(_signature);
        require(signer == bankAdmin, "Invalid bank signature");

        nonces[msg.sender]++;

        // Ensure the contract has enough balance to give out the loan
        require(address(this).balance >= _amount, "Bank has insufficient liquidity");

        users[msg.sender].loanAmount = _amount;
        users[msg.sender].loanTimestamp = block.timestamp;
        users[msg.sender].interestRate = _interestRate;
        
        // Loan is added to user's bank balance, they can withdraw or transfer it
        users[msg.sender].balance += _amount;
        // Note: totalBankReserve doesn't decrease yet because funds are still in the contract (in user's balance)
        // It will decrease when the user calls withdraw().

        emit LoanTaken(msg.sender, _amount, _interestRate);
    }

    // Calculate accrued interest
    function calculateInterest(address _user) public view returns (uint256) {
        User memory user = users[_user];
        if (user.loanAmount == 0) return 0;
        
        uint256 timeElapsed = block.timestamp - user.loanTimestamp;
        // Simple interest: (Principal * Rate * TimeInSeconds) / (100 * 365 days in seconds)
        // Rate is in percentage (e.g., 5 for 5%)
        uint256 interest = (user.loanAmount * user.interestRate * timeElapsed) / (100 * 365 days);
        return interest;
    }

    // 6. Repay Loan (Full or Partial)
    function repayLoan(uint256 _amount) external onlyRegistered {
        require(users[msg.sender].loanAmount > 0, "No active loan");
        require(_amount > 0, "Repayment amount must be > 0");

        uint256 interest = calculateInterest(msg.sender);
        uint256 totalDue = users[msg.sender].loanAmount + interest;

        require(_amount <= totalDue, "Repayment amount exceeds total due");
        require(users[msg.sender].balance >= _amount, "Insufficient bank balance to repay loan");

        users[msg.sender].balance -= _amount;
        
        uint256 interestPaid;
        uint256 principalPaid;

        if (_amount >= interest) {
            interestPaid = interest;
            principalPaid = _amount - interest;
        } else {
            interestPaid = _amount;
            principalPaid = 0;
        }

        // New principal is total debt minus the repayment
        users[msg.sender].loanAmount = totalDue - _amount;
        users[msg.sender].loanTimestamp = block.timestamp;
        
        // If loan is fully repaid, reset interest rate
        if (users[msg.sender].loanAmount == 0) {
            users[msg.sender].interestRate = 0;
            users[msg.sender].loanTimestamp = 0;
        }

        emit LoanRepaid(msg.sender, principalPaid, interestPaid, users[msg.sender].loanAmount);
    }

    // Admin function to fund the bank so it has liquidity for loans
    function fundBank() external payable {
        totalBankReserve += msg.value;
    }

    // Admin can withdraw the earned interest / reserve
    function withdrawReserve(uint256 _amount) external onlyAdmin {
        require(totalBankReserve >= _amount, "Insufficient reserve");
        totalBankReserve -= _amount;
        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, "Transfer failed");
    }
}
