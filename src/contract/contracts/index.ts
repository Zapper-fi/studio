import { StaticJsonRpcProvider } from '@ethersproject/providers';

import { Network } from '~types/network.interface';

import { Erc1155, Erc1155__factory, Erc20, Erc721, Multicall } from './ethers';
import { Erc20__factory } from './ethers';
import { Erc721__factory } from './ethers';
import { Multicall__factory } from './ethers';

type ContractOpts = { address: string; network: Network };
type NetworkProviderResolver = (network: Network) => StaticJsonRpcProvider;

export interface IContractFactory {
  erc1155(opts: ContractOpts): Erc1155;
  erc20(opts: ContractOpts): Erc20;
  erc721(opts: ContractOpts): Erc721;
  multicall(opts: ContractOpts): Multicall;
}

export class ContractFactory implements IContractFactory {
  constructor(protected readonly networkProviderResolver: NetworkProviderResolver) {}

  erc1155({ address, network }: ContractOpts) {
    return Erc1155__factory.connect(address, this.networkProviderResolver(network));
  }
  erc20({ address, network }: ContractOpts) {
    return Erc20__factory.connect(address, this.networkProviderResolver(network));
  }
  erc721({ address, network }: ContractOpts) {
    return Erc721__factory.connect(address, this.networkProviderResolver(network));
  }
  multicall({ address, network }: ContractOpts) {
    return Multicall__factory.connect(address, this.networkProviderResolver(network));
  }
}

export type { Erc1155, Erc20, Erc721, Multicall };
