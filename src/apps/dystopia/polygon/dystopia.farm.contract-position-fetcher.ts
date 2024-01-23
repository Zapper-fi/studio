import { Inject } from '@nestjs/common';
import { gql } from 'graphql-request';
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

export const DYSTOPIA_QUERY = gql`
  query fetchDystopiaPairs {
    pairs(first: 1000) {
      id
      gauge {
        id
      }
    }
  }
`;

export interface DystopiaQueryResponse {
  pairs: {
    id: string;
    gauge: {
      id: string;
    };
  }[];
}

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
    return contract.read.underlying();
  }

  async getRewardTokenAddresses({ contract }: GetTokenDefinitionsParams<DystopiaGauge>) {
    const numRewards = Number(await contract.read.rewardTokensLength());
    return Promise.all(range(numRewards).map(async n => await contract.read.rewardTokens([BigInt(n)])));
  }

  getRewardRates({ contract, contractPosition }: GetDataPropsParams<DystopiaGauge, SingleStakingFarmDataProps>) {
    const rewardTokens = contractPosition.tokens.filter(isClaimable);
    return Promise.all(rewardTokens.map(rt => contract.read.rewardPerToken([rt.address])));
  }

  async getStakedTokenBalance({
    address,
    contract,
  }: GetTokenBalancesParams<DystopiaGauge, SingleStakingFarmDataProps>) {
    return contract.read.balanceOf([address]);
  }

  getRewardTokenBalances({
    address,
    contract,
    contractPosition,
  }: GetTokenBalancesParams<DystopiaGauge, SingleStakingFarmDataProps>) {
    const rewardTokens = contractPosition.tokens.filter(isClaimable);
    return Promise.all(rewardTokens.map(rt => contract.read.earned([rt.address, address])));
  }
}
