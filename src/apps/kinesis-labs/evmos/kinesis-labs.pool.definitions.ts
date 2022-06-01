import { CurvePoolDefinition } from '~apps/curve/curve.types';

export const KINESIS_LABS_BASEPOOL_DEFINITIONS: CurvePoolDefinition[] = [
  // Nomad Base Pool madUSDC/madUSDT/FRAX
  {
    swapAddress: '0x49b97224655AaD13832296b8f6185231AFB8aaCc',
    tokenAddress: '0xfB25679ff0651cde4Cf58887be266B68326dDaB6',
  },
  // Celer Base Pool celerUSDC/celerUSDT/FRAX
  {
    swapAddress: '0xbBD5a7AE45a484BD8dAbdfeeeb33E4b859D2c95C',
    tokenAddress: '0xF6b65B88A9e7846ED0DE503E682cC230F892C2fa',
  },
];
