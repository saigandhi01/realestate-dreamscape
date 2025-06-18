
import { supabase } from '@/integrations/supabase/client';
import { updateDemoTokenBalance, getDemoTokenBalances } from '@/utils/wallet/demo';

export interface DemoTransaction {
  id: string;
  propertyId: string;
  propertyName: string;
  tokenAmount: number;
  totalCost: string;
  transactionHash: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

export class DemoTransactionService {
  private static generateTxHash(): string {
    return 'demo-tx-' + Math.random().toString(36).substring(2, 15);
  }

  static async purchaseProperty(
    propertyId: string,
    propertyName: string,
    tokenAmount: number,
    totalCost: string,
    walletAddress: string
  ): Promise<{ success: boolean; transaction: DemoTransaction; error?: string }> {
    try {
      // Check if demo wallet has sufficient ETH balance
      const tokens = getDemoTokenBalances();
      const ethToken = tokens.find(token => token.symbol === 'ETH');
      
      if (!ethToken || parseFloat(ethToken.formattedBalance) < parseFloat(totalCost)) {
        return {
          success: false,
          transaction: {} as DemoTransaction,
          error: 'Insufficient ETH balance'
        };
      }

      // Create transaction record
      const transaction: DemoTransaction = {
        id: crypto.randomUUID(),
        propertyId,
        propertyName,
        tokenAmount,
        totalCost,
        transactionHash: this.generateTxHash(),
        timestamp: new Date().toISOString(),
        status: 'completed'
      };

      // Deduct ETH from demo wallet
      const newEthBalance = (parseFloat(ethToken.formattedBalance) - parseFloat(totalCost)).toFixed(4);
      updateDemoTokenBalance('ETH', newEthBalance);

      // Store transaction in localStorage for demo purposes
      const existingTransactions = JSON.parse(localStorage.getItem('demoTransactions') || '[]');
      existingTransactions.push(transaction);
      localStorage.setItem('demoTransactions', JSON.stringify(existingTransactions));

      // Store portfolio item
      const portfolioItem = {
        id: crypto.randomUUID(),
        propertyId,
        propertyName,
        tokensOwned: tokenAmount,
        ownershipPercentage: (tokenAmount / 1000) * 100, // Assuming 1000 total tokens per property
        purchaseDate: new Date().toISOString(),
        totalInvested: totalCost
      };

      const existingPortfolio = JSON.parse(localStorage.getItem('demoPortfolio') || '[]');
      
      // Check if property already exists in portfolio
      const existingIndex = existingPortfolio.findIndex((item: any) => item.propertyId === propertyId);
      if (existingIndex !== -1) {
        // Update existing portfolio item
        existingPortfolio[existingIndex].tokensOwned += tokenAmount;
        existingPortfolio[existingIndex].ownershipPercentage = (existingPortfolio[existingIndex].tokensOwned / 1000) * 100;
        existingPortfolio[existingIndex].totalInvested = (parseFloat(existingPortfolio[existingIndex].totalInvested) + parseFloat(totalCost)).toFixed(4);
      } else {
        // Add new portfolio item
        existingPortfolio.push(portfolioItem);
      }
      
      localStorage.setItem('demoPortfolio', JSON.stringify(existingPortfolio));

      return { success: true, transaction };
    } catch (error) {
      console.error('Demo transaction failed:', error);
      return {
        success: false,
        transaction: {} as DemoTransaction,
        error: 'Transaction failed'
      };
    }
  }

  static getDemoTransactions(): DemoTransaction[] {
    return JSON.parse(localStorage.getItem('demoTransactions') || '[]');
  }

  static getDemoPortfolio() {
    return JSON.parse(localStorage.getItem('demoPortfolio') || '[]');
  }
}
