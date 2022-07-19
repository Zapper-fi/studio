import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher.interface';
import { Network } from '~types/network.interface';

import { OPENLEVERAGE_DEFINITION } from '../openleverage.definition';

import Axios from 'axios';
import BigNumberJS from 'bignumber.js';


const appId = OPENLEVERAGE_DEFINITION.id;
const network = Network.BINANCE_SMART_CHAIN_MAINNET;

const endpoint = 'https://bnb.openlevergae.finance/api/overview/statistical/stat';
const staking_endpoint = 'https://bnb.openleverage.finance/api/xole/rewards';


export type stakingReward = {
  totalLockU: number
}

export type poolReward = {
  lended: any
}
@Register.TvlFetcher({ appId, network })
export class BinanceSmartChainOpenleverageTvlFetcher implements TvlFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) { }


  async getStakedTVL() {
    const res = await Axios.get<stakingReward>(staking_endpoint).then(
      (v) => v.data
    );
    return res.totalLockU;
  }

  async getPoolTVL() {
    const res = await Axios.get<poolReward>(endpoint).then(
      (v) => v.data
    )
    return res.lended.lendingValue;
  }

  async getTvl() {
    const poolTVL = new BigNumberJS(await this.getStakedTVL());
    const stakedTVL = new BigNumberJS(await this.getStakedTVL());
    const result = (poolTVL.plus(stakedTVL)).toString();
    return Number(result);
  }
}
