import { Inject } from '@nestjs/common';
import { ethers } from 'ethers';
import { gql } from 'graphql-request';
import { compact } from 'lodash';
import moment from 'moment';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { DisplayProps } from '~position/display.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { YieldProtocolContractFactory } from '../contracts';
import { YIELD_PROTOCOL_DEFINITION } from '../yield-protocol.definition';

const appId = YIELD_PROTOCOL_DEFINITION.id;
const groupId = YIELD_PROTOCOL_DEFINITION.groups.lend.id;
const network = Network.ETHEREUM_MAINNET;

// subgraph endpoint
const endpoint = 'https://api.thegraph.com/subgraphs/name/yieldprotocol/v2-mainnet';

type YieldPoolDetails = {
  id: string;
  fyToken: {
    id: string;
  };
};

type YieldSeriesDetails = {
  matured: boolean;
  baseAsset: {
    id: string;
  };
  fyToken: {
    id: string;
    symbol: string;
    decimals: number;
    totalSupply: string;
    maturity: number;
  };
};

type YieldRes = {
  pools: YieldPoolDetails[];
  seriesEntities: YieldSeriesDetails[];
};

export type FyTokenDataProps = {
  matured: boolean;
};

const query = gql`
  {
    seriesEntities {
      matured
      baseAsset {
        id
      }
      fyToken {
        id
        symbol
        decimals
        totalSupply
        maturity
      }
    }
    pools {
      id
      fyToken {
        id
      }
    }
  }
`;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumYieldProtocolLendTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(YieldProtocolContractFactory) private readonly yieldProtocolContractFactory: YieldProtocolContractFactory,
  ) {}

  async getYieldDetails() {
    return await this.appToolkit.helpers.theGraphHelper.request<YieldRes>({
      endpoint,
      query,
    });
  }

  async sellFYTokenPreview(matured: boolean, poolAddress: string, decimals: number) {
    const multicall = this.appToolkit.getMulticall(network);
    if (!matured) {
      const poolContract = this.yieldProtocolContractFactory.pool({ address: poolAddress, network });
      // estimated amount of base you would get for an abritrarily small fyToken value
      try {
        const [estimate] = await Promise.all([
          multicall.wrap(poolContract).sellFYTokenPreview(ethers.utils.parseUnits('1', decimals)),
        ]);
        return +ethers.utils.formatUnits(estimate, decimals);
      } catch (error) {
        return 0;
      }
    }

    return 1;
  }

  async getPositions() {
    const { pools, seriesEntities } = await this.getYieldDetails();

    const tokens = await Promise.all(
      seriesEntities.map(async series => {
        const {
          matured,
          baseAsset: { id: baseAddress },
          fyToken: { id: fyTokenaddress, symbol, totalSupply: supply, decimals, maturity },
        } = series;

        const pool = pools.find(p => p.fyToken.id === fyTokenaddress);

        const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
        const underlyingToken = baseTokens.find(v => v.address === baseAddress);

        if (!underlyingToken) return null;

        let pricePerShare = 0;
        let price = underlyingToken.price;

        // if there is an associated pool, we estimate the value of a unit of fyToken to base
        if (pool?.id) {
          const estimate = await this.sellFYTokenPreview(matured, pool?.id, decimals);
          pricePerShare = estimate;
          price = pricePerShare * underlyingToken?.price;
        }

        const dataProps: FyTokenDataProps = {
          matured,
        };
        const displayName = moment(moment.unix(maturity)).format('MMMM D yyyy');
        const displayProps: DisplayProps = {
          label: `fy${underlyingToken?.symbol} ${displayName}`,
          images: getImagesFromToken(underlyingToken!),
        };

        const token: AppTokenPosition = {
          type: ContractType.APP_TOKEN,
          appId,
          groupId,
          address: fyTokenaddress,
          network,
          symbol,
          decimals,
          supply: +supply,
          pricePerShare,
          price,
          tokens: [underlyingToken],
          dataProps,
          displayProps,
        };

        return token;
      }),
    );

    return compact(tokens);
  }
}
