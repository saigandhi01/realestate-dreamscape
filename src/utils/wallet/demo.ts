
import { WalletState } from './types';

export interface DemoToken {
  symbol: string;
  name: string;
  balance: string;
  formattedBalance: string;
  decimals: number;
  chain: string;
  logo: string;
  address: string;
}

// Demo account with predefined tokens
export const DEMO_TOKENS: DemoToken[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    balance: '10000000000',
    formattedBalance: '100.0000',
    decimals: 8,
    chain: 'Bitcoin',
    logo: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    address: 'demo-btc-address'
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    balance: '100000000000000000000',
    formattedBalance: '100.0000',
    decimals: 18,
    chain: 'Ethereum',
    logo: 'https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/13c43/eth-diamond-black.png',
    address: 'demo-eth-address'
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    balance: '100000000',
    formattedBalance: '100.0000',
    decimals: 6,
    chain: 'Ethereum',
    logo: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
    address: 'demo-usdt-address'
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    balance: '100000000',
    formattedBalance: '100.0000',
    decimals: 6,
    chain: 'Ethereum',
    logo: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
    address: 'demo-usdc-address'
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    balance: '100000000000',
    formattedBalance: '100.0000',
    decimals: 9,
    chain: 'Solana',
    logo: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
    address: 'demo-sol-address'
  }
];

export const connectDemoWallet = async (): Promise<WalletState> => {
  // Create a demo wallet state
  const demoWallet: WalletState = {
    address: 'demo-wallet-0x1234567890abcdef1234567890abcdef12345678',
    connected: true,
    chainId: 1,
    provider: null,
    signer: null,
    balance: '100.0000',
    networkName: 'Demo Network',
    walletType: 'demo'
  };

  // Store demo wallet info in localStorage
  localStorage.setItem('walletType', 'demo');
  localStorage.setItem('demoWalletAddress', demoWallet.address);
  
  return demoWallet;
};

export const getDemoTokenBalances = (): DemoToken[] => {
  // Get stored balances or return default
  const storedBalances = localStorage.getItem('demoTokenBalances');
  if (storedBalances) {
    return JSON.parse(storedBalances);
  }
  return DEMO_TOKENS;
};

export const updateDemoTokenBalance = (symbol: string, newBalance: string) => {
  const tokens = getDemoTokenBalances();
  const tokenIndex = tokens.findIndex(token => token.symbol === symbol);
  
  if (tokenIndex !== -1) {
    tokens[tokenIndex].formattedBalance = newBalance;
    tokens[tokenIndex].balance = (parseFloat(newBalance) * Math.pow(10, tokens[tokenIndex].decimals)).toString();
    localStorage.setItem('demoTokenBalances', JSON.stringify(tokens));
  }
};
