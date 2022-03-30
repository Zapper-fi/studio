import { Network } from '~types/network.interface';

export enum ProtocolAction {
  VIEW = 'view',
  STAKE = 'stake',
  TRANSACT = 'transact',
}

export enum AddressFormat {
  EVM = 'evm',
  BITCOIN = 'bitcoin',
}

export enum ProtocolTag {
  ASSET_BUNDLES = 'asset-bundles',
  ASSET_INDEXES = 'asset-indexes',
  ASSET_MANAGEMENT = 'asset-management',
  DERIVATIVES = 'derivatives',
  ELASTIC_FINANCE = 'elastic-finance',
  EXCHANGE = 'exchange',
  FUND_MANAGER = 'fund-manager',
  GAMING = 'gaming',
  INFRASTRUCTURE = 'infrastructure',
  INSURANCE = 'insurance',
  LENDING = 'lending',
  LIQUIDITY_POOL = 'liquidity-pool',
  MARGIN_TRADING = 'margin-trading',
  NO_LOSS_LOTTERY = 'no-loss-lottery',
  OPTIONS = 'options',
  PAYROLL = 'payroll',
  PERPETUALS_EXCHANGE = 'perpetuals-exchange',
  REAL_ESTATE = 'real-estate',
  SEIGNIORAGE = 'seigniorage',
  STABLECOIN = 'stablecoin',
  TOKENIZED_RISK_PROTOCOL = 'tokenized-risk-protocol',
  YIELD_AGGREGATOR = 'yield-aggregator',
}

export enum GroupType {
  TOKEN = 'token',
  POSITION = 'position',
}

export type AppGroup = {
  id: string;
  type: GroupType;
};

export type AppDefinitionObject = {
  id: string;
  name: string;
  tags: ProtocolTag[];
  description: string;
  groups: Record<string, AppGroup>;
  supportedNetworks: { [N in Network]?: ProtocolAction[] };
  primaryColor: string;
  url: string;
  compatibleAddressFormat?: { [N in Network]?: AddressFormat };
  token?: {
    address: string;
    network: Network;
  };
};
