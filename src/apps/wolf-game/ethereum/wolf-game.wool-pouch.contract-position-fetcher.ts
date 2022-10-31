import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { gql } from 'graphql-request';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { AppToolkit } from '~app-toolkit/app-toolkit.service';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
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

import { WolfGameContractFactory, WolfGameWoolPouch } from '../contracts';

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
export class EthereumWolfGameWoolPouchContractPositionFetcher extends ContractPositionTemplatePositionFetcher<WolfGameWoolPouch> {
  groupLabel = 'Wool Pouches';
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolKit: AppToolkit,
    @Inject(WolfGameContractFactory) protected readonly contractFactory: WolfGameContractFactory,
  ) {
    super(appToolKit);
  }
  async getDefinitions(params: GetDefinitionsParams): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: '0xb76fbbb30e31f2c3bdaa2466cfb1cfe39b220d06' }];
  }
  getContract(address: string): WolfGameWoolPouch {
    return this.contractFactory.wolfGameWoolPouch({ address, network: this.network });
  }
  async getTokenDefinitions(
    _params: GetTokenDefinitionsParams<WolfGameWoolPouch, DefaultContractPositionDefinition>,
  ): Promise<UnderlyingTokenDefinition[] | null> {
    return [{ metaType: MetaType.CLAIMABLE, address: '0x8355dbe8b0e275abad27eb843f3eaf3fc855e525' }];
  }
  async getLabel(
    params: GetDisplayPropsParams<WolfGameWoolPouch, DefaultDataProps, DefaultContractPositionDefinition>,
  ): Promise<string> {
    return 'Wool Pouch';
  }
  getTokenBalancesPerPosition({
    address,
    contractPosition,
    contract,
    multicall,
  }: GetTokenBalancesParams<WolfGameWoolPouch, DefaultDataProps>): Promise<BigNumberish[]> {
    throw new Error('Method not implemented.');
  }
  async getBalances(address: string): Promise<ContractPositionBalance<DefaultDataProps>[]> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const contractPositions = await this.appToolkit.getAppContractPositions<V>({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });
    const result = await this.appToolKit.helpers.theGraphHelper.request<PouchesResult>({
      endpoint: 'https://api.thegraph.com/subgraphs/name/wolfgamedev/wolf-game',
      query: pouchesQuery,
      variables: { owner: address },
    });
    const balances = await Promise.all(
      result.pouches.map(async pouch => {
        const contract = this.getContract(contractPositions[0].address);
        const claimableAmountRaw = await multicall.wrap(contract).amountAvailable(pouch.id);

        const tokenBalance = drillBalance(contractPositions[0].tokens[0], claimableAmountRaw.toString());
        return { ...contractPositions[0], tokens: [tokenBalance], balanceUSD: tokenBalance.balanceUSD };
      }),
    );

    return balances;
  }
}
