import { Inject } from '@nestjs/common';
import { BigNumber } from 'bignumber.js';
import { gql } from 'graphql-request';
import { sumBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';

import { ReflexerViemContractFactory } from '../contracts';
import { ReflexerSafeJoin } from '../contracts/viem/ReflexerSafeJoin';

type ReflexerSafesResponse = {
  collateralType: {
    accumulatedRate: string;
    currentFsmUpdate: {
      value: string;
    };
  };
  safes: {
    collateral: string;
    safeId: string;
    debt: string;
    safeHandler: string;
  }[];
  systemState: {
    currentRedemptionPrice: {
      value: string;
    };
  };
};

const safePositionsQuery = gql`
  query fetchSafePositions($address: String!) {
    safes(where: { owner: $address }) {
      debt
      collateral
      safeId
      safeHandler
    }
    collateralType(id: "ETH-A") {
      currentFsmUpdate {
        value
      }
      accumulatedRate
    }
    systemState(id: "current") {
      currentRedemptionPrice {
        value
      }
    }
  }
`;

@PositionTemplate()
export class ReflexerSafeContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<ReflexerSafeJoin> {
  groupLabel = 'Safes';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ReflexerViemContractFactory) protected readonly contractFactory: ReflexerViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.reflexerSafeJoin({ address, network: this.network });
  }

  async getDefinitions() {
    return [{ address: '0x2d3cd7b81c93f188f3cb8ad87c8acc73d6226e3a' }];
  }

  async getTokenDefinitions() {
    return [
      { metaType: MetaType.SUPPLIED, address: ZERO_ADDRESS, network: this.network },
      { metaType: MetaType.BORROWED, address: '0x03ab458634910aad20ef5f1c8ee96f1d6ac54919', network: this.network },
    ];
  }

  async getLabel() {
    return `Supplied ETH, Borrowed RAI in Reflexer Safe`;
  }

  // @ts-ignore
  getTokenBalancesPerPosition() {
    throw new Error('Method not implemented.');
  }

  async getBalances(address: string) {
    const safesResponse = await gqlFetch<ReflexerSafesResponse>({
      endpoint: `https://api.thegraph.com/subgraphs/name/reflexer-labs/rai-mainnet?source=zapper`,
      query: safePositionsQuery,
      variables: { address: address.toLowerCase() },
    });

    const contractPositions = await this.appToolkit.getAppContractPositions({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    const { collateralType } = safesResponse;
    const { accumulatedRate } = collateralType;

    if (!contractPositions.length) return [];

    const balances = await Promise.all(
      safesResponse.safes.map(async safe => {
        const contractPosition = contractPositions[0];
        const ethToken = contractPosition.tokens[0];
        const raiToken = contractPosition.tokens[1];

        const supplyBalanceRaw = new BigNumber(safe.collateral).times(10 ** ethToken.decimals).toString();
        const borrowBalanceRaw = new BigNumber(+safe.debt * +accumulatedRate).times(10 ** raiToken.decimals).toString();

        const allTokens = [
          drillBalance(contractPosition.tokens[0], supplyBalanceRaw),
          drillBalance(contractPosition.tokens[1], borrowBalanceRaw, { isDebt: true }),
        ];

        const tokens = allTokens.filter(v => Math.abs(v.balanceUSD) > 0.01);
        const balanceUSD = sumBy(tokens, t => t.balanceUSD);
        const label = `${contractPosition.displayProps.label} #${safe.safeId}`;
        const displayProps = Object.assign({}, contractPosition.displayProps, { label });
        const balance: ContractPositionBalance = { ...contractPosition, tokens, balanceUSD, displayProps };

        return balance;
      }),
    );

    return balances;
  }
}
