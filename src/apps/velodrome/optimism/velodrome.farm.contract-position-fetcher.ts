import { Inject } from '@nestjs/common';
import { range } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { isClaimable } from '~position/position.utils';
import {
  GetTokenDefinitionsParams,
  GetDataPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmDynamicTemplateContractPositionFetcher,
} from '~position/template/single-staking.dynamic.template.contract-position-fetcher';

import { VelodromeDefinitionsResolver } from '../common/velodrome.definitions-resolver';
import { VelodromeContractFactory, VelodromeGauge } from '../contracts';

@PositionTemplate()
export class OptimismVelodromeStakingContractPositionFetcher extends SingleStakingFarmDynamicTemplateContractPositionFetcher<VelodromeGauge> {
  groupLabel = 'Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(VelodromeContractFactory) protected readonly contractFactory: VelodromeContractFactory,
    @Inject(VelodromeDefinitionsResolver) protected readonly definitionsResolver: VelodromeDefinitionsResolver,
  ) {
    super(appToolkit);
  }

  getContract(address: string): VelodromeGauge {
    return this.contractFactory.velodromeGauge({ address, network: this.network });
  }

  async getFarmAddresses() {
    return this.definitionsResolver.getFarmAddresses();
  }

  async getStakedTokenAddress({ contract }: GetTokenDefinitionsParams<VelodromeGauge>) {
    return contract.stake();
  }

  async getRewardTokenAddresses({ contract }: GetTokenDefinitionsParams<VelodromeGauge>) {
    const numRewards = Number(await contract.rewardsListLength());
    return Promise.all(range(numRewards).map(async n => await contract.rewards(n)));
  }

  // @TODO: Find rewards rates which matches the APY returned from their API
  getRewardRates({ contractPosition }: GetDataPropsParams<VelodromeGauge, SingleStakingFarmDataProps>) {
    const rewardTokens = contractPosition.tokens.filter(isClaimable);
    return Promise.all(rewardTokens.map(_rt => 0));
  }

  async getStakedTokenBalance({
    address,
    contract,
  }: GetTokenBalancesParams<VelodromeGauge, SingleStakingFarmDataProps>) {
    return contract.balanceOf(address);
  }

  getRewardTokenBalances({
    address,
    contract,
    contractPosition,
  }: GetTokenBalancesParams<VelodromeGauge, SingleStakingFarmDataProps>) {
    const rewardTokens = contractPosition.tokens.filter(isClaimable);
    return Promise.all(rewardTokens.map(rt => contract.earned(rt.address, address)));
  }
}
