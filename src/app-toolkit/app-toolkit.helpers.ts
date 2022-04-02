import { Inject, Injectable } from '@nestjs/common';

import { SingleStakingContractPositionBalanceHelper } from './helpers/balance/single-staking-farm.contract-position-balance-helper';
import { TokenBalanceHelper } from './helpers/balance/token-balance.helper';
import { SingleStakingFarmContractPositionHelper } from './helpers/position/single-staking-farm.contract-position-helper';
import { SingleVaultTokenHelper } from './helpers/position/single-vault.token-helper';
import { TheGraphHelper } from './helpers/the-graph/the-graph.helper';

export const AppToolkitHelpers = [
  TokenBalanceHelper,
  TheGraphHelper,
  SingleStakingContractPositionBalanceHelper,
  SingleStakingFarmContractPositionHelper,
  SingleVaultTokenHelper,
];

@Injectable()
export class AppToolkitHelperRegistry {
  constructor(
    @Inject(TokenBalanceHelper) public readonly tokenBalanceHelper: TokenBalanceHelper,
    @Inject(TheGraphHelper) public readonly theGraphHelper: TheGraphHelper,
    @Inject(SingleStakingContractPositionBalanceHelper)
    public readonly singleStakingContractPositionBalanceHelper: SingleStakingContractPositionBalanceHelper,
    @Inject(SingleStakingFarmContractPositionHelper)
    public readonly singleStakingFarmContractPositionHelper: SingleStakingFarmContractPositionHelper,
    @Inject(SingleVaultTokenHelper)
    public readonly singleVaultTokenHelper: SingleVaultTokenHelper,
  ) {}
}
