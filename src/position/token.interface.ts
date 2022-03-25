import { Network } from '~types/network.interface';

import { ContractType } from './contract.interface';

export interface AbstractToken {
  address: string;
  network: Network;
  price: number;
  symbol: string;
  decimals: number;
}

export interface BaseToken extends AbstractToken {
  type: ContractType.BASE_TOKEN;
}
