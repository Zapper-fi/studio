import { Inject } from '@nestjs/common';
import { BigNumber } from 'bignumber.js';
import { BigNumberish } from 'ethers';
import { gql } from 'graphql-request';
import { compact, merge } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { ContractPosition, MetaType, Standard } from '~position/position.interface';
import {
  GetTokenDefinitionsParams,
  GetDisplayPropsParams,
  GetDataPropsParams,
} from '~position/template/contract-position.template.types';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';

import { AtlendisV1ContractFactory } from '../contracts';
import { AtlendisPositionManager } from '../contracts/ethers/AtlendisPositionManager';

export const GET_USER_POSITIONS = gql`
  query getUserPositions($address: String!) {
    positions(where: { lender: $address }) {
      id
      pool {
        id
        parameters {
          underlyingToken
        }
      }
    }
  }
`;

export type GetUserPositionsResponse = {
  positions: {
    id: string;
    pool: {
      id: string;
      parameters: {
        underlyingToken: string;
      };
    };
  }[];
};

export const GET_POOLS_QUERY = gql`
  {
    pools(first: 10) {
      id
      identifier
      parameters {
        underlyingToken
      }
    }
  }
`;

export type GetPoolResponse = {
  pools: {
    id: string;
    identifier: string;
    parameters: {
      underlyingToken: string;
    };
  }[];
};

export type AtlendisV1PoolDataProps = {
  assetStandard: Standard;
  label: string;
  id: string;
};

export type AtlendisV1PoolDefinition = {
  address: string;
  underlyingTokenAddress: string;
  label: string;
  id: string;
};

export abstract class AtlendisV1PoolContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<
  AtlendisPositionManager,
  AtlendisV1PoolDataProps,
  AtlendisV1PoolDefinition
> {
  abstract positionManagerAddress: string;
  abstract subgraphUrl: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AtlendisV1ContractFactory) protected readonly contractFactory: AtlendisV1ContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AtlendisPositionManager {
    return this.contractFactory.atlendisPositionManager({ address, network: this.network });
  }

  async getDefinitions(): Promise<AtlendisV1PoolDefinition[]> {
    const data = await this.appToolkit.helpers.theGraphHelper.request<GetPoolResponse>({
      endpoint: this.subgraphUrl,
      query: GET_POOLS_QUERY,
    });

    return data.pools.map(v => ({
      address: this.positionManagerAddress.toLowerCase(),
      underlyingTokenAddress: v.parameters.underlyingToken.toLowerCase(),
      label: v.identifier,
      id: v.id,
    }));
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<AtlendisPositionManager, AtlendisV1PoolDefinition>) {
    return [{ metaType: MetaType.SUPPLIED, address: definition.underlyingTokenAddress, network: this.network }];
  }

  async getDataProps({
    definition,
  }: GetDataPropsParams<AtlendisPositionManager, AtlendisV1PoolDataProps, AtlendisV1PoolDefinition>) {
    return { assetStandard: Standard.ERC_721, id: definition.id, label: definition.label };
  }

  async getLabel({
    contractPosition,
  }: GetDisplayPropsParams<AtlendisPositionManager, AtlendisV1PoolDataProps, AtlendisV1PoolDefinition>) {
    return contractPosition.dataProps.label;
  }

  getKey({ contractPosition }: { contractPosition: ContractPosition<AtlendisV1PoolDataProps> }) {
    return this.appToolkit.getPositionKey(contractPosition, ['id']);
  }

  async getTokenBalancesPerPosition(): Promise<BigNumberish[]> {
    throw new Error('Method not implemented.');
  }

  async getBalances(address: string): Promise<ContractPositionBalance<AtlendisV1PoolDataProps>[]> {
    const multicall = this.appToolkit.getMulticall(this.network);

    const userPositionsData = await this.appToolkit.helpers.theGraphHelper.request<GetUserPositionsResponse>({
      endpoint: this.subgraphUrl,
      query: GET_USER_POSITIONS,
      variables: { address },
    });

    const positions = await this.appToolkit.getAppContractPositions<AtlendisV1PoolDataProps>({
      network: this.network,
      appId: this.appId,
      groupIds: [this.groupId],
    });

    const positionBalances = await Promise.all(
      userPositionsData.positions.map(async positionData => {
        const tokenId = new BigNumber(positionData.id, 16).toString();
        const position = positions.find(v => v.dataProps.id === positionData.pool.id);
        if (!position) return null;

        const contract = this.contractFactory.atlendisPositionManager(position);
        const { bondsQuantity, normalizedDepositedAmount } = await multicall
          .wrap(contract)
          .getPositionRepartition(tokenId);
        const balanceRawWei = new BigNumber(bondsQuantity.toString()).plus(normalizedDepositedAmount.toString());
        const balanceRaw = new BigNumber(balanceRawWei).div(10 ** 18).times(10 ** position.tokens[0].decimals);
        const tokenBalance = drillBalance(position.tokens[0], balanceRaw.toString());
        const label = `${position.displayProps.label} (#${tokenId})`;

        const positionBalance = merge({}, position, {
          tokens: [tokenBalance],
          balanceUSD: tokenBalance.balanceUSD,
          dataProps: { ...position.dataProps, tokenId },
          displayProps: { label },
        });

        positionBalance.key = this.appToolkit.getPositionKey(positionBalance, ['tokenId']);
        return positionBalance;
      }),
    );

    return compact(positionBalances);
  }
}
