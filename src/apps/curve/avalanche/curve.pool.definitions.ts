import { CurvePoolDefinition } from '../curve.types';

export const CURVE_V1_POOL_DEFINITIONS: CurvePoolDefinition[] = [
  {
    queryKey: 'aave',
    label: 'Aave 3Pool Curve',
    swapAddress: '0x7f90122bf0700f9e7e1f688fe926940e8839f353',
    tokenAddress: '0x1337bedc9d22ecbe766df105c9623922a27963ec',
    gaugeAddress: '0x4620d46b4db7fb04a01a75ffed228bc027c9a899',
    streamAddress: '0x4620d46b4db7fb04a01a75ffed228bc027c9a899',
  },
  {
    queryKey: 'renBTC',
    label: 'renBTC Curve',
    swapAddress: '0x16a7da911a4dd1d83f3ff066fe28f3c792c50d90',
    tokenAddress: '0xc2b1df84112619d190193e48148000e3990bf627',
    gaugeAddress: '0x00f7d467ef51e44f11f52a0c0bef2e56c271b264',
    streamAddress: '0x00f7d467ef51e44f11f52a0c0bef2e56c271b264',
  },
];

export const CURVE_V2_POOL_DEFINITIONS: CurvePoolDefinition[] = [
  {
    queryKey: 'atricrypto',
    label: 'Aave TriCrypto Curve',
    swapAddress: '0xb755b949c126c04e0348dd881a5cf55d424742b2',
    tokenAddress: '0x1dab6560494b04473a0be3e7d83cf3fdf3a51828',
    gaugeAddress: '0x1879075f1c055564cb968905ac404a5a01a1699a',
    streamAddress: '0x1879075f1c055564cb968905ac404a5a01a1699a',
  },
];
