import { Inject } from '@nestjs/common';

import { APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { AppToolkit } from '~app-toolkit/app-toolkit.service';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';

import { GainsNetworkContractFactory, GainsNetworkStaking } from '../contracts';

const FARMS = [
  {
    address: '0xfb06a737f549eb2512eb6082a808fc7f16c0819d',
    stakedTokenAddress: '0xe5417af564e4bfda1c483642db72007871397896',
    rewardTokenAddresses: ['0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'],
  },
];

@PositionTemplate()
export class PolygonGainsNetworkStakingContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<GainsNetworkStaking> {
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

  async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
    return FARMS;
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
