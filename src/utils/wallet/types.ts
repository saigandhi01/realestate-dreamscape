
import { ethers } from "ethers";

export type WalletType = 'metamask' | 'coinbase' | 'trustwallet' | 'phantom' | null;

export type WalletState = {
  address: string | null;
  connected: boolean;
  chainId: number | null;
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  balance: string | null;
  networkName: string | null;
  walletType: WalletType;
};

export const initialWalletState: WalletState = {
  address: null,
  connected: false,
  chainId: null,
  provider: null,
  signer: null,
  balance: null,
  networkName: null,
  walletType: null,
};
