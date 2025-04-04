
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title RealEstateTokenization
 * @dev Contract for tokenizing real estate properties as NFTs
 * This allows users to invest in fractional ownership of properties
 */
contract RealEstateTokenization is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    // Property struct to store property details
    struct Property {
        string name;
        string location;
        uint256 price;          // Total price in wei
        uint256 area;           // Area in square feet/meters
        uint256 fractions;      // Total number of fractions this property is divided into
        uint256 fractionsLeft;  // Remaining fractions available for purchase
        uint256 pricePerFraction; // Price per fraction
        bool isListed;          // Is the property currently listed for investment
    }
    
    // User investment details
    struct Investment {
        uint256 propertyId;
        uint256 fractions;
        uint256 investmentAmount;
        uint256 timestamp;
    }
    
    // Mapping from token ID to Property
    mapping(uint256 => Property) public properties;
    
    // Mapping from user address to their investments
    mapping(address => Investment[]) public userInvestments;
    
    // Mapping from property ID to investors
    mapping(uint256 => address[]) public propertyInvestors;
    
    // Wallet address verification
    mapping(address => bool) public verifiedWallets;
    
    // Events
    event PropertyListed(uint256 indexed tokenId, string name, uint256 price, uint256 fractions);
    event FractionsPurchased(address indexed buyer, uint256 indexed propertyId, uint256 fractions, uint256 amount);
    event WalletConnected(address indexed wallet, string walletType);
    
    // Wallet types - used for event logging purposes only
    string public constant WALLET_TYPE_METAMASK = "metamask";
    string public constant WALLET_TYPE_COINBASE = "coinbase";
    string public constant WALLET_TYPE_TRUST = "trustwallet";
    string public constant WALLET_TYPE_PHANTOM = "phantom";
    
    constructor() ERC721("Real Estate Token", "RET") {}
    
    /**
     * @dev Records wallet connection for a user
     * @param walletType The type of wallet being connected
     */
    function connectWallet(string memory walletType) external {
        verifiedWallets[msg.sender] = true;
        emit WalletConnected(msg.sender, walletType);
    }
    
    /**
     * @dev Lists a new property for investment
     */
    function listProperty(
        string memory name,
        string memory location,
        uint256 price,
        uint256 area,
        uint256 fractions,
        string memory tokenURI
    ) external onlyOwner returns (uint256) {
        require(fractions > 0, "Number of fractions must be positive");
        
        uint256 newItemId = _tokenIds.current();
        _mint(address(this), newItemId);
        _setTokenURI(newItemId, tokenURI);
        
        properties[newItemId] = Property({
            name: name,
            location: location,
            price: price,
            area: area,
            fractions: fractions,
            fractionsLeft: fractions,
            pricePerFraction: price / fractions,
            isListed: true
        });
        
        _tokenIds.increment();
        
        emit PropertyListed(newItemId, name, price, fractions);
        return newItemId;
    }
    
    /**
     * @dev Allows a user to purchase fractions of a property
     */
    function purchaseFractions(uint256 propertyId, uint256 fractionAmount) external payable {
        require(verifiedWallets[msg.sender], "Wallet not connected");
        require(propertyId < _tokenIds.current(), "Property does not exist");
        require(properties[propertyId].isListed, "Property not listed for investment");
        require(properties[propertyId].fractionsLeft >= fractionAmount, "Not enough fractions available");
        require(msg.value >= properties[propertyId].pricePerFraction * fractionAmount, "Insufficient funds sent");
        
        properties[propertyId].fractionsLeft -= fractionAmount;
        
        // Record the investment
        userInvestments[msg.sender].push(Investment({
            propertyId: propertyId,
            fractions: fractionAmount,
            investmentAmount: msg.value,
            timestamp: block.timestamp
        }));
        
        // Add investor to property's investor list if not already there
        bool isExistingInvestor = false;
        for(uint i = 0; i < propertyInvestors[propertyId].length; i++) {
            if(propertyInvestors[propertyId][i] == msg.sender) {
                isExistingInvestor = true;
                break;
            }
        }
        
        if(!isExistingInvestor) {
            propertyInvestors[propertyId].push(msg.sender);
        }
        
        emit FractionsPurchased(msg.sender, propertyId, fractionAmount, msg.value);
    }
    
    /**
     * @dev Gets all properties listed on the platform
     */
    function getPropertyDetails(uint256 propertyId) external view returns (
        string memory name,
        string memory location,
        uint256 price,
        uint256 area,
        uint256 fractions,
        uint256 fractionsLeft,
        uint256 pricePerFraction,
        bool isListed
    ) {
        require(propertyId < _tokenIds.current(), "Property does not exist");
        
        Property memory property = properties[propertyId];
        return (
            property.name,
            property.location,
            property.price,
            property.area,
            property.fractions,
            property.fractionsLeft,
            property.pricePerFraction,
            property.isListed
        );
    }
    
    /**
     * @dev Gets all investments for a user
     */
    function getUserInvestments(address user) external view returns (Investment[] memory) {
        return userInvestments[user];
    }
    
    /**
     * @dev Gets all investors for a property
     */
    function getPropertyInvestors(uint256 propertyId) external view returns (address[] memory) {
        require(propertyId < _tokenIds.current(), "Property does not exist");
        return propertyInvestors[propertyId];
    }
    
    /**
     * @dev Withdraw funds from the contract (only owner)
     */
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
