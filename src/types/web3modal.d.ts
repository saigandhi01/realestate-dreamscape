
declare module 'web3modal' {
  export default class Web3Modal {
    constructor(options: any);
    connect(): Promise<any>;
    clearCachedProvider(): Promise<void>;
    cachedProvider: string | null;
  }
}
