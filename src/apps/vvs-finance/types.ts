import type { MasterChefContractPositionDataProps } from '~app-toolkit/helpers/master-chef/master-chef.contract-position-helper';

export type XvvsVaultContractPositionDataProps = MasterChefContractPositionDataProps & {
  isClaimable: boolean;
  poolInfo?: {
    multiplier: number;
    lockPeriod: number;
    totalStaked: number;
  };
};
