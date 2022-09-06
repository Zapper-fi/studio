import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { RookPoolTokenFetcher } from '../common/rook.pool.token-fetcher';
import { ROOK_DEFINITION } from '../rook.definition';

@Injectable()
export class EthereumRookV2PoolTokenFetcher extends RookPoolTokenFetcher {
  appId = ROOK_DEFINITION.id;
  groupId = ROOK_DEFINITION.groups.v2Pool.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'V2 Pools';

  isV3 = false;
  liquidityPoolAddress = '0x35ffd6e268610e764ff6944d07760d0efe5e40e5';
  kTokenAddresses = [
    '0xdcaf89b0937c15eab969ea01f57aaacc92a21995',
    '0x0314b6cc36ea9b48f34a350828ce98f17b76bc44',
    '0xc4c43c78fb32f2c7f8417af5af3b85f090f1d327',
    '0xac826952bc30504359a099c3a486d44e97415c77',
    '0xac19815455c2c438af8a8b4623f65f091364be10',
  ];
}
