import { Inject } from '@nestjs/common';
import { utils } from 'ethers';
import { gql } from 'graphql-request';
import { compact } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { EulerContractFactory } from '~apps/euler';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { EULER_DEFINITION } from '../euler.definition';

const appId = EULER_DEFINITION.id;
const groupId = EULER_DEFINITION.groups.eToken.id;
const network = Network.ETHEREUM_MAINNET;

const query = gql`
  {
    eulerMarketStore(id: "euler-market-store") {
      markets {
        id
        interestRate
        borrowAPY
        supplyAPY
        twap
        name
        symbol
        decimals
        eTokenAddress
        totalBalances
      }
    }
  }
`;

interface EulerMarket {
  id: string;
  interestRate: string;
  borrowAPY: string;
  supplyAPY: string;
  twap: string;
  name: string;
  symbol: string;
  decimals: string;
  eTokenAddress: string;
  totalBalances: string;
}

interface EulerMarketsResponse {
  eulerMarketStore: {
    markets: EulerMarket[];
  };
}

type EulerTokenDataProps = {
  liquidity: number;
  interestRate: number;
  borrowAPY: number;
  supplyAPY: number;
};

@Register.TokenPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class EthereumEulerETokenTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(EulerContractFactory) private readonly eulerContractFactory: EulerContractFactory,
  ) {}

  async getPositions() {
    const endpoint = 'https://api.thegraph.com/subgraphs/name/euler-xyz/euler-mainnet';
    const data = await this.appToolkit.helpers.theGraphHelper.request<EulerMarketsResponse>({ endpoint, query });
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    const tokens = await Promise.all(
      data.eulerMarketStore.markets.map(async market => {
        if (market.eTokenAddress === ZERO_ADDRESS) return null;

        const eTokenContract = this.eulerContractFactory.eulerEtokenContract({
          address: market.eTokenAddress,
          network,
        });

        const [totalSupplyRaw, decimals, pricePerShareRaw] = await Promise.all([
          multicall.wrap(eTokenContract).totalSupply(),
          multicall.wrap(eTokenContract).decimals(),
          multicall.wrap(eTokenContract).convertBalanceToUnderlying(utils.parseEther('1')),
        ]);
        const underlyingToken = baseTokens.find(token => token?.address === market.id.toLowerCase());

        if (totalSupplyRaw.isZero() || !underlyingToken) return null;

        const supply = Number(totalSupplyRaw) / 10 ** decimals;
        const symbol = `E${market.symbol}`;
        const pricePerShare = Number(utils.formatEther(pricePerShareRaw));
        const price = underlyingToken.price * pricePerShare;
        const liquidity = supply * underlyingToken.price;
        const interestRate = Number(market.interestRate) / 10 ** decimals;
        const supplyAPY = (Number(market.supplyAPY) * 100) / 1e27;

        const dataProps = {
          liquidity,
          interestRate,
          supplyAPY,
        };

        const statsItems = [
          {
            label: 'Liquidity',
            value: buildDollarDisplayItem(dataProps.liquidity),
          },
          {
            label: 'Supply APY',
            value: buildPercentageDisplayItem(dataProps.supplyAPY),
          },
        ];

        const displayProps = {
          label: `${market.name} (E)`,
          secondaryLabel: buildDollarDisplayItem(price),
          images: getImagesFromToken(underlyingToken),
          statsItems,
        };

        return {
          type: ContractType.APP_TOKEN as const,
          address: market.eTokenAddress,
          appId,
          groupId,
          network,
          symbol,
          decimals,
          supply,
          price,
          pricePerShare,
          tokens: [underlyingToken],
          dataProps,
          displayProps,
        };
      }),
    );

    return compact(tokens);
  }
}
