import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { WombatExchangePoolTokenFetcher } from '../common/wombat-exchange.pool.token-fetcher';

@PositionTemplate()
export class BinanceSmartChainWombatExchangePoolTokenFetcher extends WombatExchangePoolTokenFetcher {
  groupLabel = 'Pools';

  poolAddresses = [
    '0x312bc7eaaf93f1c60dc5afc115fccde161055fb0', // MAIN POOL
    '0x0520451b19ad0bb00ed35ef391086a692cfc74b2', // Side Pool
    '0x0029b7e8e9ed8001c868aa09c74a1ac6269d4183', // BNB Pool
  ];
}
