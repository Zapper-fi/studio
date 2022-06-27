import { CurvePoolDefinition } from '../curve.types';

export const CURVE_V1_POOL_DEFINITIONS: CurvePoolDefinition[] = [
  {
    queryKey: '3pool',
    label: '3Pool Curve',
    swapAddress: '0xc5cfada84e902ad92dd40194f0883ad49639b023',
    tokenAddress: '0xc5cfada84e902ad92dd40194f0883ad49639b023',
    gaugeAddress: '0xbf7e49483881c76487b0989cd7d9a8239b20ca41',
    streamAddress: '0xf2cde8c47c20acbffc598217ad5fe6db9e00b163',
  },
];

export const CURVE_V2_POOL_DEFINITIONS: CurvePoolDefinition[] = [
  {
    queryKey: 'tricrypto',
    label: 'TriCrypto',
    swapAddress: '0x0e3dc2bcbfea84072a0c794b7653d3db364154e0',
    tokenAddress: '0x99e8ed28b97c7f1878776ed94ffc77cabfb9b726',
    gaugeAddress: '0xf98450b5602fa59cc66e1379dffb6fddc724cfc4',
    streamAddress: '0x0b2c8fd6110f31f340d3c78a0aef6c568b60695b',
  },
];
