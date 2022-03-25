import { Network } from '~types/network.interface';

export interface Contract {
  address: string;
  network: Network;
  appId: string;
  groupId: string;
}

export enum ContractType {
  POSITION = 'contract-position',
  BASE_TOKEN = 'base-token',
  APP_TOKEN = 'app-token',
  NON_FUNGIBLE_TOKEN = 'non-fungible-token',
}
