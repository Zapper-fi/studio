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
