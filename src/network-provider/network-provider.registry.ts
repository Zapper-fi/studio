import { Network } from '~types/network.interface';

export const DEFAULT_REGISTRY: Record<
  Extract<
    Network,
    | Network.ARBITRUM_MAINNET
    | Network.AVALANCHE_MAINNET
    | Network.BINANCE_SMART_CHAIN_MAINNET
    | Network.CELO_MAINNET
    | Network.ETHEREUM_MAINNET
    | Network.FANTOM_OPERA_MAINNET
    | Network.GNOSIS_MAINNET
    | Network.HARMONY_MAINNET
    | Network.MOONRIVER_MAINNET
    | Network.OPTIMISM_MAINNET
    | Network.POLYGON_MAINNET
  >,
  string
> = {
  [Network.ARBITRUM_MAINNET]: 'https://arbitrum.public-rpc.com',
  [Network.AVALANCHE_MAINNET]: 'https://avalanche.public-rpc.com',
  [Network.BINANCE_SMART_CHAIN_MAINNET]: 'https://bsc-dataseed.binance.org/',
  [Network.CELO_MAINNET]: 'https://forno.celo.org',
  [Network.ETHEREUM_MAINNET]: 'https://nodes.mewapi.io/rpc/eth',
  [Network.FANTOM_OPERA_MAINNET]: 'https://rpc.ftm.tools/',
  [Network.GNOSIS_MAINNET]: 'https://rpc.gnosischain.com/',
  [Network.HARMONY_MAINNET]: 'https://harmony.public-rpc.com',
  [Network.MOONRIVER_MAINNET]: 'https://rpc.moonriver.moonbeam.network',
  [Network.OPTIMISM_MAINNET]: 'https://mainnet.optimism.io',
  [Network.POLYGON_MAINNET]: 'https://polygon-rpc.com ',
};
