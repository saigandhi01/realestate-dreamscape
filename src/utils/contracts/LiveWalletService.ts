
import { ethers } from 'ethers';

export class LiveWalletService {
  private provider: ethers.providers.Web3Provider | null;

  constructor(provider?: ethers.providers.Web3Provider) {
    this.provider = provider || null;
  }

  async getETHBalance(address: string): Promise<string> {
    if (!this.provider) {
      throw new Error('No ETH provider available');
    }

    try {
      const balance = await this.provider.getBalance(address);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error('Error fetching ETH balance:', error);
      throw new Error(`Failed to fetch ETH balance: ${error.message}`);
    }
  }

  async getSOLBalance(address: string): Promise<string> {
    try {
      // Use Solana mainnet RPC endpoint
      const response = await fetch('https://api.mainnet-beta.solana.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getBalance',
          params: [address]
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      // Convert lamports to SOL (1 SOL = 1,000,000,000 lamports)
      const lamports = data.result.value;
      const solBalance = lamports / 1000000000;
      
      return solBalance.toString();
    } catch (error) {
      console.error('Error fetching SOL balance:', error);
      throw new Error(`Failed to fetch SOL balance: ${error.message}`);
    }
  }

  async getTokenBalance(tokenAddress: string, userAddress: string): Promise<string> {
    if (!this.provider) {
      throw new Error('No provider available for token balance');
    }

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
      throw new Error(`Failed to fetch token balance: ${error.message}`);
    }
  }

  async getWalletInfo(address: string, walletType: string, provider?: ethers.providers.Web3Provider) {
    const result = {
      address,
      walletType,
      balance: '0.0000',
      networkName: 'Unknown',
      chainId: 0
    };

    try {
      if (walletType === 'phantom') {
        result.balance = await this.getSOLBalance(address);
        result.networkName = 'Solana';
        result.chainId = 0;
      } else if (provider) {
        result.balance = await this.getETHBalance(address);
        const network = await provider.getNetwork();
        result.networkName = this.getNetworkName(network.chainId);
        result.chainId = network.chainId;
      }
    } catch (error) {
      console.error('Error getting wallet info:', error);
      // Return basic info even if balance fetch fails
    }

    return result;
  }

  private getNetworkName(chainId: number): string {
    switch (chainId) {
      case 1:
        return 'Ethereum Mainnet';
      case 3:
        return 'Ropsten';
      case 4:
        return 'Rinkeby';
      case 5:
        return 'Goerli';
      case 42:
        return 'Kovan';
      case 56:
        return 'BSC Mainnet';
      case 97:
        return 'BSC Testnet';
      case 137:
        return 'Polygon Mainnet';
      case 80001:
        return 'Polygon Mumbai';
      default:
        return 'Unknown Network';
    }
  }
}
