import { Inject } from '@nestjs/common';
import { gql } from 'graphql-request';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import {
  DefaultContractPositionDefinition,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
} from '~position/template/contract-position.template.types';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';

import { WolfGameViemContractFactory } from '../contracts';
import { WolfGameWoolPouch } from '../contracts/viem';

type PouchesResult = {
  pouches: { id: string }[];
};
const pouchesQuery = gql`
  query fetchPouches($owner: String!) {
    pouches(where: { owner: $owner }) {
      id
    }
  }
`;

@PositionTemplate()
export class EthereumWolfGameWoolPouchContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<WolfGameWoolPouch> {
  groupLabel = 'Wool Pouches';
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(WolfGameViemContractFactory) protected readonly contractFactory: WolfGameViemContractFactory,
  ) {
    super(appToolkit);
  }
  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: '0xb76fbbb30e31f2c3bdaa2466cfb1cfe39b220d06' }];
  }
  getContract(address: string) {
    return this.contractFactory.wolfGameWoolPouch({ address, network: this.network });
  }
  async getTokenDefinitions(
    _params: GetTokenDefinitionsParams<WolfGameWoolPouch, DefaultContractPositionDefinition>,
  ): Promise<UnderlyingTokenDefinition[] | null> {
    return [
      {
        metaType: MetaType.CLAIMABLE,
        address: '0x8355dbe8b0e275abad27eb843f3eaf3fc855e525',
        network: this.network,
      },
    ];
  }
  async getLabel(): Promise<string> {
    return 'Wool Pouch';
  }

  // @ts-ignore
  async getTokenBalancesPerPosition() {
    throw new Error('Method not implemented.');
  }

  async getBalances(address: string): Promise<ContractPositionBalance<DefaultDataProps>[]> {
    const multicall = this.appToolkit.getViemMulticall(this.network);
    const contractPositions = await this.appToolkit.getAppContractPositions({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });
    const result = await gqlFetch<PouchesResult>({
      endpoint: 'https://api.thegraph.com/subgraphs/name/wolfgamedev/wolf-game?source=zapper',
      query: pouchesQuery,
      variables: { owner: address },
    });
    const balances = await Promise.all(
      result.pouches.map(async pouch => {
        const contract = this.getContract(contractPositions[0].address);
        const claimableAmountRaw = await multicall.wrap(contract).read.amountAvailable([BigInt(pouch.id)]);

        const tokenBalance = drillBalance(contractPositions[0].tokens[0], claimableAmountRaw.toString());
        return { ...contractPositions[0], tokens: [tokenBalance], balanceUSD: tokenBalance.balanceUSD };
      }),
    );

    return balances;
  }
}
