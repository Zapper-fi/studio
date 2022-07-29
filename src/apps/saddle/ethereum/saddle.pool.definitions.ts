import { CurvePoolDefinition } from '~apps/curve/curve.types';

export const SADDLE_POOL_DEFINITIONS: CurvePoolDefinition[] = [
  // Saddle tBTC/wBTC/renBTC/sBTC (BTC Pool v1)
  {
    swapAddress: '0x4f6a43ad7cba042606decaca730d4ce0a57ac62e',
    tokenAddress: '0xc28df698475dec994be00c9c9d8658a548e6304f',
  },
  // Saddle wBTC/renBTC/sBTC (BTC Pool V2)
  {
    swapAddress: '0xdf3309771d2bf82cb2b6c56f9f5365c8bd97c4f2',
    tokenAddress: '0xf32e91464ca18fc156ab97a697d6f8ae66cd21a3',
  },
  // Saddle DAI/USDC/USDT (v1)
  {
    swapAddress: '0x3911f80530595fbd01ab1516ab61255d75aeb066',
    tokenAddress: '0x76204f8cfe8b95191a3d1cfa59e267ea65e06fac',
  },
  // Saddle WETH/vETH2 (v1)
  {
    swapAddress: '0xdec2157831d6abc3ec328291119cc91b337272b5',
    tokenAddress: '0xe37e2a01fea778bc1717d72bd9f018b6a6b241d5',
  },
  // Saddle alETH (v2)
  {
    swapAddress: '0xa6018520eaacc06c30ff2e1b3ee2c7c22e64196a',
    tokenAddress: '0xc9da65931abf0ed1b74ce5ad8c041c4220940368',
  },
  // Saddle D4 (v2)
  {
    swapAddress: '0xc69ddcd4dfef25d8a793241834d4cc4b3668ead6',
    tokenAddress: '0xd48cf4d7fb0824cc8bae055df3092584d0a1726a',
  },
  // Saddle 4Pool
  {
    swapAddress: '0x101cd330d088634b6f64c2eb4276e63bf1bbfde3',
    tokenAddress: '0x1b4ab394327fdf9524632ddf2f0f04f9fa1fe2ec',
  },
  // Saddle Frax 3Pool
  {
    swapAddress: '0x8caea59f3bf1f341f89c51607e4919841131e47a',
    tokenAddress: '0x0785addf5f7334adb7ec40cd785ebf39bfd91520',
  },
  // Saddle tBTCV2/wBTC/renBTC/sBTC (tBTCv2 Metapool V1)
  {
    swapAddress: '0xf74ebe6e5586275dc4ced78f5dbef31b1efbe7a5',
    tokenAddress: '0x122eca07139eb368245a29fb702c9ff11e9693b7',
  },
  // Saddle tBTCV2/wBTC/renBTC/sBTC (tBTCv2 Metapool V2)
  {
    swapAddress: '0xa0b4a2667dd60d5cdd7ecff1084f0ceb8dd84326',
    tokenAddress: '0x3f2f811605bc6d701c3ad6e501be13461c560320',
  },
];
