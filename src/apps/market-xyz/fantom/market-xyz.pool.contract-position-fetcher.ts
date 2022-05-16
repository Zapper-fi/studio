import { Inject } from '@nestjs/common';
import Axios from 'axios';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { ContractType } from '~position/contract.interface';
import { BalanceDisplayMode } from '~position/display.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { MarketXyzContractFactory } from '../contracts';
import { MARKET_XYZ_DEFINITION } from '../market-xyz.definition';

const appId = MARKET_XYZ_DEFINITION.id;
const groupId = MARKET_XYZ_DEFINITION.groups.pool.id;
const network = Network.FANTOM_OPERA_MAINNET;

const fantomDirectoryAddress = '0x0E7d754A8d1a82220432148C10715497a0569BD7';
const fantomLensAddress = '0xCb1F1Ff803B475bd854e999ec6d1226f431F5725';

export async function getEthPriceUSD(): Promise<number> {
  return (await Axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')).data.ethereum
    .usd;
}

@Register.ContractPositionFetcher({ appId, groupId, network })
export class FantomMarketXyzPoolContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MarketXyzContractFactory) private readonly marketXyzContractFactory: MarketXyzContractFactory,
  ) { }

  async getPositions() {
    const multicall = await this.appToolkit.getMulticall(network);
    const directory = await this.marketXyzContractFactory.poolDirectory({ network, address: fantomDirectoryAddress });
    const lens = await this.marketXyzContractFactory.marketLens({ network, address: fantomLensAddress });

    const pools = await directory.getAllPools();
    const assetsRaw = await Promise.all(
      pools.map(pool => multicall.wrap(lens).callStatic.getPoolAssetsWithData(pool.comptroller)),
    );
    const ethPrice = await getEthPriceUSD();

    const positions = pools.map((pool, i) => {
      const label = pool.name;
      const address = pool.comptroller;

      const tokens = assetsRaw[i].map(asset => {
        const decimals = asset.underlyingDecimals.toNumber();
        const symbol = asset.underlyingSymbol.toString();

        const price =
          parseInt(
            asset.underlyingPrice
              .mul(ethPrice * 1e2)
              .div(decimals + 36)
              .toString(),
          ) / 1e2;

        return supplied({
          type: ContractType.BASE_TOKEN,
          network,
          address,
          symbol: symbol,
          decimals: decimals,
          price: price,
        });
      });

      return <ContractPosition>{
        appId,
        groupId,
        address,
        network,
        tokens,
        displayProps: {
          label,
          balanceDisplayMode: BalanceDisplayMode.UNDERLYING,
        },
      };
    });

    return positions;
  }
}
