import { Inject } from '@nestjs/common';
import Axios from 'axios';
import { BigNumber } from 'ethers';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher.interface';
import { Network } from '~types/network.interface';

import { MarketXyzContractFactory } from '../contracts';
import { MARKET_XYZ_DEFINITION } from '../market-xyz.definition';

const appId = MARKET_XYZ_DEFINITION.id;
const network = Network.FANTOM_OPERA_MAINNET;

const fantomDirectoryAddress = '0x0E7d754A8d1a82220432148C10715497a0569BD7';
const fantomLensAddress = '0xCb1F1Ff803B475bd854e999ec6d1226f431F5725';

export async function getEthPriceUSD(): Promise<number> {
  return (await Axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')).data.ethereum
    .usd;
}

@Register.TvlFetcher({ appId, network })
export class FantomMarketXyzTvlFetcher implements TvlFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MarketXyzContractFactory) private readonly marketXyzContractFactory: MarketXyzContractFactory,
  ) { }

  async getTvl() {
    const lens = await this.marketXyzContractFactory.marketLens({ network, address: fantomLensAddress });
    const ethPrice = await getEthPriceUSD();

    const { 2: totalSuppliedETH } = await lens.callStatic.getPublicPoolsWithData(fantomDirectoryAddress);
    const tvlETH = totalSuppliedETH.reduce((acc, cur) => acc.add(cur), BigNumber.from(0));

    return (parseInt(tvlETH.toString()) / 1e18) * ethPrice;
  }
}
