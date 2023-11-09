import { Inject } from '@nestjs/common';
import axios from 'axios';
import BigNumber from 'bignumber.js';
import { BigNumberish } from 'ethers';
import { gql } from 'graphql-request';
import { sumBy } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import { isSupplied } from '~position/position.utils';
import { GetTokenDefinitionsParams, GetDisplayPropsParams } from '~position/template/contract-position.template.types';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';
import { NETWORK_IDS } from '~types';

import { SymphonyViemContractFactory } from '../contracts';
import { SymphonyYolo } from '../contracts/viem';

type UserOpenOrders = {
  orders: {
    id: string;
    inputToken: string;
    inputAmount: string;
  }[];
};

const USER_OPEN_ORDERS_QUERY = gql`
  query GetOrdersByOwner($creator: String) {
    orders(where: { creator: $creator, status: ACTIVE }) {
      id
      inputToken
      inputAmount
    }
  }
`;

type SymphonyYoloDefinition = {
  address: string;
  tokenAddress: string;
};

export abstract class SymphonyYoloContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<
  SymphonyYolo,
  DefaultDataProps,
  SymphonyYoloDefinition
> {
  abstract yoloAddress: string;
  abstract subgraphUrl: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SymphonyViemContractFactory) protected readonly contractFactory: SymphonyViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.symphonyYolo({ address, network: this.network });
  }

  async getDefinitions(): Promise<SymphonyYoloDefinition[]> {
    const tokenlistUrl = 'https://raw.githubusercontent.com/symphony-finance/token-list/master/symphony.tokenlist.json';
    return (await axios.get(tokenlistUrl)).data.tokens
      .filter(data => data.chainId == NETWORK_IDS[this.network] && !data.extensions.isNative)
      .map(token => ({ address: this.yoloAddress, tokenAddress: token.address }));
  }

  async getTokenDefinitions({ definition }: GetTokenDefinitionsParams<SymphonyYolo, SymphonyYoloDefinition>) {
    return [{ metaType: MetaType.SUPPLIED, address: definition.tokenAddress, network: this.network }];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<SymphonyYolo>) {
    return `${getLabelFromToken(contractPosition.tokens[0])} Order`;
  }

  async getTokenBalancesPerPosition(): Promise<BigNumberish[]> {
    throw new Error('Method not implemented.');
  }

  async getBalances(address: string): Promise<ContractPositionBalance<DefaultDataProps>[]> {
    const contractPositions = await this.appToolkit.getAppContractPositions({
      appId: this.appId,
      groupIds: [this.groupId],
      network: this.network,
    });

    const openOrdersData = await gqlFetch<UserOpenOrders>({
      endpoint: this.subgraphUrl,
      query: USER_OPEN_ORDERS_QUERY,
      variables: { creator: address },
    });

    const contractPositionBalances = await Promise.all(
      contractPositions.map(async contractPosition => {
        const orders = openOrdersData.orders.filter(
          p => p.inputToken.toLocaleLowerCase() === contractPosition.address.toLocaleLowerCase(),
        )!;

        const claimableToken = contractPosition.tokens.find(isSupplied)!;
        const totalSupplied = orders.reduce((acc, a) => acc.plus(new BigNumber(a.inputAmount)), new BigNumber(0));
        const suppliedTokenBalance = drillBalance(claimableToken, totalSupplied.toString());
        const tokens = [suppliedTokenBalance];
        const balanceUSD = sumBy(tokens, t => t.balanceUSD);

        return { ...contractPosition, tokens, balanceUSD };
      }),
    );

    return contractPositionBalances;
  }
}
