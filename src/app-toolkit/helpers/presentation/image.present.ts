import { Network } from '~types/network.interface';

export const getTokenImg = (address: string, network: Network = Network.ETHEREUM_MAINNET) => {
  return `https://storage.googleapis.com/zapper-fi-assets/tokens/${network}/${address}.png`;
};

export const getAppImg = (appName: string) => {
  return `https://storage.googleapis.com/zapper-fi-assets/apps/${appName}.png`;
};

export const getNetworkImg = (network: Network) => {
  return `networks/${network}-icon.png`;
};
