import { CurvePoolDefinition } from '../curve.types';

export const CURVE_STABLE_POOL_DEFINITIONS: CurvePoolDefinition[] = [
  {
    queryKey: '2pool',
    label: '2Pool',
    swapAddress: '0x27e611fd27b276acbd5ffd632e5eaebec9761e40',
    tokenAddress: '0x27e611fd27b276acbd5ffd632e5eaebec9761e40',
    gaugeAddress: '0x8866414733f22295b7563f9c5299715d2d76caf4',
    streamAddress: '0xb9c05b8ee41fdcbd9956114b3af15834fdedcb54',
  },
  {
    queryKey: 'renBTC',
    swapAddress: '0x3ef6a01a0f81d6046290f3e2a8c5b843e738e604',
    tokenAddress: '0x5b5cfe992adac0c9d48e05854b2d91c73a003858',
    gaugeAddress: '0xbdff0c27dd073c119ebcb1299a68a6a92ae607f0',
    streamAddress: '0xfdb129ea4b6f557b07bcdcede54f665b7b6bc281',
  },
  {
    queryKey: 'geist',
    swapAddress: '0x0fa949783947bf6c1b171db13aeacbb488845b3f',
    tokenAddress: '0xd02a30d33153877bc20e5721ee53dedee0422b2f',
    gaugeAddress: '0xd4f94d0aaa640bbb72b5eec2d85f6d114d81a88e',
    streamAddress: '0xfe1a3dd8b169fb5bf0d5dbfe813d956f39ff6310',
  },
  {
    queryKey: 'ironbank',
    swapAddress: '0x4fc8d635c3cb1d0aa123859e2b2587d0ff2707b1',
    tokenAddress: '0xdf38ec60c0ec001142a33eaa039e49e9b84e64ed',
    gaugeAddress: '0xdee85272eae1ab4afbc6433f4d819babc9c7045a',
    streamAddress: '0x92bbf58c2a4514d44343b987d608627eb7d1d24f',
  },
];

export const CURVE_STABLE_METAPOOL_DEFINITIONS: CurvePoolDefinition[] = [
  {
    queryKey: 'fUSDT',
    swapAddress: '0x92d5ebf3593a92888c25c0abef126583d4b5312e',
    tokenAddress: '0x92d5ebf3593a92888c25c0abef126583d4b5312e',
    gaugeAddress: '0x06e3c4da96fd076b97b7ca3ae23527314b6140df',
    streamAddress: '0xfe1a3dd8b169fb5bf0d5dbfe813d956f39ff6310',
    streamEol: true,
  },
];

export const CURVE_CRYPTO_POOL_DEFINITIONS: CurvePoolDefinition[] = [
  {
    queryKey: 'tricrypto',
    label: 'TriCrypto',
    swapAddress: '0x3a1659ddcf2339be3aea159ca010979fb49155ff',
    tokenAddress: '0x58e57ca18b7a47112b877e31929798cd3d703b0f',
    gaugeAddress: '0x00702bbdead24c40647f235f15971db0867f6bdb',
    streamAddress: '0x260e4fbb13dd91e187ae992c3435d0cf97172316',
  },
];
