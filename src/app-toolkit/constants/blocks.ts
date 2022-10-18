import { Network } from '~types/network.interface';

export const BLOCKS_PER_DAY: Record<Network, number> = {
  [Network.ETHEREUM_MAINNET]: 5760,
  [Network.POLYGON_MAINNET]: 43200,
  [Network.BINANCE_SMART_CHAIN_MAINNET]: 17280,
  [Network.ARBITRUM_MAINNET]: 6400,
  [Network.AVALANCHE_MAINNET]: 28800,
  [Network.OPTIMISM_MAINNET]: 0,
  [Network.CELO_MAINNET]: 0,
  [Network.BITCOIN_MAINNET]: 0,
  [Network.FANTOM_OPERA_MAINNET]: 86400,
  [Network.GNOSIS_MAINNET]: 0,
  [Network.MOONRIVER_MAINNET]: 5760,
  [Network.CRONOS_MAINNET]: 17280,
  [Network.AURORA_MAINNET]: 86400,
};
