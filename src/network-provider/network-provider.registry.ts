import { Network } from '~types/network.interface';

export const DEFAULT_REGISTRY: Record<Extract<Network, Network.ETHEREUM_MAINNET>, string> = {
  [Network.ETHEREUM_MAINNET]: 'https://nodes.mewapi.io/rpc/eth',
};
