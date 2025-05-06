
declare module 'ethers' {
  export namespace ethers {
    export class Contract {
      constructor(address: string, abi: any, signerOrProvider: any);
      // Add common contract methods
      connect(signerOrProvider: any): Contract;
      // Add ERC20 & ERC721 methods
      name(): Promise<string>;
      symbol(): Promise<string>;
      decimals(): Promise<number>;
      balanceOf(address: string): Promise<any>;
      tokenOfOwnerByIndex(owner: string, index: number): Promise<any>;
      tokenURI(tokenId: number): Promise<string>;
      // Add property-specific methods
      propertyDetails(tokenId: number): Promise<{
        name: string;
        location: string;
        price: any;
        area: any;
      }>;
    }
    
    export namespace providers {
      export class Provider {
        getNetwork(): Promise<{ chainId: number; name: string }>;
        getBalance(address: string): Promise<any>;
      }
      
      export class Web3Provider extends Provider {
        constructor(provider: any);
        getSigner(): Signer;
      }
    }
    
    export namespace utils {
      export function formatEther(value: any): string;
      export function formatUnits(value: any, unitName?: string | number): string;
    }
    
    export class BigNumber {
      static from(value: any): BigNumber;
      toString(): string;
      isZero(): boolean;
      eq(other: BigNumber | number): boolean;
    }
    
    export class Signer {
      getAddress(): Promise<string>;
    }
  }
}
