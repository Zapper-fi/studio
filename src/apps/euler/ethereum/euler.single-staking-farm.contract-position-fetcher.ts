import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { EulerApiStakingRegistry } from '~apps/euler/common/euler.api.staking-registry';
import { EulerContractFactory, EulerStakingRewardsContract } from '~apps/euler/contracts';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';

@PositionTemplate()
export class EthereumEulerSingleStakingFarmContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<EulerStakingRewardsContract> {
  groupLabel = 'Farms';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(EulerContractFactory) protected readonly contractFactory: EulerContractFactory,
    @Inject(EulerApiStakingRegistry) protected readonly stakingCacheManager: EulerApiStakingRegistry,
  ) {
    super(appToolkit);
  }

  getContract(address: string): EulerStakingRewardsContract {
    return this.contractFactory.eulerStakingRewardsContract({ address, network: this.network });
  }

  getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
    return this.stakingCacheManager.getStakingDefinitions({ network: this.network }).then(markets =>
      markets.map(market => ({
        address: market.tokenAddress,
        stakedTokenAddress: market.vaultAddress,
        rewardTokenAddresses: ['0xd9fcd98c322942075a5c3860693e9f4f03aae07b'],
      })),
    );
  }

  getRewardRates({ contract }: GetDataPropsParams<EulerStakingRewardsContract, SingleStakingFarmDataProps>) {
    return contract.rewardRate();
  }

  getStakedTokenBalance({
    address,
    contract,
  }: GetTokenBalancesParams<EulerStakingRewardsContract, SingleStakingFarmDataProps>) {
    return contract.balanceOf(address);
  }

  getRewardTokenBalances({
    address,
    contract,
  }: GetTokenBalancesParams<EulerStakingRewardsContract, SingleStakingFarmDataProps>) {
    return contract.earned(address);
  }
}
