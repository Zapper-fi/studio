export interface SingleProtocol {
  wmasterchefs: WMasterChefsEntity[];
  vaults: VaultsEntity[];
  pools: PoolsEntity[];
}
export interface WMasterChefsEntity {
  name: string;
  masterChef: string;
  wMasterChef: string;
  craftsmanV1?: string | null;
}
export interface VaultsEntity {
  name: string;
  decimals: number;
  address: string;
  token: string;
  sinceBlock?: number | null;
}
export interface PoolsEntity {
  name: string;
  address: string;
  type: string;
  isLP: boolean;
  tokenContract: string;
  sinceBlock?: number | null;
}
export type SingleLYFContractPositionDataProps = {
  totalValueLocked: number;
};

export enum DexCode {
  VVS = 'vvs',
  MMF = 'mmf',
}

type TokenInfo = {
  name: string;
  symbol: string;
  decimals: number;
};

type ReinvestType = 'autoCompound' | 'manualHarvest' | 'multiYield';

export type SingleFarmApi = {
  id: string;
  name: string;
  lpToken: TokenInfo;
  token0: TokenInfo;
  token1: TokenInfo;
  dex: DexCode;
  worker: string;
  masterchefPoolId: number;
  maxLeverage: number;
  maxContractLeverage: number;
  liquidationThresholdPercent: number;
  lyfTVL: string;
  sevenDayTotalVolumeUsd: number;
  sevenDayAvgVolumeUsd: number;
  dexTxFee: number;
  borrowableTokens: TokenInfo[];
  avail: boolean;
  reinvestType: ReinvestType;
  multiYieldTokens: TokenInfo[];
};

export interface SinglePositionApi {
  posId: string;
  stoplossAt: string | null;
  liquidatedAt: string | null;
  isStrategy: boolean;
  isLongShort: boolean;
  strategyId?: string;
  openAt: string;
  closedAt: string;
  stopLossRatio: number;
  initialFiatValue: string;
  finalFiatValue: string;

  initialLpAmount: string;

  token0: {
    id: string;
  };

  token1: {
    id: string;
  };

  token0Amount: string;
  token1Amount: string;

  token0UserAmount: string;
  token1UserAmount: string;

  token0InitialDebt: string;
  token1InitialDebt: string;

  token0InitialPrice: string;
  token1InitialPrice: string;

  token0FinalAmount: string;
  token1FinalAmount: string;
  token0FinalPositionAmt: string;
  token1FinalPositionAmt: string;

  token0FinalPrice: string;
  token1FinalPrice: string;

  debt: Record<string, string>;

  closePosTxHash: null | string;
  finalPositionValue: null | string;
  lpToken: TokenInfo;
  lpAddress: string;

  collId: string;
  collateralSize: string;
  harvestedReward: string;

  worker: string;
  wmasterchef: string;
}
