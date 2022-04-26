import { Inject, Injectable } from '@nestjs/common';

import { ContractPositionBalanceHelper } from './helpers/balance/contract-position-balance.helper';
import { SingleStakingContractPositionBalanceHelper } from './helpers/balance/single-staking-farm.contract-position-balance-helper';
import { TokenBalanceHelper } from './helpers/balance/token-balance.helper';
import { MasterChefContractPositionBalanceHelper } from './helpers/master-chef/master-chef.contract-position-balance-helper';
import { MasterChefContractPositionHelper } from './helpers/master-chef/master-chef.contract-position-helper';
import { MasterChefDefaultClaimableBalanceStrategy } from './helpers/master-chef/master-chef.default.claimable-token-balances-strategy';
import { MasterChefDefaultRewardRateStrategy } from './helpers/master-chef/master-chef.default.reward-token-reward-rate-strategy';
import { MasterChefDefaultStakedBalanceStrategy } from './helpers/master-chef/master-chef.default.staked-token-balance-strategy';
import { MasterChefRewarderClaimableBalanceStrategy } from './helpers/master-chef/master-chef.rewarder.claimable-token-balances-strategy';
import { MasterChefRewarderClaimableTokenStrategy } from './helpers/master-chef/master-chef.rewarder.claimable-token-strategy';
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
  MasterChefRewarderClaimableBalanceStrategy,
  MasterChefRewarderClaimableTokenStrategy,
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
    @Inject(MasterChefRewarderClaimableBalanceStrategy)
    public readonly masterChefRewarderClaimableBalanceStrategy: MasterChefRewarderClaimableBalanceStrategy,
    @Inject(MasterChefRewarderClaimableTokenStrategy)
    public readonly masterChefRewarderClaimableTokenStrategy: MasterChefRewarderClaimableTokenStrategy,
  ) {}
}
