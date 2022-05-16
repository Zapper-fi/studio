import { CurvePoolDefinition } from '../curve.types';

export const CURVE_V1_POOL_DEFINITIONS: CurvePoolDefinition[] = [
  {
    queryKey: 'aave',
    label: 'Aave 3Pool Curve',
    swapAddress: '0x445fe580ef8d70ff569ab36e80c647af338db351',
    tokenAddress: '0xe7a24ef0c5e95ffb0f6684b813a78f2a3ad7d171',
    gaugeAddress: '0x20759f567bb3ecdb55c817c9a1d13076ab215edc',
    streamAddress: '0x20759f567bb3ecdb55c817c9a1d13076ab215edc',
  },
  {
    queryKey: 'renBTC',
    label: 'renBTC Curve',
    swapAddress: '0xc2d95eef97ec6c17551d45e77b590dc1f9117c67',
    tokenAddress: '0xf8a57c1d3b9629b77b6726a042ca48990a84fb49',
    gaugeAddress: '0x8d9649e50a0d1da8e939f800fb926cde8f18b47d',
    streamAddress: '0x8d9649e50a0d1da8e939f800fb926cde8f18b47d',
  },
];

export const CURVE_V2_POOL_DEFINITIONS: CurvePoolDefinition[] = [
  {
    queryKey: 'eurtusd',
    label: 'EURT-USD Curve',
    swapAddress: '0xb446bf7b8d6d4276d0c75ec0e3ee8dd7fe15783a',
    tokenAddress: '0x600743b1d8a96438bd46836fd34977a00293f6aa',
    gaugeAddress: '0x8b397084699cc64e429f610f81fac13bf061ef55',
    streamAddress: '0x8b397084699cc64e429f610f81fac13bf061ef55',
  },
  {
    queryKey: 'atricrypto',
    label: 'Aave TriCrypto Curve',
    swapAddress: '0x751b1e21756bdbc307cbcc5085c042a0e9aaef36',
    tokenAddress: '0x8096ac61db23291252574d49f036f0f9ed8ab390',
    gaugeAddress: '0xb0a366b987d77b5ed5803cbd95c80bb6deab48c0',
  },
  {
    queryKey: 'atricrypto2',
    label: 'Aave TriCrypto2 Curve',
    swapAddress: '0x92577943c7ac4accb35288ab2cc84d75fec330af',
    tokenAddress: '0xbece5d20a8a104c54183cc316c8286e3f00ffc71',
    gaugeAddress: '0x9bd996db02b3f271c6533235d452a56bc2cd195a',
  },
  {
    queryKey: 'atricrypto3',
    label: 'Aave TriCrypto3 Curve',
    swapAddress: '0x92215849c439e1f8612b6646060b4e3e5ef822cc',
    tokenAddress: '0xdad97f7713ae9437fa9249920ec8507e5fbb23d3',
    gaugeAddress: '0xbb1b19495b8fe7c402427479b9ac14886cbbaaee',
    streamAddress: '0xbb1b19495b8fe7c402427479b9ac14886cbbaaee',
  },
  {
    queryKey: 'mai3pool3crv',
    label: 'MAI-3Pool Curve',
    swapAddress: '0x447646e84498552e62ecf097cc305eabfff09308',
    tokenAddress: '0x447646e84498552e62ecf097cc305eabfff09308',
  },
];
