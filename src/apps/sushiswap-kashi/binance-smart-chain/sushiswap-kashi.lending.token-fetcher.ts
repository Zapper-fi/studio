import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { SushiswapKashiLendingTokenHelper } from '../helpers/sushiswap-kashi.lending.token-helper';
import { SUSHISWAP_KASHI_DEFINITION } from '../sushiswap-kashi.definition';

const appId = SUSHISWAP_KASHI_DEFINITION.id;
const groupId = SUSHISWAP_KASHI_DEFINITION.groups.lending.id;
const network = Network.BINANCE_SMART_CHAIN_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class BinanceSmartChainSushiswapKashiLendingTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(SushiswapKashiLendingTokenHelper) private readonly lendingTokenHelper: SushiswapKashiLendingTokenHelper,
  ) {}

  getPositions() {
    return this.lendingTokenHelper.getTokens({
      network,
      subgraphUrl: 'https://api.thegraph.com/subgraphs/name/sushiswap/bsc-bentobox',
      first: 1000,
    });
  }
}
