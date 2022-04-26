import { CurvePoolDefinition } from '../curve.types';

export const CURVE_V1_POOL_DEFINITIONS: CurvePoolDefinition[] = [
  {
    queryKey: 'aave',
    label: 'Aave 3Pool Curve',
    swapAddress: '0x7f90122bf0700f9e7e1f688fe926940e8839f353',
    tokenAddress: '0x1337bedc9d22ecbe766df105c9623922a27963ec',
    gaugeAddress: '0x5b5cfe992adac0c9d48e05854b2d91c73a003858',
    streamAddress: '0xb504b6eb06760019801a91b451d3f7bd9f027fc9',
  },
  {
    queryKey: 'renBTC',
    label: 'renBTC Curve',
    swapAddress: '0x16a7da911a4dd1d83f3ff066fe28f3c792c50d90',
    tokenAddress: '0xc2b1df84112619d190193e48148000e3990bf627',
    gaugeAddress: '0x0f9cb53ebe405d49a0bbdbd291a65ff571bc83e1',
    streamAddress: '0x75d05190f35567e79012c2f0a02330d3ed8a1f74',
  },
];

export const CURVE_V2_POOL_DEFINITIONS: CurvePoolDefinition[] = [
  {
    queryKey: 'atricrypto',
    label: 'Aave TriCrypto Curve',
    swapAddress: '0xb755b949c126c04e0348dd881a5cf55d424742b2',
    tokenAddress: '0x1dab6560494b04473a0be3e7d83cf3fdf3a51828',
    gaugeAddress: '0x445fe580ef8d70ff569ab36e80c647af338db351',
    streamAddress: '0xa05e565ca0a103fcd999c7a7b8de7bd15d5f6505',
  },
];
