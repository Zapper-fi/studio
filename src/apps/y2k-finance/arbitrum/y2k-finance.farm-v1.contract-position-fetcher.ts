import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { gql } from 'graphql-request';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDefinitionsParams,
  DefaultContractPositionDefinition,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { Y2KFinanceViemContractFactory } from '../contracts';
import { Y2KFinanceStakingRewards } from '../contracts/viem';

export const FARMS_QUERY = gql`
  {
    farms {
      address
    }
  }
`;

export type FarmsResponse = {
  farms: {
    address: string;
  }[];
};

@PositionTemplate()
export class ArbitrumY2KFinanceFarmV1ContractPositionFetcher extends ContractPositionTemplatePositionFetcher<Y2KFinanceStakingRewards> {
  groupLabel = 'Farms';
  subgraphUrl = 'https://subgraph.satsuma-prod.com/a30e504dd617/y2k-finance/v2-prod/api';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(Y2KFinanceViemContractFactory) protected readonly contractFactory: Y2KFinanceViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.y2KFinanceStakingRewards({ address, network: this.network });
  }

  async getDefinitions(_params: GetDefinitionsParams): Promise<DefaultContractPositionDefinition[]> {
    const farmsResponse = await gqlFetch<FarmsResponse>({
      endpoint: this.subgraphUrl,
      query: FARMS_QUERY,
    });
    return farmsResponse.farms.map(farm => ({ address: farm.address }));
  }

  async getTokenDefinitions({
    contract,
  }: GetTokenDefinitionsParams<Y2KFinanceStakingRewards, DefaultContractPositionDefinition>): Promise<
    UnderlyingTokenDefinition[] | null
  > {
    const [stakingToken, tokenIdRaw, rewardsToken] = await Promise.all([
      contract.read.stakingToken(),
      contract.read.id(),
      contract.read.rewardsToken(),
    ]);

    return [
      {
        metaType: MetaType.SUPPLIED,
        address: stakingToken,
        network: this.network,
        tokenId: tokenIdRaw.toString(),
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: rewardsToken,
        network: this.network,
      },
    ];
  }

  async getLabel({
    contractPosition,
  }: GetDisplayPropsParams<
    Y2KFinanceStakingRewards,
    DefaultDataProps,
    DefaultContractPositionDefinition
  >): Promise<string> {
    const stakingTokenAddress = contractPosition.tokens[0];
    const vault = this.contractFactory.y2KFinanceVaultV1({
      address: stakingTokenAddress.address,
      network: this.network,
    });
    const name = await vault.read.name();
    return `${name} Farming`;
  }

  async getTokenBalancesPerPosition(
    params: GetTokenBalancesParams<Y2KFinanceStakingRewards, DefaultDataProps>,
  ): Promise<BigNumberish[]> {
    const supply = await params.contract.read.balanceOf([params.address]);
    const rewards = await params.contract.read.earned([params.address]);
    return [supply, rewards];
  }
}
