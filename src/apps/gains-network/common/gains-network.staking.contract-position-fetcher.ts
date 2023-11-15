import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';

import { GainsNetworkViemContractFactory } from '../contracts';
import { GainsNetworkStaking } from '../contracts/viem';

export abstract class GainsNetworkStakingContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<GainsNetworkStaking> {
  groupLabel = 'Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(GainsNetworkViemContractFactory) protected readonly contractFactory: GainsNetworkViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.gainsNetworkStaking({ address, network: this.network });
  }

  getRewardRates({ contract }: GetDataPropsParams<GainsNetworkStaking, SingleStakingFarmDataProps>) {
    return contract.read.accDaiPerToken();
  }

  getIsActive({ contract }: GetDataPropsParams<GainsNetworkStaking, SingleStakingFarmDataProps>) {
    return contract.read.accDaiPerToken().then(rate => rate > 0);
  }

  async getStakedTokenBalance({
    address,
    contract,
  }: GetTokenBalancesParams<GainsNetworkStaking, SingleStakingFarmDataProps>) {
    return (await contract.read.users([address]))[0];
  }

  async getRewardTokenBalances({
    address,
    contract,
  }: GetTokenBalancesParams<GainsNetworkStaking, SingleStakingFarmDataProps>) {
    const [userPosition, rate] = await Promise.all([contract.read.users([address]), contract.read.accDaiPerToken()]);
    const rewardBalance =
      ((Number(userPosition[0]) + Number(userPosition[3])) * Number(rate)) / 1e18 - Number(userPosition[1]);
    return rewardBalance;
  }
}
