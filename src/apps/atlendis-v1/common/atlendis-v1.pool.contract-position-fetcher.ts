import { Inject } from '@nestjs/common';
import { BigNumber } from 'bignumber.js';
import { BigNumberish } from 'ethers';
import { gql } from 'graphql-request';
import { compact, merge } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType, Standard } from '~position/position.interface';
import {
  GetTokenDefinitionsParams,
  GetDisplayPropsParams,
  GetDataPropsParams,
} from '~position/template/contract-position.template.types';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';

import { AtlendisV1ViemContractFactory } from '../contracts';
import { AtlendisPositionManager } from '../contracts/viem/AtlendisPositionManager';

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
  positionKey: string;
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
    @Inject(AtlendisV1ViemContractFactory) protected readonly contractFactory: AtlendisV1ViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.atlendisPositionManager({ address, network: this.network });
  }

  async getDefinitions(): Promise<AtlendisV1PoolDefinition[]> {
    const data = await gqlFetch<GetPoolResponse>({
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
    return { assetStandard: Standard.ERC_721, id: definition.id, label: definition.label, positionKey: definition.id };
  }

  async getLabel({
    contractPosition,
  }: GetDisplayPropsParams<AtlendisPositionManager, AtlendisV1PoolDataProps, AtlendisV1PoolDefinition>) {
    return contractPosition.dataProps.label;
  }

  async getTokenBalancesPerPosition(): Promise<BigNumberish[]> {
    throw new Error('Method not implemented.');
  }

  async getBalances(address: string): Promise<ContractPositionBalance<AtlendisV1PoolDataProps>[]> {
    const multicall = this.appToolkit.getViemMulticall(this.network);

    const userPositionsData = await gqlFetch<GetUserPositionsResponse>({
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
        const [bondsQuantity, normalizedDepositedAmount] = await multicall
          .wrap(contract)
          .read.getPositionRepartition([BigInt(tokenId)]);
        const balanceRawWei = new BigNumber(bondsQuantity.toString()).plus(normalizedDepositedAmount.toString());
        const balanceRaw = new BigNumber(balanceRawWei).div(10 ** 18).times(10 ** position.tokens[0].decimals);
        const tokenBalance = drillBalance(position.tokens[0], balanceRaw.toString());
        const label = `${position.displayProps.label} (#${tokenId})`;

        const positionBalance = merge({}, position, {
          tokens: [tokenBalance],
          balanceUSD: tokenBalance.balanceUSD,
          dataProps: { ...position.dataProps, tokenId, positionKey: tokenId },
          displayProps: { label },
        });

        positionBalance.key = this.appToolkit.getPositionKey(positionBalance);
        return positionBalance;
      }),
    );

    return compact(positionBalances);
  }
}
