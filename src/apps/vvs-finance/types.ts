import type { MasterChefContractPositionDataProps } from '~app-toolkit/helpers/master-chef/master-chef.contract-position-helper';

export type VaultContractPositionDataProps = MasterChefContractPositionDataProps & {
  isClaimable: boolean;
  poolInfo?: {
    multiplier: number;
    lockPeriod: number;
    totalStaked: number;
  };
};
