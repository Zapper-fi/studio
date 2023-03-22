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

import { RamsesDefinitionsResolver } from '../common/ramses.definitions-resolver';
import { RamsesContractFactory, RamsesGauge } from '../contracts';

@PositionTemplate()
export class ArbitrumRamsesStakingContractPositionFetcher extends SingleStakingFarmDynamicTemplateContractPositionFetcher<RamsesGauge> {
  groupLabel = 'Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(RamsesContractFactory) protected readonly contractFactory: RamsesContractFactory,
    @Inject(RamsesDefinitionsResolver) protected readonly definitionsResolver: RamsesDefinitionsResolver,
  ) {
    super(appToolkit);
  }

  getContract(address: string): RamsesGauge {
    return this.contractFactory.ramsesGauge({ address, network: this.network });
  }

  async getFarmAddresses() {
    return this.definitionsResolver.getFarmAddresses();
  }

  async getStakedTokenAddress({ contract }: GetTokenDefinitionsParams<RamsesGauge>) {
    return contract.stake();
  }

  async getRewardTokenAddresses({ contract }: GetTokenDefinitionsParams<RamsesGauge>) {
    const numRewards = Number(await contract.rewardsListLength());
    return Promise.all(range(numRewards).map(async n => await contract.rewards(n)));
  }

  // @TODO: Find rewards rates which matches the APY returned from their API
  getRewardRates({ contractPosition }: GetDataPropsParams<RamsesGauge, SingleStakingFarmDataProps>) {
    const rewardTokens = contractPosition.tokens.filter(isClaimable);
    return Promise.all(rewardTokens.map(_rt => 0));
  }

  async getStakedTokenBalance({ address, contract }: GetTokenBalancesParams<RamsesGauge, SingleStakingFarmDataProps>) {
    const balance = await contract.balanceOf(address);
    return balance;
  }

  getRewardTokenBalances({
    address,
    contract,
    contractPosition,
  }: GetTokenBalancesParams<RamsesGauge, SingleStakingFarmDataProps>) {
    const rewardTokens = contractPosition.tokens.filter(isClaimable);
    return Promise.all(rewardTokens.map(rt => contract.earned(rt.address, address)));
  }
}
