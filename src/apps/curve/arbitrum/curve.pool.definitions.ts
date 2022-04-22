import { CurvePoolDefinition } from '../curve.types';

export const CURVE_V1_POOL_DEFINITIONS: CurvePoolDefinition[] = [
  {
    queryKey: '2pool',
    label: '2Pool Curve',
    swapAddress: '0x7f90122bf0700f9e7e1f688fe926940e8839f353',
    tokenAddress: '0x7f90122bf0700f9e7e1f688fe926940e8839f353',
    gaugeAddress: '0xbf7e49483881c76487b0989cd7d9a8239b20ca41',
    streamAddress: '0xff17560d746f85674fe7629ce986e949602ef948',
  },
  {
    queryKey: 'renBTC',
    label: 'renBTC Curve',
    swapAddress: '0x3e01dd8a5e1fb3481f0f589056b428fc308af0fb',
    tokenAddress: '0x3e01dd8a5e1fb3481f0f589056b428fc308af0fb',
    gaugeAddress: '0xc2b1df84112619d190193e48148000e3990bf627',
    streamAddress: '0x9f86c5142369b1ffd4223e5a2f2005fc66807894',
  },
];

export const CURVE_V2_POOL_DEFINITIONS: CurvePoolDefinition[] = [
  {
    queryKey: 'tricrypto',
    label: 'TriCrypto Curve',
    swapAddress: '0x960ea3e3c7fb317332d990873d354e18d7645590',
    tokenAddress: '0x8e0b8c8bb9db49a46697f3a5bb8a308e744821d2',
    gaugeAddress: '0x97e2768e8e73511ca874545dc5ff8067eb19b787',
    streamAddress: '0x9044e12fb1732f88ed0c93cfa5e9bb9bd2990ce5',
  },
];
