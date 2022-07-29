import { CurvePoolDefinition } from '~apps/curve/curve.types';

export const KINESIS_LABS_BASEPOOL_DEFINITIONS: CurvePoolDefinition[] = [
  // Nomad Base Pool madUSDC/madUSDT/FRAX
  {
    swapAddress: '0x49b97224655aad13832296b8f6185231afb8aacc',
    tokenAddress: '0xfb25679ff0651cde4cf58887be266b68326ddab6',
    coinAddresses: [
      '0xe03494d0033687543a80c9b1ca7d6237f2ea8bd8',
      '0x51e44ffad5c2b122c8b635671fcc8139dc636e82',
      '0x7ff4a56b32ee13d7d4d405887e0ea37d61ed919e',
    ],
  },
  // Celer Base Pool celerUSDC/celerUSDT/FRAX
  {
    swapAddress: '0xbbd5a7ae45a484bd8dabdfeeeb33e4b859d2c95c',
    tokenAddress: '0xf6b65b88a9e7846ed0de503e682cc230f892c2fa',
    coinAddresses: [
      '0xe03494d0033687543a80c9b1ca7d6237f2ea8bd8',
      '0xe46910336479f254723710d57e7b683f3315b22b',
      '0xb72a7567847aba28a2819b855d7fe679d4f59846',
    ],
  },
];
