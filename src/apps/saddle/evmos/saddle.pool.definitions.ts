import { CurvePoolDefinition } from '~apps/curve/curve.types';

export const SADDLE_POOL_DEFINITIONS: CurvePoolDefinition[] = [
  // Evmos Frax saddle3PoolFRAX/USDC/USDT
  {
    swapAddress: '0x21d4365834b7c61447e142ef6bcf01136cbd01c6',
    tokenAddress: '0x2801fe8f9de3a4ad6098a5b95d5165676bb01f82',
    coinAddresses: [
      '0x51e44ffad5c2b122c8b635671fcc8139dc636e82',
      '0x7ff4a56b32ee13d7d4d405887e0ea37d61ed919e',
      '0xe03494d0033687543a80c9b1ca7d6237f2ea8bd8',
    ],
  },
];
