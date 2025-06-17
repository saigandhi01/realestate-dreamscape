
import { ethers } from "ethers";
import { REAL_ESTATE_CONTRACT_ABI, REAL_ESTATE_CONTRACT_ADDRESS } from './RealEstateContract';

export class WalletBalanceService {
  private provider: ethers.providers.Web3Provider;
  private signer: ethers.Signer;

  constructor(provider: ethers.providers.Web3Provider) {
    this.provider = provider;
    this.signer = provider.getSigner();
  }

  async getETHBalance(address: string): Promise<string> {
    try {
      const balance = await this.provider.getBalance(address);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error('Error fetching ETH balance:', error);
      return '0.0000';
    }
  }

  async getTokenBalance(tokenAddress: string, userAddress: string): Promise<string> {
    try {
      const tokenABI = [
        "function balanceOf(address owner) view returns (uint256)",
        "function decimals() view returns (uint8)",
        "function symbol() view returns (string)"
      ];
      
      const tokenContract = new ethers.Contract(tokenAddress, tokenABI, this.provider);
      const balance = await tokenContract.balanceOf(userAddress);
      const decimals = await tokenContract.decimals();
      
      return ethers.utils.formatUnits(balance, decimals);
    } catch (error) {
      console.error(`Error fetching token balance for ${tokenAddress}:`, error);
      return '0.0000';
    }
  }

  async getUserInvestments(userAddress: string): Promise<any[]> {
    try {
      // Check if contract exists first
      const code = await this.provider.getCode(REAL_ESTATE_CONTRACT_ADDRESS);
      if (code === "0x") {
        console.warn('Smart contract not deployed, returning empty investments');
        return [];
      }

      const contract = new ethers.Contract(
        REAL_ESTATE_CONTRACT_ADDRESS,
        REAL_ESTATE_CONTRACT_ABI,
        this.provider
      );
      
      const investments = await contract.getUserInvestments(userAddress);
      return investments;
    } catch (error) {
      console.error('Error fetching user investments:', error);
      return [];
    }
  }

  async getPropertyDetails(propertyId: number): Promise<any> {
    try {
      // Check if contract exists first
      const code = await this.provider.getCode(REAL_ESTATE_CONTRACT_ADDRESS);
      if (code === "0x") {
        console.warn('Smart contract not deployed, returning null for property details');
        return null;
      }

      const contract = new ethers.Contract(
        REAL_ESTATE_CONTRACT_ADDRESS,
        REAL_ESTATE_CONTRACT_ABI,
        this.provider
      );
      
      const details = await contract.getPropertyDetails(propertyId);
      return {
        name: details[0],
        location: details[1],
        price: details[2],
        area: details[3],
        fractions: details[4],
        fractionsLeft: details[5],
        pricePerFraction: details[6],
        isListed: details[7]
      };
    } catch (error) {
      console.error(`Error fetching property details for ID ${propertyId}:`, error);
      return null;
    }
  }
}
