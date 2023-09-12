import { Inject } from '@nestjs/common';
import { BigNumber } from 'bignumber.js';
import { BigNumberish } from 'ethers';
import { gql } from 'graphql-request';
import { map, sumBy, compact } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import {
  DefaultContractPositionDefinition,
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';

import { TaiContractFactory, TaiSafeJoin } from '../contracts';

import { TaiCollateralResolver } from './tai.collateral-fetcher';

export const endpoint = 'https://subgraph.tai.money/subgraphs/name/tai';

type TaiSafesResponse = {
  collateralTypes: {
    id: string;
    accumulatedRate: string;
    currentFsmUpdate: {
      value: string;
    };
  }[];
  safes: {
    collateralType: {
      id: string;
    };
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

interface TaiDataProps extends DefaultDataProps {
  ilkName: string;
}

interface TaiVaultDefinition extends DefaultContractPositionDefinition {
  collateralTokenAddress: string;
  ilkName: string;
}

@PositionTemplate()
export class TaiSafeContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<
  TaiSafeJoin,
  TaiDataProps,
  TaiVaultDefinition
> {
  groupLabel = 'Safes';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(TaiContractFactory) protected readonly contractFactory: TaiContractFactory,
    @Inject(TaiCollateralResolver) protected readonly collateralResolver: TaiCollateralResolver,
  ) {
    super(appToolkit);
  }

  getContract(address: string): TaiSafeJoin {
    return this.contractFactory.taiSafeJoin({ address, network: this.network });
  }

  async getDefinitions(): Promise<TaiVaultDefinition[]> {
    const collaterals = await this.collateralResolver.getCollateralTypes(this.network);
    return map(collaterals, (collateralTokenAddress, ilkName) => ({
      address: '0x3ad2f30266b35f775d58aecde3fbb7ea8b83bf2b',
      collateralTokenAddress,
      ilkName,
    }));
  }

  async getTokenDefinitions({ definition }: GetTokenDefinitionsParams<TaiSafeJoin, TaiVaultDefinition>) {
    return [
      { metaType: MetaType.SUPPLIED, address: definition.collateralTokenAddress, network: this.network },
      { metaType: MetaType.BORROWED, address: '0xf915110898d9a455ad2da51bf49520b41655ccea', network: this.network }, // TAI
    ];
  }

  async getDataProps({ definition }: GetDataPropsParams<TaiSafeJoin, TaiDataProps, TaiVaultDefinition>) {
    return { ilkName: definition.ilkName };
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<TaiSafeJoin, TaiDataProps, TaiVaultDefinition>) {
    return `${contractPosition.dataProps.ilkName} Vault`;
  }

  async getTokenBalancesPerPosition(): Promise<BigNumberish[]> {
    throw new Error('Method not implemented.');
  }

  async getBalances(address: string): Promise<ContractPositionBalance<TaiDataProps>[]> {
    const safesResponse = await gqlFetch<TaiSafesResponse>({
      endpoint,
      query: safePositionsQuery,
      variables: { address: address.toLowerCase() },
    });

    const contractPositions = await this.appToolkit.getAppContractPositions<TaiDataProps>({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    if (!contractPositions.length) return [];

    const balances = await Promise.all(
      safesResponse.safes.map(async safe => {
        const name = safe.collateralType.id;

        const contractPosition = contractPositions.find(position => position.dataProps.ilkName === name);
        if (!contractPosition) return null;

        const accumulatedRate = Number(safesResponse.collateralTypes.find(type => type.id === name)?.accumulatedRate);
        const [collateral, taiToken] = contractPosition.tokens;

        const supplyBalanceRaw = new BigNumber(safe.collateral).times(10 ** collateral.decimals).toString();
        const borrowBalanceRaw = new BigNumber(+safe.debt * +accumulatedRate).times(10 ** taiToken.decimals).toString();

        const allTokens = [
          drillBalance(collateral, supplyBalanceRaw),
          drillBalance(taiToken, borrowBalanceRaw, { isDebt: true }),
        ];

        const tokens = allTokens.filter(v => Math.abs(v.balanceUSD) > 0.01);
        const balanceUSD = sumBy(tokens, t => t.balanceUSD);
        const balance = { ...contractPosition, tokens, balanceUSD };

        return balance;
      }),
    );

    return compact(balances);
  }
}
