
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title TokenEstateAuth
 * @dev Contract for user authentication and verification in the TokenEstate platform
 */
contract TokenEstateAuth is Ownable {
    using ECDSA for bytes32;

    // Events
    event UserRegistered(address indexed userAddress, string registrationType, uint256 timestamp);
    event UserVerified(address indexed userAddress, string verificationType, uint256 timestamp);
    event WalletConnected(address indexed userAddress, string walletType, uint256 timestamp);
    event LoginAttempt(address indexed userAddress, bool success, uint256 timestamp);

    // Structs
    struct User {
        bool registered;
        bool verified;
        string email;
        string phoneNumber;
        address[] wallets;
        uint256 registrationTime;
        uint256 lastLoginTime;
    }

    // State variables
    mapping(address => User) public users;
    mapping(string => address) private emailToAddress;
    mapping(string => address) private phoneToAddress;
    
    // Constructor
    constructor() Ownable(msg.sender) {}

    /**
     * @dev Register a new user with email
     * @param _email User's email address
     */
    function registerWithEmail(string memory _email) external {
        require(!users[msg.sender].registered, "User already registered");
        require(emailToAddress[_email] == address(0), "Email already registered");
        
        users[msg.sender].registered = true;
        users[msg.sender].email = _email;
        users[msg.sender].registrationTime = block.timestamp;
        users[msg.sender].wallets.push(msg.sender);
        
        emailToAddress[_email] = msg.sender;
        
        emit UserRegistered(msg.sender, "email", block.timestamp);
    }

    /**
     * @dev Register a new user with phone number
     * @param _phoneNumber User's phone number
     */
    function registerWithPhone(string memory _phoneNumber) external {
        require(!users[msg.sender].registered, "User already registered");
        require(phoneToAddress[_phoneNumber] == address(0), "Phone number already registered");
        
        users[msg.sender].registered = true;
        users[msg.sender].phoneNumber = _phoneNumber;
        users[msg.sender].registrationTime = block.timestamp;
        users[msg.sender].wallets.push(msg.sender);
        
        phoneToAddress[_phoneNumber] = msg.sender;
        
        emit UserRegistered(msg.sender, "phone", block.timestamp);
    }

    /**
     * @dev Connect additional wallet to user account
     * @param _walletAddress New wallet address to connect
     * @param _signature Signature proving ownership of the wallet
     */
    function connectWallet(address _walletAddress, bytes memory _signature) external {
        require(users[msg.sender].registered, "User not registered");
        
        // Create message hash
        bytes32 messageHash = keccak256(abi.encodePacked(msg.sender, _walletAddress, "connect_wallet"));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        
        // Verify signature
        address signer = ethSignedMessageHash.recover(_signature);
        require(signer == _walletAddress, "Invalid signature");
        
        // Add wallet
        users[msg.sender].wallets.push(_walletAddress);
        
        emit WalletConnected(msg.sender, "metamask", block.timestamp);
    }

    /**
     * @dev Verify user's identity (to be called by owner after KYC)
     * @param _userAddress Address of the user to verify
     */
    function verifyUser(address _userAddress) external onlyOwner {
        require(users[_userAddress].registered, "User not registered");
        users[_userAddress].verified = true;
        
        emit UserVerified(_userAddress, "kyc", block.timestamp);
    }

    /**
     * @dev Login function to update last login time
     */
    function login() external {
        require(users[msg.sender].registered, "User not registered");
        
        users[msg.sender].lastLoginTime = block.timestamp;
        
        emit LoginAttempt(msg.sender, true, block.timestamp);
    }

    /**
     * @dev Check if a user is registered
     * @param _userAddress Address to check
     * @return bool True if user is registered
     */
    function isRegistered(address _userAddress) external view returns (bool) {
        return users[_userAddress].registered;
    }

    /**
     * @dev Check if a user is verified
     * @param _userAddress Address to check
     * @return bool True if user is verified
     */
    function isVerified(address _userAddress) external view returns (bool) {
        return users[_userAddress].verified;
    }

    /**
     * @dev Get user's wallets
     * @param _userAddress Address of the user
     * @return address[] Array of connected wallet addresses
     */
    function getUserWallets(address _userAddress) external view returns (address[] memory) {
        require(users[_userAddress].registered, "User not registered");
        return users[_userAddress].wallets;
    }
}
