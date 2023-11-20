import { Network } from '~types';

export const POOL_WITH_MULTIPLE_WINNERS_BUILDERS: Partial<Record<Network, { address: string; blockNumber: number }[]>> =
  {
    [Network.ETHEREUM_MAINNET]: [
      // v3.4.3
      {
        address: '0xad1c620137fa76f520f9a39daacd7b008d7d2f2d',
        blockNumber: 12841079,
      },
      // v3.3.8
      {
        address: '0xd1e536939f637fc12f29c304c406377c9f77e28c',
        blockNumber: 12247765,
      },
      // v3.3.5
      {
        address: '0x39e2f33ff4ad3491106b3bb15dc66ebe24e4e9c7',
        blockNumber: 12065408,
      },
      // v3.3.0
      {
        address: '0xda64816f76bea59cde1ecbe5a094f6c56a7f9770',
        blockNumber: 11968276,
      },
      // v3.2.0
      {
        address: '0x8f2450023ca7e6c1bf361451ab2dceb32b3bb27d',
        blockNumber: 11870076,
      },
      // v3.1.0
      {
        address: '0xbeb9d5538f6454d6ca82e9e901453986abda1e7a',
        blockNumber: 11429041,
      },
    ],
    [Network.BINANCE_SMART_CHAIN_MAINNET]: [
      // 3.4.3
      {
        address: '0xba79b0ac8818e1515f51fef240f4228f29f64948',
        blockNumber: 9218921,
      },
      // 3.3.7
      {
        address: '0x6dc7ca9e2c19da475b39cce7437994c1725d85c9',
        blockNumber: 6114878,
      },
    ],
    [Network.POLYGON_MAINNET]: [
      // 3.4.3
      {
        address: '0x920bd7c30b36c958fae800ee07660e6a56b86a2c',
        blockNumber: 16940744,
      },
      // 3.3.8
      {
        address: '0x5effa0823e486a5ed1d49d88a1374fc337e1f9f4',
        blockNumber: 13326178,
      },
      // 3.3.5
      {
        address: '0xa6d1c81a07c080d11a39f151e0ae69543a20e6e5',
        blockNumber: 12175292,
      },
      // 3.3.0
      {
        address: '0xb1d89477d1b505c261bab6e73f08fa834544cd21',
        blockNumber: 11606905,
      },
    ],
  };
