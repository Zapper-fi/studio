import { Inject } from '@nestjs/common';
import { BigNumber } from 'bignumber.js';
import { gql } from 'graphql-request';
import { map, sumBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';

import { TaiContractFactory, TaiSafeJoin } from '../contracts';
import { TaiCollateralResolver } from './tai.collateral-fetcher';


export const endpoint = 'https://subgraph.tai.money/subgraphs/name/tai'

type TaiSafesResponse = {
  collateralTypes: {
    id: string
    accumulatedRate: string;
    currentFsmUpdate: {
      value: string;
    };
  }[];
  safes: {
    collateralType: {
      id: string
    }
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
    collateralType {
      id
    }
    collateral
    safeId
    safeHandler
  }
  collateralTypes {
    id
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
export class TaiSafeContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<TaiSafeJoin> {
  groupLabel = 'Safes';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(TaiContractFactory) protected readonly contractFactory: TaiContractFactory,
    @Inject(TaiCollateralResolver) protected readonly collateralResolver: TaiCollateralResolver
  ) {
    super(appToolkit);
  }

  getContract(address: string): TaiSafeJoin {
    return this.contractFactory.taiSafeJoin({ address, network: this.network });
  }

  async getDefinitions() {
    return [{ address: '0x3ad2f30266b35f775d58aecde3fbb7ea8b83bf2b' }];
  }

  async getTokenDefinitions() {
    const collaterals = await this.collateralResolver.getCollateralTypes(this.network)
    return [
      { metaType: MetaType.BORROWED, address: '0xF915110898d9a455Ad2DA51BF49520b41655Ccea', network: this.network }, // TAI
      ...map(collaterals, (address) => ({ metaType: MetaType.SUPPLIED, address, network: this.network }
      )),
    ];
  }

  async getLabel() {
    return `Borrowed TAI`;
  }

  // @ts-ignore
  getTokenBalancesPerPosition() {
    throw new Error('Method not implemented.');
  }

  async getBalances(address: string) {
    const safesResponse = await gqlFetch<TaiSafesResponse>({
      endpoint,
      query: safePositionsQuery,
      variables: { address: address.toLowerCase() },
    });

    const contractPositions = await this.appToolkit.getAppContractPositions({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    if (!contractPositions.length) return [];

    const collaterals = await this.collateralResolver.getCollateralTypes(this.network)
    const contractPosition = contractPositions[0]
    const taiToken = contractPosition.tokens[0];
    const accumulatedRates = safesResponse.collateralTypes.reduce((acc, info) => {
      acc[info.id] = Number(info.accumulatedRate)
      return acc
    }, {})

    const balances = await Promise.all(
      safesResponse.safes.map(async safe => {
        const contractPosition = contractPositions[0];
        const name = safe.collateralType.id;
        const collateral = contractPosition.tokens.find(t => t.address === collaterals[name]) ?? contractPosition.tokens[1]
        const accumulatedRate = accumulatedRates[name]

        const supplyBalanceRaw = new BigNumber(safe.collateral).times(10 ** collateral.decimals).toString();
        const borrowBalanceRaw = new BigNumber(+safe.debt * +accumulatedRate).times(10 ** taiToken.decimals).toString();

        const allTokens = [
          drillBalance(collateral, supplyBalanceRaw),
          drillBalance(contractPosition.tokens[0], borrowBalanceRaw, { isDebt: true }),
        ];

        const tokens = allTokens.filter(v => Math.abs(v.balanceUSD) > 0.01);
        const balanceUSD = sumBy(tokens, t => t.balanceUSD);
        const label = `${name} ${contractPosition.displayProps.label} #${safe.safeId}`;
        const displayProps = Object.assign({}, contractPosition.displayProps, { label });
        const balance: ContractPositionBalance = { ...contractPosition, tokens, balanceUSD, displayProps };

        return balance;
      }),
    );

    return balances;
  }
}
