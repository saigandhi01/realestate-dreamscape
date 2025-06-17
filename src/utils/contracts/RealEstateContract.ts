
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

// Placeholder contract address - replace with actual deployed address
export const REAL_ESTATE_CONTRACT_ADDRESS = "0x742d35Cc6634C0532925a3b8D6C1E7F6E4C6C5b5".toLowerCase();

// Flag to enable mock mode when contract is not deployed
const USE_MOCK_RESPONSES = true;

export class RealEstateContractService {
  private contract: ethers.Contract;
  private signer: ethers.Signer;
  private provider: ethers.providers.Web3Provider;
  private isContractAvailable: boolean = false;

  constructor(provider: ethers.providers.Web3Provider) {
    this.provider = provider;
    this.signer = provider.getSigner();
    this.contract = new ethers.Contract(
      REAL_ESTATE_CONTRACT_ADDRESS,
      REAL_ESTATE_CONTRACT_ABI,
      this.signer
    );
    this.checkContractAvailability();
  }

  private async checkContractAvailability(): Promise<void> {
    try {
      const code = await this.provider.getCode(REAL_ESTATE_CONTRACT_ADDRESS);
      this.isContractAvailable = code !== "0x" && code !== null && code !== undefined;
      if (!this.isContractAvailable) {
        console.warn('Smart contract not deployed at address:', REAL_ESTATE_CONTRACT_ADDRESS);
        console.warn('Using mock responses for development');
      }
    } catch (error) {
      console.error('Error checking contract availability:', error);
      this.isContractAvailable = false;
    }
  }

  async connectWallet(walletType: string): Promise<ethers.ContractTransaction> {
    if (!this.isContractAvailable && USE_MOCK_RESPONSES) {
      console.log(`Mock: Wallet connected: ${walletType}`);
      // Return a mock transaction object
      return {
        hash: `0x${Math.random().toString(16).substr(2, 64)}`,
        wait: async () => ({
          blockNumber: Math.floor(Math.random() * 1000000),
          blockHash: `0x${Math.random().toString(16).substr(2, 64)}`,
          transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
          transactionIndex: 0,
          from: await this.signer.getAddress(),
          to: REAL_ESTATE_CONTRACT_ADDRESS,
          gasUsed: ethers.BigNumber.from("21000"),
          status: 1
        })
      } as ethers.ContractTransaction;
    }

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
    if (!this.isContractAvailable && USE_MOCK_RESPONSES) {
      console.log(`Mock: Purchasing ${fractionAmount} fractions of property ${propertyId} for ${totalCost} ETH`);
      // Return a mock transaction object
      return {
        hash: `0x${Math.random().toString(16).substr(2, 64)}`,
        wait: async () => ({
          blockNumber: Math.floor(Math.random() * 1000000),
          blockHash: `0x${Math.random().toString(16).substr(2, 64)}`,
          transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
          transactionIndex: 0,
          from: await this.signer.getAddress(),
          to: REAL_ESTATE_CONTRACT_ADDRESS,
          gasUsed: ethers.BigNumber.from("100000"),
          status: 1
        })
      } as ethers.ContractTransaction;
    }

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
    if (!this.isContractAvailable && USE_MOCK_RESPONSES) {
      // Return mock property details
      return {
        name: `Mock Property ${propertyId}`,
        location: "123 Mock Street, Mock City",
        price: ethers.BigNumber.from(ethers.utils.parseEther("10")),
        area: ethers.BigNumber.from("1500"),
        fractions: ethers.BigNumber.from("100"),
        fractionsLeft: ethers.BigNumber.from("50"),
        pricePerFraction: ethers.BigNumber.from(ethers.utils.parseEther("0.1")),
        isListed: true
      };
    }

    try {
      return await this.contract.getPropertyDetails(propertyId);
    } catch (error) {
      console.error(`Error fetching property ${propertyId}:`, error);
      throw error;
    }
  }

  async getUserInvestments(userAddress: string) {
    if (!this.isContractAvailable && USE_MOCK_RESPONSES) {
      // Return mock investment data
      return [
        {
          propertyId: ethers.BigNumber.from("1"),
          fractions: ethers.BigNumber.from("5"),
          investmentAmount: ethers.BigNumber.from(ethers.utils.parseEther("0.5")),
          timestamp: ethers.BigNumber.from(Math.floor(Date.now() / 1000))
        },
        {
          propertyId: ethers.BigNumber.from("2"),
          fractions: ethers.BigNumber.from("3"),
          investmentAmount: ethers.BigNumber.from(ethers.utils.parseEther("0.3")),
          timestamp: ethers.BigNumber.from(Math.floor(Date.now() / 1000) - 86400)
        }
      ];
    }

    try {
      return await this.contract.getUserInvestments(userAddress);
    } catch (error) {
      console.error('Error fetching user investments:', error);
      // Return empty array instead of throwing for better UX
      return [];
    }
  }

  async isWalletVerified(address: string): Promise<boolean> {
    if (!this.isContractAvailable && USE_MOCK_RESPONSES) {
      // Always return true for mock mode
      return true;
    }

    try {
      return await this.contract.verifiedWallets(address);
    } catch (error) {
      console.error('Error checking wallet verification:', error);
      return false;
    }
  }
}
