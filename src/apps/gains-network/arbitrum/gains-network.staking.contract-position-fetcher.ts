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
    address: '0x6b8d3c08072a020ac065c467ce922e3a36d3f9d6',
    stakedTokenAddress: '0x18c11fd286c5ec11c3b683caa813b77f5163a122',
    rewardTokenAddresses: ['0xda10009cbd5d07dd0cecc66161fc93d7c9000da1'],
  },
];

@PositionTemplate()
export class ArbitrumGainsNetworkStakingContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<GainsNetworkStaking> {
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
