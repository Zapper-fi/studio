import { Register } from '~app-toolkit/decorators';
import { BalancerV2PoolTokenFetcher } from '~apps/balancer-v2/common/balancer-v2.pool.token-fetcher';
import { Network } from '~types/network.interface';

import { KOYO_DEFINITION } from '../koyo.definition';

const appId = KOYO_DEFINITION.id;
const groupId = KOYO_DEFINITION.groups.pool.id;
const network = Network.MOONRIVER_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class MoonriverKoyoPoolTokenFetcher extends BalancerV2PoolTokenFetcher {
  appId = KOYO_DEFINITION.id;
  groupId = KOYO_DEFINITION.groups.pool.id;
  network = Network.MOONRIVER_MAINNET;
  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/koyo-finance/exchange-subgraph-moonriver';
  vaultAddress = '0xea1e627c12df4e054d61fd408ff7186353ac6ca1';
  minLiquidity = 0;
}
