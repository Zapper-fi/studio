import { Inject } from '@nestjs/common';
import { filter, range } from 'lodash';

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

import { DystopiaContractFactory, DystopiaGauge } from '../contracts';

import { DYSTOPIA_QUERY, DystopiaQueryResponse } from './dystopia.pool.token-fetcher';

@PositionTemplate()
export class PolygonDystopiaStakingContractPositionFetcher extends SingleStakingFarmDynamicTemplateContractPositionFetcher<DystopiaGauge> {
  groupLabel = 'Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(DystopiaContractFactory) protected readonly contractFactory: DystopiaContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): DystopiaGauge {
    return this.contractFactory.dystopiaGauge({ address, network: this.network });
  }

  async getFarmAddresses() {
    const data = await this.appToolkit.helpers.theGraphHelper.request<DystopiaQueryResponse>({
      endpoint: 'https://api.thegraph.com/subgraphs/name/dystopia-exchange/dystopia',
      query: DYSTOPIA_QUERY,
    });
    return filter(data.pairs.map(v => v.gauge?.id));
  }

  async getStakedTokenAddress({ contract }: GetTokenDefinitionsParams<DystopiaGauge>) {
    return contract.underlying();
  }

  async getRewardTokenAddresses({ contract }: GetTokenDefinitionsParams<DystopiaGauge>) {
    const numRewards = Number(await contract.rewardTokensLength());
    return Promise.all(range(numRewards).map(async n => await contract.rewardTokens(n)));
  }

  getRewardRates({ contract, contractPosition }: GetDataPropsParams<DystopiaGauge, SingleStakingFarmDataProps>) {
    const rewardTokens = contractPosition.tokens.filter(isClaimable);
    return Promise.all(rewardTokens.map(rt => contract.rewardPerToken(rt.address)));
  }

  async getStakedTokenBalance({
    address,
    contract,
  }: GetTokenBalancesParams<DystopiaGauge, SingleStakingFarmDataProps>) {
    return contract.balanceOf(address);
  }

  getRewardTokenBalances({
    address,
    contract,
    contractPosition,
  }: GetTokenBalancesParams<DystopiaGauge, SingleStakingFarmDataProps>) {
    const rewardTokens = contractPosition.tokens.filter(isClaimable);
    return Promise.all(rewardTokens.map(rt => contract.earned(rt.address, address)));
  }
}
