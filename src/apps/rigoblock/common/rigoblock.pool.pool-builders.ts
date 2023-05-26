import { Network } from '~types';

export const POOL_BUILDERS: Partial<
  Record<
    Network,
    {
      registryAddress: string;
      tokenWhitelistAddress: string;
      blockNumber: number;
    }[]
  >
> = {
  [Network.ETHEREUM_MAINNET]: [
    {
      registryAddress: '0x06767e8090ba5c4eca89ed00c3a719909d503ed6',
      tokenWhitelistAddress: '0xb43bad2638696f8bc82247b92bd56b8df37d89ab',
      blockNumber: 15817831,
    },
  ],
  [Network.POLYGON_MAINNET]: [
    {
      registryAddress: '0x06767e8090ba5c4eca89ed00c3a719909d503ed6',
      tokenWhitelistAddress: '0xb43bad2638696f8bc82247b92bd56b8df37d89ab',
      blockNumber: 34751673,
    },
  ],
  [Network.ARBITRUM_MAINNET]: [
    {
      registryAddress: '0x06767e8090ba5c4eca89ed00c3a719909d503ed6',
      tokenWhitelistAddress: '0xb43bad2638696f8bc82247b92bd56b8df37d89ab',
      blockNumber: 32290603,
    },
  ],
  [Network.OPTIMISM_MAINNET]: [
    {
      registryAddress: '0x06767e8090ba5c4eca89ed00c3a719909d503ed6',
      tokenWhitelistAddress: '0xb43bad2638696f8bc82247b92bd56b8df37d89ab',
      blockNumber: 31239008,
    },
  ],
};
