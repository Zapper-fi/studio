import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { KyberDmmPoolTokenFetcher } from '../common/kyber-dmm.pool.token-fetcher';

@PositionTemplate()
export class EthereumKyberDmmPoolTokenFetcher extends KyberDmmPoolTokenFetcher {
  groupLabel = 'Pools';
  factoryAddress = '0x833e4083b7ae46cea85695c4f7ed25cdad8886de';
}
