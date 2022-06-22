import { Inject, Injectable } from '@nestjs/common';
import { gql } from 'graphql-request';
import { compact } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { ARRAKIS_DEFINITION } from '../arrakis.definition';
import { ArrakisContractFactory } from '../contracts';

export enum PoolLabelStrategy {
  TOKEN_SYMBOLS = 'token-symbols',
  POOL_NAME = 'pool-name',
}

type ArrakisPoolTokenDataProps = {
  liquidity: number;
  fee: number;
  reserves: number[];
};

type GetArrakisPoolTokensParams = {
  network: Network;
  subgraphUrl: string;
};

type PoolAddressesResponse = {
  pools: {
    id: string;
  }[];
};

const POOL_ADDRESSES_QUERY = gql`
  {
    pools {
      id
    }
  }
`;

@Injectable()
export class ArrakisPoolTokenHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(ArrakisContractFactory) private readonly contractFactory: ArrakisContractFactory,
  ) {}

  async getPositions({ network, subgraphUrl }: GetArrakisPoolTokensParams) {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    const poolsData = await this.appToolkit.helpers.theGraphHelper.request<PoolAddressesResponse>({
      endpoint: subgraphUrl,
      query: POOL_ADDRESSES_QUERY,
    });

    const poolAddresses = (poolsData.pools ?? []).map(v => v.id);
    const poolTokens = await Promise.all(
      poolAddresses.map(async poolAddress => {
        const poolContract = this.contractFactory.arrakisGelatoPool({ network, address: poolAddress });

        const [symbol, decimals, supplyRaw, token0Address, token1Address, reservesRaw, feeRaw] = await Promise.all([
          multicall.wrap(poolContract).symbol(),
          multicall.wrap(poolContract).decimals(),
          multicall.wrap(poolContract).totalSupply(),
          multicall.wrap(poolContract).token0(),
          multicall.wrap(poolContract).token1(),
          multicall.wrap(poolContract).getUnderlyingBalances(),
          multicall
            .wrap(poolContract)
            .gelatoFeeBPS()
            .catch(() =>
              multicall.wrap(this.contractFactory.arrakisPool({ network, address: poolAddress })).arrakisFeeBPS(),
            ),
        ]);

        const maybeTokens = [token0Address, token1Address]
          .map(v => v.toLowerCase())
          .map(v => baseTokens.find(t => t.address === v));
        const tokens = compact(maybeTokens);
        if (tokens.length !== maybeTokens.length) return null;

        const reserves = reservesRaw.map((r, i) => Number(r) / 10 ** tokens[i].decimals);
        const liquidity = tokens.reduce((acc, v, i) => acc + v.price * reserves[i], 0);
        if (liquidity < 1000) return null;

        // Data Props
        const supply = Number(supplyRaw) / 10 ** decimals;
        const fee = Number(feeRaw) / 10 ** 4;
        const price = liquidity / supply;
        const pricePerShare = reserves.map(r => r / supply);
        const reservePercentages = tokens.map((t, i) => reserves[i] * (t.price / liquidity));

        // Display Props
        const label = tokens.map(v => v.symbol).join(' / ');
        const secondaryLabel = reservePercentages.map(p => `${Math.round(p * 100)}%`).join(' / ');
        const images = tokens.map(v => getTokenImg(v.address, network));
        const statsItems = [
          { label: 'Liquidity', value: buildDollarDisplayItem(liquidity) },
          { label: 'Fee', value: buildPercentageDisplayItem(fee) },
        ];

        const token: AppTokenPosition<ArrakisPoolTokenDataProps> = {
          type: ContractType.APP_TOKEN,
          appId: ARRAKIS_DEFINITION.id,
          groupId: ARRAKIS_DEFINITION.groups.pool.id,
          address: poolAddress,
          network,
          symbol,
          decimals,
          supply,
          price,
          pricePerShare,
          tokens,

          dataProps: {
            fee,
            liquidity,
            reserves,
          },

          displayProps: {
            label,
            secondaryLabel,
            images,
            statsItems,
          },
        };

        return token;
      }),
    );

    return compact(poolTokens);
  }
}
