export type UnipilotVaultFetcherResponse = {
  vaults: {
    id: string;
    feeTier: string;
    token0: {
      id: string;
      symbol: string;
    };
    token1: {
      id: string;
      symbol: string;
    };
    strategyId?: string;
    totalLockedToken0: string;
    totalLockedToken1: string;
    fee0Uninvested: string;
    fee1Uninvested: string;
    fee0invested: string;
    fee1invested: string;
  }[];
};

export type VaultAddressesResponse = {
  vaults: {
    id: string;
  }[];
};

export type UnipilotVaultDefinition = {
  address: string;
  token0Address: string;
  token1Address: string;
  feeTier: string;
  token0Symbol: string;
  token1Symbol: string;
  strategyId?: string;
  totalLockedToken0: string;
  totalLockedToken1: string;
};

export type FeeAPR = {
  statsOnSpot: string;
  stats: string;
  stats7d: string;
};

export type ResponseAPRData = {
  [key: string]: FeeAPR;
};
