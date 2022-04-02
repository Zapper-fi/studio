import { ContractType } from '~position/contract.interface';
import { Token } from '~position/position.interface';
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

export const getImagesFromToken = (token: Token): string[] => {
  if (token.type === ContractType.APP_TOKEN) {
    return token.displayProps.images && token.displayProps.images.length
      ? token.displayProps.images
      : [getAppImg(token.appId)];
  }
  return [getTokenImg(token.address, token.network)];
};

export const getLabelFromToken = (token: Token): string => {
  if (token.type === ContractType.APP_TOKEN) {
    return token.displayProps.label;
  }
  return token.symbol;
};
