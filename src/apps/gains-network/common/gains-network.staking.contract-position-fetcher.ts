import { Inject } from '@nestjs/common';

import { APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { AppToolkit } from '~app-toolkit/app-toolkit.service';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';

import { GainsNetworkContractFactory, GainsNetworkStaking } from '../contracts';

export abstract class GainsNetworkStakingContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<GainsNetworkStaking> {
  groupLabel = 'Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: AppToolkit,
    @Inject(GainsNetworkContractFactory) protected readonly contractFactory: GainsNetworkContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): GainsNetworkStaking {
    return this.contractFactory.gainsNetworkStaking({ address, network: this.network });
  }

  getRewardRates({ contract }: GetDataPropsParams<GainsNetworkStaking, SingleStakingFarmDataProps>) {
    return contract.accDaiPerToken();
  }

  async getStakedTokenBalance({
    address,
    contract,
  }: GetTokenBalancesParams<GainsNetworkStaking, SingleStakingFarmDataProps>) {
    return (await contract.users(address)).stakedTokens;
  }

  async getRewardTokenBalances({
    address,
    contract,
  }: GetTokenBalancesParams<GainsNetworkStaking, SingleStakingFarmDataProps>) {
    const [userPosition, rate] = await Promise.all([contract.users(address), contract.accDaiPerToken()]);
    const rewardBalance =
      ((Number(userPosition.stakedTokens) + Number(userPosition.totalBoostTokens)) * Number(rate)) / 1e18 -
      Number(userPosition.debtDai);
    return rewardBalance;
  }
}
