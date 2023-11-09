import { Inject } from '@nestjs/common';
import { filter, range } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
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

import { DystopiaViemContractFactory } from '../contracts';
import { DystopiaGauge } from '../contracts/viem';

import { DYSTOPIA_QUERY, DystopiaQueryResponse } from './dystopia.pool.token-fetcher';

@PositionTemplate()
export class PolygonDystopiaStakingContractPositionFetcher extends SingleStakingFarmDynamicTemplateContractPositionFetcher<DystopiaGauge> {
  groupLabel = 'Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(DystopiaViemContractFactory) protected readonly contractFactory: DystopiaViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.dystopiaGauge({ address, network: this.network });
  }

  async getFarmAddresses() {
    const data = await gqlFetch<DystopiaQueryResponse>({
      endpoint: 'https://api.thegraph.com/subgraphs/name/dystopia-exchange/dystopia?source=zapper',
      query: DYSTOPIA_QUERY,
    });
    return filter(data.pairs.map(v => v.gauge?.id));
  }

  async getStakedTokenAddress({ contract }: GetTokenDefinitionsParams<DystopiaGauge>) {
    return contract.underlying();
  }

  async getRewardTokenAddresses({ contract }: GetTokenDefinitionsParams<DystopiaGauge>) {
    const numRewards = Number(await contract.read.rewardTokensLength());
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
