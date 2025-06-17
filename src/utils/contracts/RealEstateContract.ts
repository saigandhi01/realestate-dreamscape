
import { ethers } from "ethers";

// Real Estate Contract ABI (from your Solidity contract)
export const REAL_ESTATE_CONTRACT_ABI = [
  // View functions
  "function properties(uint256) view returns (string name, string location, uint256 price, uint256 area, uint256 fractions, uint256 fractionsLeft, uint256 pricePerFraction, bool isListed)",
  "function getPropertyDetails(uint256 propertyId) view returns (string name, string location, uint256 price, uint256 area, uint256 fractions, uint256 fractionsLeft, uint256 pricePerFraction, bool isListed)",
  "function getUserInvestments(address user) view returns (tuple(uint256 propertyId, uint256 fractions, uint256 investmentAmount, uint256 timestamp)[])",
  "function getPropertyInvestors(uint256 propertyId) view returns (address[])",
  "function verifiedWallets(address) view returns (bool)",
  
  // Transaction functions
  "function connectWallet(string walletType)",
  "function purchaseFractions(uint256 propertyId, uint256 fractionAmount) payable",
  "function listProperty(string name, string location, uint256 price, uint256 area, uint256 fractions, string tokenURI) returns (uint256)",
  
  // Events
  "event WalletConnected(address indexed wallet, string walletType)",
  "event PropertyListed(uint256 indexed tokenId, string name, uint256 price, uint256 fractions)",
  "event FractionsPurchased(address indexed buyer, uint256 indexed propertyId, uint256 fractions, uint256 amount)",
  
  // Constants
  "function WALLET_TYPE_METAMASK() view returns (string)",
  "function WALLET_TYPE_COINBASE() view returns (string)",
  "function WALLET_TYPE_TRUST() view returns (string)",
  "function WALLET_TYPE_PHANTOM() view returns (string)"
];

// You'll need to deploy your contract and get the actual address
export const REAL_ESTATE_CONTRACT_ADDRESS = "0x742d35Cc6634C0532925a3b8D6C1E7F6E4C6C5b5"; // Replace with actual deployed address

export class RealEstateContractService {
  private contract: ethers.Contract;
  private signer: ethers.Signer;

  constructor(provider: ethers.providers.Web3Provider) {
    this.signer = provider.getSigner();
    this.contract = new ethers.Contract(
      REAL_ESTATE_CONTRACT_ADDRESS,
      REAL_ESTATE_CONTRACT_ABI,
      this.signer
    );
  }

  async connectWallet(walletType: string): Promise<ethers.ContractTransaction> {
    try {
      const tx = await this.contract.connectWallet(walletType);
      await tx.wait();
      console.log(`Wallet connected: ${walletType}`);
      return tx;
    } catch (error) {
      console.error('Error connecting wallet to contract:', error);
      throw error;
    }
  }

  async purchasePropertyFractions(
    propertyId: number,
    fractionAmount: number,
    totalCost: string
  ): Promise<ethers.ContractTransaction> {
    try {
      const costInWei = ethers.utils.parseEther(totalCost);
      const tx = await this.contract.purchaseFractions(propertyId, fractionAmount, {
        value: costInWei
      });
      
      console.log(`Transaction sent: ${tx.hash}`);
      const receipt = await tx.wait();
      console.log(`Transaction confirmed in block: ${receipt.blockNumber}`);
      
      return tx;
    } catch (error) {
      console.error('Error purchasing property fractions:', error);
      throw error;
    }
  }

  async getPropertyDetails(propertyId: number) {
    try {
      return await this.contract.getPropertyDetails(propertyId);
    } catch (error) {
      console.error(`Error fetching property ${propertyId}:`, error);
      throw error;
    }
  }

  async getUserInvestments(userAddress: string) {
    try {
      return await this.contract.getUserInvestments(userAddress);
    } catch (error) {
      console.error('Error fetching user investments:', error);
      throw error;
    }
  }

  async isWalletVerified(address: string): Promise<boolean> {
    try {
      return await this.contract.verifiedWallets(address);
    } catch (error) {
      console.error('Error checking wallet verification:', error);
      return false;
    }
  }
}
