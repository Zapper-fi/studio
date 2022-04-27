import { Inject, Injectable } from '@nestjs/common';

import { ContractPositionBalanceHelper } from './helpers/balance/contract-position-balance.helper';
import { SingleStakingContractPositionBalanceHelper } from './helpers/balance/single-staking-farm.contract-position-balance-helper';
import { TokenBalanceHelper } from './helpers/balance/token-balance.helper';
import { MasterChefContractPositionBalanceHelper } from './helpers/master-chef/master-chef.contract-position-balance-helper';
import { MasterChefContractPositionHelper } from './helpers/master-chef/master-chef.contract-position-helper';
import { MasterChefDefaultClaimableBalanceStrategy } from './helpers/master-chef/master-chef.default.claimable-token-balances-strategy';
import { MasterChefDefaultRewardRateStrategy } from './helpers/master-chef/master-chef.default.reward-token-reward-rate-strategy';
import { MasterChefDefaultStakedBalanceStrategy } from './helpers/master-chef/master-chef.default.staked-token-balance-strategy';
import { MasterChefV2ClaimableBalanceStrategy } from './helpers/master-chef/master-chef.v2.claimable-token-balance-strategy';
import { MasterChefV2ClaimableTokenStrategy } from './helpers/master-chef/master-chef.v2.claimable-token-strategy';
import { MasterChefV2RewardRateStrategy } from './helpers/master-chef/master-chef.v2.reward-rate-strategy';
import { SingleStakingFarmContractPositionHelper } from './helpers/position/single-staking-farm.contract-position-helper';
import { SingleVaultTokenHelper } from './helpers/position/single-vault.token-helper';
import { TheGraphHelper } from './helpers/the-graph/the-graph.helper';

export const AppToolkitHelpers = [
  TokenBalanceHelper,
  ContractPositionBalanceHelper,
  TheGraphHelper,
  SingleStakingContractPositionBalanceHelper,
  SingleStakingFarmContractPositionHelper,
  SingleVaultTokenHelper,
  MasterChefContractPositionBalanceHelper,
  MasterChefContractPositionHelper,
  MasterChefDefaultClaimableBalanceStrategy,
  MasterChefDefaultRewardRateStrategy,
  MasterChefDefaultStakedBalanceStrategy,
  MasterChefV2ClaimableBalanceStrategy,
  MasterChefV2ClaimableTokenStrategy,
  MasterChefV2RewardRateStrategy,
];

@Injectable()
export class AppToolkitHelperRegistry {
  constructor(
    @Inject(TokenBalanceHelper) public readonly tokenBalanceHelper: TokenBalanceHelper,
    @Inject(ContractPositionBalanceHelper) public readonly contractPositionBalanceHelper: ContractPositionBalanceHelper,
    @Inject(TheGraphHelper) public readonly theGraphHelper: TheGraphHelper,
    @Inject(SingleStakingContractPositionBalanceHelper)
    public readonly singleStakingContractPositionBalanceHelper: SingleStakingContractPositionBalanceHelper,
    @Inject(SingleStakingFarmContractPositionHelper)
    public readonly singleStakingFarmContractPositionHelper: SingleStakingFarmContractPositionHelper,
    @Inject(SingleVaultTokenHelper)
    public readonly singleVaultTokenHelper: SingleVaultTokenHelper,
    @Inject(MasterChefContractPositionBalanceHelper)
    public readonly masterChefContractPositionBalanceHelper: MasterChefContractPositionBalanceHelper,
    @Inject(MasterChefContractPositionHelper)
    public readonly masterChefContractPositionHelper: MasterChefContractPositionHelper,
    @Inject(MasterChefDefaultClaimableBalanceStrategy)
    public readonly masterChefDefaultClaimableBalanceStrategy: MasterChefDefaultClaimableBalanceStrategy,
    @Inject(MasterChefDefaultRewardRateStrategy)
    public readonly masterChefDefaultRewardsPerBlockStrategy: MasterChefDefaultRewardRateStrategy,
    @Inject(MasterChefDefaultStakedBalanceStrategy)
    public readonly masterChefDefaultStakedBalanceStrategy: MasterChefDefaultStakedBalanceStrategy,
    @Inject(MasterChefV2ClaimableBalanceStrategy)
    public readonly masterChefV2ClaimableBalanceStrategy: MasterChefV2ClaimableBalanceStrategy,
    @Inject(MasterChefV2ClaimableTokenStrategy)
    public readonly masterChefV2ClaimableTokenStrategy: MasterChefV2ClaimableTokenStrategy,
    @Inject(MasterChefV2RewardRateStrategy)
    public readonly masterChefV2RewardRateStrategy: MasterChefV2RewardRateStrategy,
  ) {}
}
