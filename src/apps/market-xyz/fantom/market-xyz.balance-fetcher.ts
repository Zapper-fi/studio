import { Inject } from '@nestjs/common';
import Axios from 'axios';
import { BigNumber } from 'ethers';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { WithMetaType } from '~position/display.interface';
import { BaseTokenBalance, ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MarketXyzContractFactory } from '../contracts';
import { MARKET_XYZ_DEFINITION } from '../market-xyz.definition';

const network = Network.FANTOM_OPERA_MAINNET;

const fantomDirectoryAddress = '0x0E7d754A8d1a82220432148C10715497a0569BD7';
const fantomLensAddress = '0xCb1F1Ff803B475bd854e999ec6d1226f431F5725';

export async function getEthPriceUSD(): Promise<number> {
  return (await Axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')).data.ethereum
    .usd;
}

@Register.BalanceFetcher(MARKET_XYZ_DEFINITION.id, network)
export class FantomMarketXyzBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MarketXyzContractFactory) private readonly marketXyzContractFactory: MarketXyzContractFactory,
  ) { }

  async getBalances(address: string) {
    const multicall = await this.appToolkit.getMulticall(network);
    const directory = await this.marketXyzContractFactory.poolDirectory({ network, address: fantomDirectoryAddress });
    const lens = await this.marketXyzContractFactory.marketLens({ network, address: fantomLensAddress });

    const pools = await directory.getAllPools();
    const assetsRaw = await Promise.all(
      pools.map(pool => multicall.wrap(lens).callStatic.getPoolAssetsWithData(pool.comptroller, { from: address })),
    );
    const ethPrice = await getEthPriceUSD();

    const allAssets = assetsRaw.map(assets => [
      <ContractPositionBalance>{
        tokens: assets
          .map(asset => [
            <WithMetaType<BaseTokenBalance>>{
              metaType: MetaType.SUPPLIED,
              balance:
                parseInt(asset.borrowBalance.div(BigNumber.from(10).pow(asset.underlyingDecimals.sub(3))).toString()) /
                1e3,
              balanceRaw: asset.supplyBalance.toString(),
              balanceUSD:
                parseInt(
                  asset.supplyBalance
                    .mul(asset.underlyingPrice)
                    .mul(ethPrice * 1e2)
                    .div(asset.underlyingDecimals)
                    .toString(),
                ) / 1e2,
            },
            <WithMetaType<BaseTokenBalance>>{
              metaType: MetaType.BORROWED,
              balance:
                parseInt(asset.borrowBalance.div(BigNumber.from(10).pow(asset.underlyingDecimals.sub(3))).toString()) /
                1e3,
              balanceRaw: asset.borrowBalance.toString(),
              balanceUSD:
                parseInt(
                  asset.borrowBalance
                    .mul(asset.underlyingPrice)
                    .mul(ethPrice * 1e2)
                    .div(asset.underlyingDecimals)
                    .toString(),
                ) / 1e2,
            },
          ])
          .reduce((acc, curr) => acc.concat(curr), []),
        balanceUSD: 0,
      },
    ]);

    return presentBalanceFetcherResponse(
      allAssets.map((assets, i) => ({
        label: <string>pools[i].name,
        assets: assets,
      })),
    );
  }
}
