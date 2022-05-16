import { CurvePoolDefinition } from '../curve.types';

export const CURVE_V1_POOL_DEFINITIONS: CurvePoolDefinition[] = [
  {
    queryKey: '2pool',
    label: '2Pool Curve',
    swapAddress: '0x7f90122bf0700f9e7e1f688fe926940e8839f353',
    tokenAddress: '0x7f90122bf0700f9e7e1f688fe926940e8839f353',
    gaugeAddress: '0xce5f24b7a95e9cba7df4b54e911b4a3dc8cdaf6f',
    streamAddress: '0xce5f24b7a95e9cba7df4b54e911b4a3dc8cdaf6f',
  },
  {
    queryKey: 'renBTC',
    label: 'renBTC Curve',
    swapAddress: '0x3e01dd8a5e1fb3481f0f589056b428fc308af0fb',
    tokenAddress: '0x3e01dd8a5e1fb3481f0f589056b428fc308af0fb',
    gaugeAddress: '0xdb3fd1bfc67b5d4325cb31c04e0cae52f1787fd6',
    streamAddress: '0xdb3fd1bfc67b5d4325cb31c04e0cae52f1787fd6',
  },
];

export const CURVE_V2_POOL_DEFINITIONS: CurvePoolDefinition[] = [
  {
    queryKey: 'tricrypto',
    label: 'TriCrypto Curve',
    swapAddress: '0x960ea3e3c7fb317332d990873d354e18d7645590',
    tokenAddress: '0x8e0b8c8bb9db49a46697f3a5bb8a308e744821d2',
    gaugeAddress: '0x555766f3da968ecbefa690ffd49a2ac02f47aa5f',
    streamAddress: '0x555766f3da968ecbefa690ffd49a2ac02f47aa5f',
  },
  {
    queryKey: 'eursusd',
    label: 'EURS-USD Curve',
    swapAddress: '0x25e2e8d104bc1a70492e2be32da7c1f8367f9d2c',
    tokenAddress: '0x3dfe1324a0ee9d86337d06aeb829deb4528db9ca',
    gaugeAddress: '0x6339ef8df0c2d3d3e7ee697e241666a916b81587',
    streamAddress: '0x6339ef8df0c2d3d3e7ee697e241666a916b81587',
  },
];
