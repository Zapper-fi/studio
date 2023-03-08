import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import {
  Erc1155,
  Erc1155__factory,
  Erc20,
  Erc20__factory,
  Erc4626,
  Erc4626__factory,
  Erc721,
  Erc721__factory,
  Multicall,
  Multicall__factory,
} from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };
type NetworkProviderResolver = (network: Network) => StaticJsonRpcProvider;

export interface IContractFactory {
  erc1155(opts: ContractOpts): Erc1155;
  erc20(opts: ContractOpts): Erc20;
  erc4626(opts: ContractOpts): Erc4626;
  erc721(opts: ContractOpts): Erc721;
  multicall(opts: ContractOpts): Multicall;
}

@Injectable()
export class ContractFactory implements IContractFactory {
  constructor(protected readonly networkProviderResolver: NetworkProviderResolver) {}

  erc1155({ address, network }: ContractOpts) {
    return Erc1155__factory.connect(address, this.networkProviderResolver(network));
  }
  erc20({ address, network }: ContractOpts) {
    return Erc20__factory.connect(address, this.networkProviderResolver(network));
  }
  erc4626({ address, network }: ContractOpts) {
    return Erc4626__factory.connect(address, this.networkProviderResolver(network));
  }
  erc721({ address, network }: ContractOpts) {
    return Erc721__factory.connect(address, this.networkProviderResolver(network));
  }
  multicall({ address, network }: ContractOpts) {
    return Multicall__factory.connect(address, this.networkProviderResolver(network));
  }
}

export type { Erc1155 } from './ethers';
export type { Erc20 } from './ethers';
export type { Erc4626 } from './ethers';
export type { Erc721 } from './ethers';
export type { Multicall } from './ethers';
