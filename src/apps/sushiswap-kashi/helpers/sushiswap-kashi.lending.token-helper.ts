import { Inject, Injectable } from '@nestjs/common';
import { gql } from 'graphql-request';
import _ from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { AppTokenPosition } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';
import { Network } from '~types/network.interface';

import { SushiswapKashiContractFactory } from '../contracts';
import { SUSHISWAP_KASHI_DEFINITION } from '../sushiswap-kashi.definition';

type SushiswapKashiLendingTokenDataProps = {
  liquidity: number;
  supplyApr: number;
  borrowApr: number;
};

type SushiswapKashiLendingTokenHelperParams = {
  network: Network;
  subgraphUrl: string;
  subgraphVersion: 1 | 2;
  first?: number;
  dependencies?: AppGroupsDefinition[];
};

type PairDetails = {
  pairAddress: string;
  assetAddress: string;
  collateralAddress: string;
  supplyAPR: string;
  borrowAPR: string;
};

type KashiSubgraphV1PairsResponse = {
  kashiPairs?: {
    id: string;
    supplyAPR: string;
    borrowAPR: string;
    asset: {
      id: string;
    };
    collateral: {
      id: string;
    };
  }[];
};

const kashiSubgraphV1PairsQuery = gql`
  query getPairs($first: Int) {
    kashiPairs(first: $first) {
      id
      supplyAPR
      borrowAPR
      asset {
        id
      }
      collateral {
        id
      }
    }
  }
`;

type KashiSubgraphV2PairsResponse = {
  kashiPairs?: {
    id: string;
    kpi: {
      supplyAPR: string;
      borrowAPR: string;
    };
    asset: {
      id: string;
    };
    collateral: {
      id: string;
    };
  }[];
};

const kashiSubgraphV2PairsQuery = gql`
  query getPairs($first: Int) {
    kashiPairs(first: $first) {
      id
      kpi {
        supplyAPR
        borrowAPR
      }
      asset {
        id
      }
      collateral {
        id
      }
    }
  }
`;

@Injectable()
export class SushiswapKashiLendingTokenHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SushiswapKashiContractFactory) private readonly contractFactory: SushiswapKashiContractFactory,
  ) {}

  async getTokens({
    network,
    subgraphUrl,
    first,
    subgraphVersion,
    dependencies = [],
  }: SushiswapKashiLendingTokenHelperParams) {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions(...dependencies);
    const allTokens = [...appTokens, ...baseTokens];

    let pairs: PairDetails[] = [];
    if (subgraphVersion === 1) {
      const pairsData = await this.appToolkit.helpers.theGraphHelper.request<KashiSubgraphV1PairsResponse>({
        endpoint: subgraphUrl,
        query: kashiSubgraphV1PairsQuery,
        variables: {
          first,
        },
      });

      pairs = (pairsData.kashiPairs ?? []).map(pair => ({
        pairAddress: pair.id.toLowerCase(),
        collateralAddress: pair.collateral.id.toLowerCase(),
        assetAddress: pair.asset.id.toLowerCase(),
        supplyAPR: pair.supplyAPR,
        borrowAPR: pair.borrowAPR,
      }));
    } else {
      const pairsData = await this.appToolkit.helpers.theGraphHelper.request<KashiSubgraphV2PairsResponse>({
        endpoint: subgraphUrl,
        query: kashiSubgraphV2PairsQuery,
        variables: {
          first,
        },
      });

      pairs = (pairsData.kashiPairs ?? []).map(pair => ({
        pairAddress: pair.id.toLowerCase(),
        collateralAddress: pair.collateral.id.toLowerCase(),
        assetAddress: pair.asset.id.toLowerCase(),
        supplyAPR: pair.kpi.supplyAPR,
        borrowAPR: pair.kpi.borrowAPR,
      }));
    }

    const tokens = await Promise.all(
      pairs.map(async pair => {
        const { pairAddress, collateralAddress, assetAddress } = pair;
        const underlyingCollateralToken = allTokens.find(p => p.address === collateralAddress);
        const underlyingAssetToken = allTokens.find(p => p.address === assetAddress);
        if (!underlyingCollateralToken || !underlyingAssetToken) return null;

        const pairContract = this.contractFactory.sushiswapKashiLendingToken({ address: pairAddress, network });
        const [symbol, decimals, supplyRaw] = await Promise.all([
          multicall.wrap(pairContract).symbol(),
          multicall.wrap(pairContract).decimals(),
          multicall.wrap(pairContract).totalSupply(),
        ]);

        // Data Props
        const supply = Number(supplyRaw) / 10 ** decimals;
        const tokens = [underlyingAssetToken];
        const supplyApr = (Number(pair.supplyAPR) / 1e17) * 100;
        const borrowApr = (Number(pair.borrowAPR) / 1e17) * 100;
        const price = underlyingAssetToken.price;
        const pricePerShare = 1;
        const liquidity = price * supply;

        // Display Props
        const label = `${underlyingAssetToken.symbol} in Kashi ${underlyingAssetToken.symbol} / ${underlyingCollateralToken.symbol}`;
        const secondaryLabel = buildDollarDisplayItem(underlyingAssetToken.price);
        const images = [
          getTokenImg(underlyingAssetToken.address, network),
          getTokenImg(underlyingCollateralToken.address, network),
        ];
        const statsItems = [
          { label: 'Liquidity', value: buildDollarDisplayItem(liquidity) },
          { label: 'Borrow APR', value: buildPercentageDisplayItem(borrowApr) },
          { label: 'Supply APR', value: buildPercentageDisplayItem(supplyApr) },
        ];

        const lendingToken: AppTokenPosition<SushiswapKashiLendingTokenDataProps> = {
          type: ContractType.APP_TOKEN,
          appId: SUSHISWAP_KASHI_DEFINITION.id,
          groupId: SUSHISWAP_KASHI_DEFINITION.groups.lending.id,
          address: pairAddress,
          network,
          symbol,
          decimals,
          supply,
          price,
          pricePerShare,
          tokens,

          dataProps: {
            liquidity,
            supplyApr,
            borrowApr,
          },

          displayProps: {
            label,
            secondaryLabel,
            images,
            statsItems,
          },
        };

        return lendingToken;
      }),
    );

    return _.compact(tokens);
  }
}
