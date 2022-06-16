import { Inject } from '@nestjs/common';
import { gql } from 'graphql-request';
import { compact } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { EulerContractFactory } from '~apps/euler';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { EULER_DEFINITION } from '../euler.definition';

const appId = EULER_DEFINITION.id;
const groupId = EULER_DEFINITION.groups.dToken.id;
const network = Network.ETHEREUM_MAINNET;

const query = gql`
  {
    eulerMarketStore(id: "euler-market-store") {
      markets {
        id
        interestRate
        borrowAPY
        supplyAPY
        totalBalances
        twap
        name
        symbol
        decimals
        dTokenAddress
      }
    }
  }
`;

interface EulerMarket {
  id: string;
  interestRate: string;
  borrowAPY: string;
  supplyAPY: string;
  totalBalances: string;
  twap: string;
  name: string;
  symbol: string;
  decimals: string;
  dTokenAddress: string;
}

interface EulerMarketsResponse {
  eulerMarketStore: {
    markets: EulerMarket[];
  };
}

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumEulerDTokenTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(EulerContractFactory) private readonly eulerContractFactory: EulerContractFactory,
  ) {}

  async getPositions() {
    const endpoint = 'https://api.thegraph.com/subgraphs/name/euler-xyz/euler-mainnet';
    const data = await this.appToolkit.helpers.theGraphHelper.request<EulerMarketsResponse>({ endpoint, query });
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    const tokens = await Promise.all(
      data.eulerMarketStore.markets.map(async market => {
        if (market.dTokenAddress === ZERO_ADDRESS) return null;

        const dTokenContract = this.eulerContractFactory.eulerDtokenContract({
          address: market.dTokenAddress,
          network,
        });

        const totalSupply = await dTokenContract.totalSupply();
        const underlyingToken = baseTokens.find(token => token?.address === market.id.toLowerCase());

        if (totalSupply.isZero() || !underlyingToken) return null;

        const dataProps = {
          name: market.name,
          liquidity: Number(totalSupply) * underlyingToken.price,
          interestRate: Number(market.interestRate) / 10 ** 18,
          borrowAPY: Number(market.borrowAPY) * 100 / 1e27,
        };

        return {
          address: market.dTokenAddress,
          symbol: `D${market.symbol}`,
          name: `${market.name} (D)`,
          type: ContractType.APP_TOKEN as const,
          supply: Number(market.totalBalances) / 10 ** Number(market.decimals),
          pricePerShare: underlyingToken.price,
          price: underlyingToken.price,
          network,
          decimals: Number(market.decimals),
          tokens: [underlyingToken],
          dataProps,
          displayProps: {
            label: `${market.name} (D)`,
            secondaryLabel: buildDollarDisplayItem(underlyingToken.price),
            images: getImagesFromToken(underlyingToken),
            statsItems: [
              {
                label: 'Liquidity',
                value: buildDollarDisplayItem(dataProps.liquidity),
              },
              {
                label: 'Borrow APY',
                value: dataProps.borrowAPY,
              },
            ],
          },
          appId,
          groupId,
        };
      }),
    );

    return compact(tokens);
  }
}
