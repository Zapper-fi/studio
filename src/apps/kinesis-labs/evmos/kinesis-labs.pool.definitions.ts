import { CurvePoolDefinition } from '~apps/curve/curve.types';

export const KINESIS_LABS_BASEPOOL_DEFINITIONS: CurvePoolDefinition[] = [
  // Nomad Base Pool madUSDC/madUSDT/FRAX
  {
    swapAddress: '0x49b97224655aad13832296b8f6185231afb8aacc',
    tokenAddress: '0xfb25679ff0651cde4cf58887be266b68326ddab6',
  },
  // Celer Base Pool celerUSDC/celerUSDT/FRAX
  {
    swapAddress: '0xbbd5a7ae45a484bd8dabdfeeeb33e4b859d2c95c',
    tokenAddress: '0xf6b65b88a9e7846ed0de503e682cc230f892c2fa',
  },
];
