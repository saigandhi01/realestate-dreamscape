
declare module 'ethers' {
  export namespace ethers {
    export class Contract {
      constructor(address: string, abi: any, signerOrProvider: any);
      connect(signerOrProvider: any): Contract;
      
      // Contract method calls return promises
      [key: string]: (...args: any[]) => Promise<any>;
      
      // Common contract methods
      name(): Promise<string>;
      symbol(): Promise<string>;
      decimals(): Promise<number>;
      balanceOf(address: string): Promise<any>;
      tokenOfOwnerByIndex(owner: string, index: number): Promise<any>;
      tokenURI(tokenId: number): Promise<string>;
      
      // Smart contract specific methods
      connectWallet(walletType: string): Promise<ContractTransaction>;
      purchaseFractions(propertyId: number, fractionAmount: number, options?: any): Promise<ContractTransaction>;
      getPropertyDetails(propertyId: number): Promise<any>;
      getUserInvestments(address: string): Promise<any>;
      verifiedWallets(address: string): Promise<boolean>;
      properties(propertyId: number): Promise<any>;
    }
    
    export interface ContractTransaction {
      hash: string;
      wait(): Promise<ContractReceipt>;
      from: string;
      to: string;
      value: BigNumber;
      data: string;
      gasLimit: BigNumber;
      gasPrice: BigNumber;
      nonce: number;
    }
    
    export interface ContractReceipt {
      blockHash: string;
      blockNumber: number;
      transactionHash: string;
      transactionIndex: number;
      from: string;
      to: string;
      gasUsed: BigNumber;
      status?: number;
    }
    
    export namespace providers {
      export class Provider {
        getNetwork(): Promise<{ chainId: number; name: string }>;
        getBalance(address: string): Promise<any>;
        getCode(address: string): Promise<string>;
      }
      
      export class Web3Provider extends Provider {
        constructor(provider: any);
        getSigner(): Signer;
        getCode(address: string): Promise<string>;
      }
    }
    
    export namespace utils {
      export function formatEther(value: any): string;
      export function formatUnits(value: any, unitName?: string | number): string;
      export function parseEther(value: string): BigNumber;
      export function parseUnits(value: string, unitName?: string | number): BigNumber;
    }
    
    export class BigNumber {
      static from(value: any): BigNumber;
      toString(): string;
      isZero(): boolean;
      eq(other: BigNumber | number): boolean;
      toNumber(): number;
    }
    
    export class Signer {
      getAddress(): Promise<string>;
      provider?: Provider;
    }
  }
}
