import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveFactoryStablePoolTokenFetcher } from '../common/curve.factory-stable-pool.token-fetcher';

@PositionTemplate()
export class EthereumCurveFactoryStablePoolTokenFetcher extends CurveFactoryStablePoolTokenFetcher {
  groupLabel = 'Pools';
  registryAddress = '0xb9fc157394af804a3578134a6585c0dc9cc990d4';

  blacklistedSwapAddresses = [
    // Tokens that are already in the Curve stable registry
    '0x43b4fdfd4ff969587185cdb6f0bd875c5fc83f8c',
    '0x5a6a4d54456819380173272a5e8e9b9904bdf41b',
    '0xd632f22692fac7611d2aa1c0d552930d43caed3b',
    '0xed279fdd11ca84beef15af5d39bb4d4bee23f0ca',
    '0xfd5db7463a3ab53fd211b4af195c5bccc1a03890',
    // Supply broken during re-entrancy hack (see https://hackmd.io/@LlamaRisk/BJzSKHNjn)
    '0xc897b98272aa23714464ea2a0bd5180f1b8c0025',
  ];
}
