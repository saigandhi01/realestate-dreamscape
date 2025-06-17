
import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { WalletBalanceService } from '@/utils/contracts/WalletBalanceService';
import { RealEstateContractService } from '@/utils/contracts/RealEstateContract';

interface SmartContractWalletResult {
  balanceService: WalletBalanceService | null;
  contractService: RealEstateContractService | null;
  ethBalance: string;
  investments: any[];
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  purchaseProperty: (propertyId: number, fractionAmount: number, totalCost: string) => Promise<ethers.ContractTransaction>;
}

export const useSmartContractWallet = (
  provider: ethers.providers.Web3Provider | null,
  address: string | null,
  walletType: string | null
): SmartContractWalletResult => {
  const [balanceService, setBalanceService] = useState<WalletBalanceService | null>(null);
  const [contractService, setContractService] = useState<RealEstateContractService | null>(null);
  const [ethBalance, setEthBalance] = useState<string>('0.0000');
  const [investments, setInvestments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize services when provider changes
  useEffect(() => {
    if (provider) {
      try {
        const balanceServ = new WalletBalanceService(provider);
        const contractServ = new RealEstateContractService(provider);
        
        setBalanceService(balanceServ);
        setContractService(contractServ);
        setError(null);
      } catch (err: any) {
        setError(`Failed to initialize services: ${err.message}`);
        console.error('Service initialization error:', err);
      }
    } else {
      setBalanceService(null);
      setContractService(null);
    }
  }, [provider]);

  // Connect wallet to smart contract
  useEffect(() => {
    const connectToContract = async () => {
      if (contractService && address && walletType && provider) {
        try {
          console.log(`Connecting ${walletType} wallet to smart contract...`);
          await contractService.connectWallet(walletType);
          console.log('Wallet connected to smart contract successfully');
        } catch (error) {
          console.error('Failed to connect wallet to smart contract:', error);
          // Don't set this as a critical error since the wallet might already be connected
        }
      }
    };

    connectToContract();
  }, [contractService, address, walletType, provider]);

  const refreshData = useCallback(async () => {
    if (!balanceService || !contractService || !address) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Refreshing wallet data from smart contract...');
      
      // Fetch ETH balance
      const balance = await balanceService.getETHBalance(address);
      setEthBalance(balance);
      console.log(`ETH Balance: ${balance}`);

      // Fetch user investments from smart contract
      const userInvestments = await contractService.getUserInvestments(address);
      setInvestments(userInvestments);
      console.log('User investments:', userInvestments);

    } catch (err: any) {
      setError(`Failed to fetch wallet data: ${err.message}`);
      console.error('Data refresh error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [balanceService, contractService, address]);

  // Auto-refresh data when services are ready
  useEffect(() => {
    if (balanceService && contractService && address) {
      refreshData();
    }
  }, [balanceService, contractService, address, refreshData]);

  const purchaseProperty = useCallback(async (
    propertyId: number,
    fractionAmount: number,
    totalCost: string
  ): Promise<ethers.ContractTransaction> => {
    if (!contractService) {
      throw new Error('Contract service not initialized');
    }

    setIsLoading(true);
    try {
      console.log(`Purchasing ${fractionAmount} fractions of property ${propertyId} for ${totalCost} ETH`);
      
      const tx = await contractService.purchasePropertyFractions(
        propertyId,
        fractionAmount,
        totalCost
      );
      
      console.log(`Purchase transaction hash: ${tx.hash}`);
      
      // Refresh data after successful purchase
      await refreshData();
      
      return tx;
    } catch (error) {
      console.error('Property purchase failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [contractService, refreshData]);

  return {
    balanceService,
    contractService,
    ethBalance,
    investments,
    isLoading,
    error,
    refreshData,
    purchaseProperty
  };
};
