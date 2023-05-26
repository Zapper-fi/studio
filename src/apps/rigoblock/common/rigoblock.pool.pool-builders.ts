import { Network } from '~types';

export const POOL_BUILDERS: Partial<Record<Network, {
    registryAddress: string; tokenWhitelistAddress: string; blockNumber: number
}[]>> =
  {
    [Network.ETHEREUM_MAINNET]: [
      {
        registryAddress: '0x06767e8090bA5c4Eca89ED00C3A719909D503ED6',
        tokenWhitelistAddress: '0xB43baD2638696F8bC82247B92bD56B8DF37d89aB',
        blockNumber: 15817831,
      },
    ],
    [Network.POLYGON_MAINNET]: [
      {
        registryAddress: '0x06767e8090bA5c4Eca89ED00C3A719909D503ED6',
        tokenWhitelistAddress: '0xB43baD2638696F8bC82247B92bD56B8DF37d89aB',
        blockNumber: 34751673,
      },
    ],
    [Network.ARBITRUM_MAINNET]: [
      {
        registryAddress: '0x06767e8090bA5c4Eca89ED00C3A719909D503ED6',
        tokenWhitelistAddress: '0xB43baD2638696F8bC82247B92bD56B8DF37d89aB',
        blockNumber: 32290603,
      },
    ],
    [Network.OPTIMISM_MAINNET]: [
      {
        registryAddress: '0x06767e8090bA5c4Eca89ED00C3A719909D503ED6',
        tokenWhitelistAddress: '0xB43baD2638696F8bC82247B92bD56B8DF37d89aB',
        blockNumber: 31239008,
      },
    ],
  };
