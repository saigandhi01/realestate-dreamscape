
declare module 'ethers' {
  export namespace ethers {
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
    export class Signer {
      getAddress(): Promise<string>;
    }
  }
}
