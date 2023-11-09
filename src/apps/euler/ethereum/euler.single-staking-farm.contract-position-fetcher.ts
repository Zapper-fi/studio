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
    @Inject(EulerViemContractFactory) protected readonly contractFactory: EulerViemContractFactory,
    @Inject(EulerApiStakingRegistry) protected readonly stakingCacheManager: EulerApiStakingRegistry,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.eulerStakingRewardsContract({ address, network: this.network });
  }

  async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
    const multicall = this.appToolkit.getViemMulticall(this.network);
    const markets = await this.stakingCacheManager.getStakingDefinitions({ network: this.network });

    return await Promise.all(
      markets.map(async market => {
        const vaultContract = this.contractFactory.eulerStakingRewardsContract({
          address: market.vaultAddress.toLowerCase(),
          network: this.network,
        });
        const [stakedTokenAddress, rewardTokenAddress] = await Promise.all([
          multicall.wrap(vaultContract).read.stakingToken(),
          multicall.wrap(vaultContract).read.rewardsToken(),
        ]);

        return {
          address: market.vaultAddress,
          stakedTokenAddress,
          rewardTokenAddresses: [rewardTokenAddress],
        };
      }),
    );
  }

  getRewardRates({ contract }: GetDataPropsParams<EulerStakingRewardsContract, SingleStakingFarmDataProps>) {
    return contract.read.rewardRate();
  }

  async getIsActive({
    contract,
  }: GetDataPropsParams<
    EulerStakingRewardsContract,
    SingleStakingFarmDataProps,
    SingleStakingFarmDefinition
  >): Promise<boolean> {
    return (await contract.read.periodFinish()).gt(Math.floor(Date.now() / 1000));
  }

  getStakedTokenBalance({
    address,
    contract,
  }: GetTokenBalancesParams<EulerStakingRewardsContract, SingleStakingFarmDataProps>) {
    return contract.read.balanceOf([address]);
  }

  getRewardTokenBalances({
    address,
    contract,
  }: GetTokenBalancesParams<EulerStakingRewardsContract, SingleStakingFarmDataProps>) {
    return contract.read.earned([address]);
  }
}
