import { Network } from '~types/network.interface';
import { ArrayOfOneOrMore } from '~types/utils';

export enum AppAction {
  VIEW = 'view',
  STAKE = 'stake',
  TRANSACT = 'transact',
}

export enum AddressFormat {
  EVM = 'evm',
  BITCOIN = 'bitcoin',
}

export enum AppTag {
  ALGORITHMIC_STABLECOIN = 'algorithmic-stablecoin',
  ASSET_MANAGEMENT = 'asset-management',
  BONDS = 'bonds',
  BRIDGE = 'bridge',
  COLLATERALIZED_DEBT_POSITION = 'collateralized-debt-position',
  CROSS_CHAIN = 'cross-chain',
  DECENTRALIZED_EXCHANGE = 'decentralized-exchange',
  DERIVATIVES = 'derivatives',
  ELASTIC_FINANCE = 'elastic-finance',
  FARMING = 'farming',
  FUND_MANAGER = 'fund-manager',
  GAMING = 'gaming',
  INFRASTRUCTURE = 'infrastructure',
  INSURANCE = 'insurance',
  LAUNCHPAD = 'launchpad',
  LENDING = 'lending',
  LIQUIDITY_POOL = 'liquidity-pool',
  LIQUID_STAKING = 'liquid-staking',
  LOTTERY = 'lottery',
  MARGIN_TRADING = 'margin-trading',
  NFT_LENDING = 'nft-lending',
  NFT_MARKETPLACE = 'nft-marketplace',
  OPTIONS = 'options',
  PAYMENTS = 'payments',
  PERPETUALS_EXCHANGE = 'perpetuals-exchange',
  PREDICTION_MARKET = 'prediction-market',
  PRIVACY = 'privacy',
  REAL_ESTATE = 'real-estate',
  RESERVE_CURRENCY = 'reserve-currency',
  STABLECOIN = 'stablecoin',
  STAKING = 'staking',
  SYNTHETICS = 'synthetics',
  TOKENIZED_RISK = 'tokenized-risk',
  YIELD_AGGREGATOR = 'yield-aggregator',
}

export enum GroupType {
  TOKEN = 'token',
  POSITION = 'contract-position',
}

export type AppGroup = {
  id: string;
  type: GroupType;
};

export type AppLinks = {
  learn?: string;
  github?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
  medium?: string;
};

export type AppDefinitionObject = {
  id: string;
  name: string;
  tags: ArrayOfOneOrMore<AppTag>;
  keywords?: string[];
  description: string;
  groups: Record<string, AppGroup>;
  supportedNetworks: { [N in Network]?: AppAction[] };
  primaryColor?: string;
  url: string;
  links: AppLinks;
  compatibleAddressFormat?: { [N in Network]?: AddressFormat };
  token?: {
    address: string;
    network: Network;
  };
};
