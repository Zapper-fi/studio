import { Network } from '~types/network.interface';

export const DEFAULT_REGISTRY: Record<Exclude<Network, Network.BITCOIN_MAINNET>, string> = {
  [Network.ARBITRUM_MAINNET]: 'https://arb-mainnet-public.unifra.io',
  [Network.AVALANCHE_MAINNET]: 'https://avalanche.public-rpc.com',
  [Network.BINANCE_SMART_CHAIN_MAINNET]: 'https://bsc-dataseed.binance.org/',
  [Network.CELO_MAINNET]: 'https://forno.celo.org',
  [Network.ETHEREUM_MAINNET]: 'https://eth.llamarpc.com',
  [Network.FANTOM_OPERA_MAINNET]: 'https://rpc.ftm.tools/',
  [Network.GNOSIS_MAINNET]: 'https://rpc.gnosischain.com/',
  [Network.HARMONY_MAINNET]: 'https://harmony.public-rpc.com',
  [Network.MOONRIVER_MAINNET]: 'https://rpc.moonriver.moonbeam.network',
  [Network.OPTIMISM_MAINNET]: 'https://mainnet.optimism.io',
  [Network.POLYGON_MAINNET]: 'https://polygon-rpc.com',
  [Network.CRONOS_MAINNET]: 'https://evm-cronos.crypto.org',
  [Network.AURORA_MAINNET]: 'https://mainnet.aurora.dev',
  [Network.EVMOS_MAINNET]: 'https://eth.bd.evmos.org:8545',
  [Network.BASE_MAINNET]: 'https://developer-access-mainnet.base.org',
};
