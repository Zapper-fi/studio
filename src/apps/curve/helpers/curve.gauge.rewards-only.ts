import { Network } from '~types/network.interface';

import { CurveGaugeDefinition, CurveGaugeType } from './curve.gauge.registry';

export const REWARDS_ONLY_GAUGES: Partial<Record<Network, CurveGaugeDefinition[]>> = {
  [Network.ARBITRUM_MAINNET]: [
    {
      swapAddress: '0x7f90122bf0700f9e7e1f688fe926940e8839f353',
      gaugeAddress: '0xbf7e49483881c76487b0989cd7d9a8239b20ca41',
      version: CurveGaugeType.REWARDS_ONLY,
    },
    {
      swapAddress: '0x3e01dd8a5e1fb3481f0f589056b428fc308af0fb',
      gaugeAddress: '0xc2b1df84112619d190193e48148000e3990bf627',
      version: CurveGaugeType.REWARDS_ONLY,
    },
    {
      swapAddress: '0x960ea3e3c7fb317332d990873d354e18d7645590',
      gaugeAddress: '0x97e2768e8e73511ca874545dc5ff8067eb19b787',
      version: CurveGaugeType.REWARDS_ONLY,
    },
    {
      swapAddress: '0xa827a652ead76c6b0b3d19dba05452e06e25c27e',
      gaugeAddress: '0x37c7ef6b0e23c9bd9b620a6dabbfec13ce30d824',
      version: CurveGaugeType.REWARDS_ONLY,
    },
  ],
  [Network.AVALANCHE_MAINNET]: [
    {
      swapAddress: '0x7f90122bf0700f9e7e1f688fe926940e8839f353',
      gaugeAddress: '0x5b5cfe992adac0c9d48e05854b2d91c73a003858',
      version: CurveGaugeType.REWARDS_ONLY,
    },
    {
      swapAddress: '0x16a7da911a4dd1d83f3ff066fe28f3c792c50d90',
      gaugeAddress: '0x0f9cb53ebe405d49a0bbdbd291a65ff571bc83e1',
      version: CurveGaugeType.REWARDS_ONLY,
    },
    {
      swapAddress: '0xb755b949c126c04e0348dd881a5cf55d424742b2',
      gaugeAddress: '0x445fe580ef8d70ff569ab36e80c647af338db351',
      version: CurveGaugeType.REWARDS_ONLY,
    },
  ],
  [Network.FANTOM_OPERA_MAINNET]: [
    {
      swapAddress: '0x27e611fd27b276acbd5ffd632e5eaebec9761e40',
      gaugeAddress: '0x8866414733f22295b7563f9c5299715d2d76caf4',
      version: CurveGaugeType.REWARDS_ONLY,
    },
    {
      swapAddress: '0x3ef6a01a0f81d6046290f3e2a8c5b843e738e604',
      gaugeAddress: '0xbdff0c27dd073c119ebcb1299a68a6a92ae607f0',
      version: CurveGaugeType.REWARDS_ONLY,
    },
    {
      swapAddress: '0x0fa949783947bf6c1b171db13aeacbb488845b3f',
      gaugeAddress: '0xd4f94d0aaa640bbb72b5eec2d85f6d114d81a88e',
      version: CurveGaugeType.REWARDS_ONLY,
    },
    {
      swapAddress: '0x4fc8d635c3cb1d0aa123859e2b2587d0ff2707b1',
      gaugeAddress: '0xdee85272eae1ab4afbc6433f4d819babc9c7045a',
      version: CurveGaugeType.REWARDS_ONLY,
    },
    {
      swapAddress: '0x27e611fd27b276acbd5ffd632e5eaebec9761e40',
      gaugeAddress: '0x8866414733f22295b7563f9c5299715d2d76caf4',
      version: CurveGaugeType.REWARDS_ONLY,
    },
    {
      swapAddress: '0x3ef6a01a0f81d6046290f3e2a8c5b843e738e604',
      gaugeAddress: '0xbdff0c27dd073c119ebcb1299a68a6a92ae607f0',
      version: CurveGaugeType.REWARDS_ONLY,
    },
    {
      swapAddress: '0x0fa949783947bf6c1b171db13aeacbb488845b3f',
      gaugeAddress: '0xd4f94d0aaa640bbb72b5eec2d85f6d114d81a88e',
      version: CurveGaugeType.REWARDS_ONLY,
    },
    {
      swapAddress: '0x4fc8d635c3cb1d0aa123859e2b2587d0ff2707b1',
      gaugeAddress: '0xdee85272eae1ab4afbc6433f4d819babc9c7045a',
      version: CurveGaugeType.REWARDS_ONLY,
    },
    {
      swapAddress: '0x3a1659ddcf2339be3aea159ca010979fb49155ff',
      gaugeAddress: '0x00702bbdead24c40647f235f15971db0867f6bdb',
      version: CurveGaugeType.REWARDS_ONLY,
    },
  ],
  [Network.GNOSIS_MAINNET]: [
    {
      swapAddress: '0x7f90122bf0700f9e7e1f688fe926940e8839f353',
      gaugeAddress: '0x78cf256256c8089d68cde634cf7cdefb39286470',
      version: CurveGaugeType.REWARDS_ONLY,
    },
  ],
  [Network.HARMONY_MAINNET]: [
    {
      swapAddress: '0xc5cfada84e902ad92dd40194f0883ad49639b023',
      gaugeAddress: '0xbf7e49483881c76487b0989cd7d9a8239b20ca41',
      version: CurveGaugeType.REWARDS_ONLY,
    },
    {
      swapAddress: '0x0e3dc2bcbfea84072a0c794b7653d3db364154e0',
      gaugeAddress: '0xf98450b5602fa59cc66e1379dffb6fddc724cfc4',
      version: CurveGaugeType.REWARDS_ONLY,
    },
  ],
  [Network.OPTIMISM_MAINNET]: [
    {
      swapAddress: '0x1337bedc9d22ecbe766df105c9623922a27963ec',
      gaugeAddress: '0x7f90122bf0700f9e7e1f688fe926940e8839f353',
      version: CurveGaugeType.REWARDS_ONLY,
    },
  ],
  [Network.POLYGON_MAINNET]: [
    {
      swapAddress: '0x445fe580ef8d70ff569ab36e80c647af338db351',
      gaugeAddress: '0x19793b454d3afc7b454f206ffe95ade26ca6912c',
      version: CurveGaugeType.REWARDS_ONLY,
    },
    {
      swapAddress: '0xc2d95eef97ec6c17551d45e77b590dc1f9117c67',
      gaugeAddress: '0xffbacce0cc7c19d46132f1258fc16cf6871d153c',
      version: CurveGaugeType.REWARDS_ONLY,
    },
    {
      swapAddress: '0xb446bf7b8d6d4276d0c75ec0e3ee8dd7fe15783a',
      gaugeAddress: '0x40c0e9376468b4f257d15f8c47e5d0c646c28880',
      version: CurveGaugeType.REWARDS_ONLY,
    },
    {
      swapAddress: '0x751b1e21756bdbc307cbcc5085c042a0e9aaef36',
      gaugeAddress: '0xb0a366b987d77b5ed5803cbd95c80bb6deab48c0',
      version: CurveGaugeType.REWARDS_ONLY,
    },
    {
      swapAddress: '0x92577943c7ac4accb35288ab2cc84d75fec330af',
      gaugeAddress: '0x9bd996db02b3f271c6533235d452a56bc2cd195a',
      version: CurveGaugeType.REWARDS_ONLY,
    },
    {
      swapAddress: '0x92215849c439e1f8612b6646060b4e3e5ef822cc',
      gaugeAddress: '0x3b6b158a76fd8ccc297538f454ce7b4787778c7c',
      version: CurveGaugeType.REWARDS_ONLY,
    },
  ],
};
