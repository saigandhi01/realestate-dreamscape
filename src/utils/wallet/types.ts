
export type WalletType = 'metamask' | 'coinbase' | 'trust' | 'phantom' | 'demo';

export interface WalletState {
  address?: string;
  connected: boolean;
  chainId?: number;
  provider?: any;
  signer?: any;
  balance?: string;
  networkName?: string;
  walletType?: WalletType;
}

export const initialWalletState: WalletState = {
  connected: false,
  chainId: 1,
  provider: null,
  signer: null,
  balance: '0',
  networkName: 'Ethereum',
  walletType: undefined
};
