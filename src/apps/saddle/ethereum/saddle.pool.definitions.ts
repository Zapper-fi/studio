import { CurvePoolDefinition } from '~apps/curve/curve.types';

export const SADDLE_POOL_DEFINITIONS: CurvePoolDefinition[] = [
  // Saddle tBTC/wBTC/renBTC/sBTC (BTC Pool v1)
  {
    swapAddress: '0x4f6a43ad7cba042606decaca730d4ce0a57ac62e',
    tokenAddress: '0xc28df698475dec994be00c9c9d8658a548e6304f',
    coinAddresses: [
      '0x8daebade922df735c38c80c7ebd708af50815faa',
      '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
      '0xeb4c2781e4eba804ce9a9803c67d0893436bb27d',
      '0xfe18be6b3bd88a2d2a7f928d00292e7a9963cfc6',
    ],
  },
  // Saddle wBTC/renBTC/sBTC (BTC Pool V2)
  {
    swapAddress: '0xdf3309771d2bf82cb2b6c56f9f5365c8bd97c4f2',
    tokenAddress: '0xf32e91464ca18fc156ab97a697d6f8ae66cd21a3',
    coinAddresses: [
      '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
      '0xeb4c2781e4eba804ce9a9803c67d0893436bb27d',
      '0xfe18be6b3bd88a2d2a7f928d00292e7a9963cfc6',
    ],
  },
  // Saddle DAI/USDC/USDT (v1)
  {
    swapAddress: '0x3911f80530595fbd01ab1516ab61255d75aeb066',
    tokenAddress: '0x76204f8cfe8b95191a3d1cfa59e267ea65e06fac',
    coinAddresses: [
      '0x6b175474e89094c44da98b954eedeac495271d0f',
      '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      '0xdac17f958d2ee523a2206206994597c13d831ec7',
    ],
  },
  // Saddle WETH/vETH2 (v1)
  {
    swapAddress: '0xdec2157831d6abc3ec328291119cc91b337272b5',
    tokenAddress: '0xe37e2a01fea778bc1717d72bd9f018b6a6b241d5',
    coinAddresses: ['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', '0x898bad2774eb97cf6b94605677f43b41871410b1'],
  },
  // Saddle alETH (v2)
  {
    swapAddress: '0xa6018520eaacc06c30ff2e1b3ee2c7c22e64196a',
    tokenAddress: '0xc9da65931abf0ed1b74ce5ad8c041c4220940368',
    coinAddresses: [
      '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      '0x0100546f2cd4c9d97f798ffc9755e47865ff7ee6',
      '0x5e74c9036fb86bd7ecdcb084a0673efc32ea31cb',
    ],
  },
  // Saddle D4 (v2)
  {
    swapAddress: '0xc69ddcd4dfef25d8a793241834d4cc4b3668ead6',
    tokenAddress: '0xd48cf4d7fb0824cc8bae055df3092584d0a1726a',
    coinAddresses: [
      '0xbc6da0fe9ad5f3b0d58160288917aa56653660e9',
      '0x956f47f50a910163d8bf957cf5846d573e7f87ca',
      '0x853d955acef822db058eb8505911ed77f175b99e',
      '0x5f98805a4e8be255a32880fdec7f6728c6568ba0',
    ],
  },
  // Saddle 4Pool
  {
    swapAddress: '0x101cd330d088634b6f64c2eb4276e63bf1bbfde3',
    tokenAddress: '0x1b4ab394327fdf9524632ddf2f0f04f9fa1fe2ec',
    coinAddresses: [
      '0x6b175474e89094c44da98b954eedeac495271d0f',
      '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      '0xdac17f958d2ee523a2206206994597c13d831ec7',
      '0x853d955acef822db058eb8505911ed77f175b99e',
    ],
  },
  // Saddle Frax 3Pool
  {
    swapAddress: '0x8caea59f3bf1f341f89c51607e4919841131e47a',
    tokenAddress: '0x0785addf5f7334adb7ec40cd785ebf39bfd91520',
    coinAddresses: [
      '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      '0xdac17f958d2ee523a2206206994597c13d831ec7',
      '0x853d955acef822db058eb8505911ed77f175b99e',
    ],
  },
  // Saddle tBTCV2/wBTC/renBTC/sBTC (tBTCv2 Metapool V1)
  {
    swapAddress: '0xf74ebe6e5586275dc4ced78f5dbef31b1efbe7a5',
    tokenAddress: '0x122eca07139eb368245a29fb702c9ff11e9693b7',
    coinAddresses: ['0x18084fba666a33d37592fa2633fd49a74dd93a88', '0xf32e91464ca18fc156ab97a697d6f8ae66cd21a3'],
  },
  // Saddle tBTCV2/wBTC/renBTC/sBTC (tBTCv2 Metapool V2)
  {
    swapAddress: '0xa0b4a2667dd60d5cdd7ecff1084f0ceb8dd84326',
    tokenAddress: '0x3f2f811605bc6d701c3ad6e501be13461c560320',
    coinAddresses: ['0x18084fba666a33d37592fa2633fd49a74dd93a88', '0xf32e91464ca18fc156ab97a697d6f8ae66cd21a3'],
  },
];
