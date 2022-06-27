import { CurvePoolDefinition } from '../curve.types';

export const CURVE_V1_POOL_DEFINITIONS: CurvePoolDefinition[] = [
  {
    queryKey: 'aave',
    label: 'Aave 3Pool',
    swapAddress: '0x445fe580ef8d70ff569ab36e80c647af338db351',
    tokenAddress: '0xe7a24ef0c5e95ffb0f6684b813a78f2a3ad7d171',
    gaugeAddress: '0x19793b454d3afc7b454f206ffe95ade26ca6912c',
    streamAddress: '0xc48f4653dd6a9509de44c92beb0604bea3aee714',
  },
  {
    queryKey: 'renBTC',
    swapAddress: '0xc2d95eef97ec6c17551d45e77b590dc1f9117c67',
    tokenAddress: '0xf8a57c1d3b9629b77b6726a042ca48990a84fb49',
    gaugeAddress: '0xffbacce0cc7c19d46132f1258fc16cf6871d153c',
    streamAddress: '0x488e6ef919c2bb9de535c634a80afb0114da8f62',
  },
];

export const CURVE_V2_POOL_DEFINITIONS: CurvePoolDefinition[] = [
  {
    queryKey: 'eurtusd',
    swapAddress: '0xb446bf7b8d6d4276d0c75ec0e3ee8dd7fe15783a',
    tokenAddress: '0x600743b1d8a96438bd46836fd34977a00293f6aa',
    gaugeAddress: '0x40c0e9376468b4f257d15f8c47e5d0c646c28880',
    streamAddress: '0xaf78381216a8ecc7ad5957f3cd12a431500e0b0d',
  },
  {
    queryKey: 'atricrypto',
    label: 'Aave TriCrypto',
    swapAddress: '0x751b1e21756bdbc307cbcc5085c042a0e9aaef36',
    tokenAddress: '0x8096ac61db23291252574d49f036f0f9ed8ab390',
    gaugeAddress: '0xb0a366b987d77b5ed5803cbd95c80bb6deab48c0',
  },
  {
    queryKey: 'atricrypto2',
    label: 'Aave TriCrypto2',
    swapAddress: '0x92577943c7ac4accb35288ab2cc84d75fec330af',
    tokenAddress: '0xbece5d20a8a104c54183cc316c8286e3f00ffc71',
    gaugeAddress: '0x9bd996db02b3f271c6533235d452a56bc2cd195a',
  },
  {
    queryKey: 'atricrypto3',
    label: 'Aave TriCrypto3',
    swapAddress: '0x92215849c439e1f8612b6646060b4e3e5ef822cc',
    tokenAddress: '0xdad97f7713ae9437fa9249920ec8507e5fbb23d3',
    gaugeAddress: '0x3b6b158a76fd8ccc297538f454ce7b4787778c7c',
    streamAddress: '0x060e386ecfbacf42aa72171af9efe17b3993fc4f',
  },
  {
    queryKey: 'mai3pool3crv',
    label: 'MAI-3Pool',
    swapAddress: '0x447646e84498552e62ecf097cc305eabfff09308',
    tokenAddress: '0x447646e84498552e62ecf097cc305eabfff09308',
  },
];
