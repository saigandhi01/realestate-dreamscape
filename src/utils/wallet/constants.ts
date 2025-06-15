
import Web3Modal from "web3modal";

export let web3Modal: Web3Modal;
if (typeof window !== 'undefined') {
  web3Modal = new Web3Modal({
    network: "mainnet",
    cacheProvider: true,
    providerOptions: {
      // Add provider options here when implementing specific wallet integrations
    },
  });
}

export const networkNames: Record<number, string> = {
  1: 'Ethereum Mainnet',
  3: 'Ropsten',
  4: 'Rinkeby',
  5: 'Goerli',
  42: 'Kovan',
  56: 'Binance Smart Chain',
  137: 'Polygon',
  43114: 'Avalanche'
};
