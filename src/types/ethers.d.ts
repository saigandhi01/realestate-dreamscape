
declare module 'ethers' {
  export namespace ethers {
    export class Contract {
      constructor(address: string, abi: any, signerOrProvider: any);
      // Add common contract methods
      connect(signerOrProvider: any): Contract;
      // Add property-specific methods
      propertyDetails(tokenId: number): Promise<{
        name: string;
        location: string;
        price: any;
        area: any;
      }>;
      tokenURI(tokenId: number): Promise<string>;
    }
    
    export namespace providers {
      export class Web3Provider {
        constructor(provider: any);
        getNetwork(): Promise<{ chainId: number; name: string }>;
        getBalance(address: string): Promise<any>;
        getSigner(): Signer;
      }
    }
    
    export namespace utils {
      export function formatEther(value: any): string;
    }
    
    export class BigNumber {
      static from(value: any): BigNumber;
      toString(): string;
    }
    
    export class Signer {
      getAddress(): Promise<string>;
    }
  }
}
