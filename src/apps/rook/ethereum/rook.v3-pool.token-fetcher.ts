import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { RookPoolTokenFetcher } from '../common/rook.pool.token-fetcher';

@PositionTemplate()
export class EthereumRookV3PoolTokenFetcher extends RookPoolTokenFetcher {
  groupLabel = 'V3 Pools';

  isV3 = true;
  liquidityPoolAddress = '0x4f868c1aa37fcf307ab38d215382e88fca6275e2';
  kTokenAddresses = [
    '0x77565202d78a6eda565c7dc737ff1d8e64fd672a', // kBTC
    '0x8ee17fa30d63ebd66e02205b1df2f30d60a5ca30', // kDAI
    '0x179212cb86d0ee6a4dfb2abb1cf6a09fee0a9525', // kETH
    '0x3045312fb54f00f43d6607999e387db58ffb4cf4', // kUSDC
    '0x834cacd6425fa6c7126b028b3d1e4cda53eb7257', // kWETH
  ];
}
