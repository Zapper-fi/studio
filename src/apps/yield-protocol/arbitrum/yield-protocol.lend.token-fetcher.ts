import { Inject } from '@nestjs/common';
import { ethers } from 'ethers';
import { gql } from 'graphql-request';
import { compact } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { DisplayProps } from '~position/display.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { YieldProtocolContractFactory } from '../contracts';
import { formatMaturity } from '../ethereum/yield-protocol.lend.token-fetcher';
import { YIELD_PROTOCOL_DEFINITION } from '../yield-protocol.definition';

const appId = YIELD_PROTOCOL_DEFINITION.id;
const groupId = YIELD_PROTOCOL_DEFINITION.groups.lend.id;
const network = Network.ARBITRUM_MAINNET;

// subgraph endpoint
export const yieldV2ArbitrumSubgraph = 'https://api.thegraph.com/subgraphs/name/yieldprotocol/v2-arbitrum';

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

type FyTokenDataProps = {
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
export class ArbitrumYieldProtocolLendTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(YieldProtocolContractFactory) private readonly yieldProtocolContractFactory: YieldProtocolContractFactory,
  ) {}

  private async getYieldDetails() {
    return await this.appToolkit.helpers.theGraphHelper.request<YieldRes>({
      endpoint: yieldV2ArbitrumSubgraph,
      query,
    });
  }

  private async sellFYTokenPreview(matured: boolean, poolAddress: string, baseSymbol: string, decimals: number) {
    const multicall = this.appToolkit.getMulticall(network);
    if (!matured) {
      const poolContract = this.yieldProtocolContractFactory.pool({ address: poolAddress, network });

      // estimated amount of base you would get for an abritrarily small fyToken value
      try {
        const estimate =
          baseSymbol === 'WETH'
            ? // use smaller unit for weth
              (await multicall.wrap(poolContract).sellFYTokenPreview(ethers.utils.parseUnits('.01', decimals))).mul(100)
            : await multicall.wrap(poolContract).sellFYTokenPreview(ethers.utils.parseUnits('1', decimals));

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

        // get the corresponding pool of the series
        const pool = pools.find(p => p.fyToken.id === fyTokenaddress);

        // get the corresponding base of the series
        const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
        const underlyingToken = baseTokens.find(v => v.address === baseAddress);

        if (!underlyingToken) return null;

        let pricePerShare = 1;
        let price = underlyingToken.price;

        // if there is an associated pool, we estimate the value of a unit of fyToken to base
        if (pool?.id) {
          const estimate = await this.sellFYTokenPreview(matured, pool?.id, underlyingToken.symbol, decimals);
          pricePerShare = estimate;
          price = pricePerShare * underlyingToken.price;
        }

        const dataProps: FyTokenDataProps = {
          matured,
        };

        const displayName = formatMaturity(maturity);
        const displayProps: DisplayProps = {
          label: `fy${underlyingToken.symbol}`,
          secondaryLabel: displayName,
          tertiaryLabel: matured ? 'Matured' : '',
          images: getImagesFromToken(underlyingToken),
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
