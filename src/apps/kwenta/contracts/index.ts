import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { KwentaAccountResolver__factory, KwentaEscrow__factory, KwentaStaking__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class KwentaContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  kwentaAccountResolver({ address, network }: ContractOpts) {
    return KwentaAccountResolver__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  kwentaEscrow({ address, network }: ContractOpts) {
    return KwentaEscrow__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  kwentaStaking({ address, network }: ContractOpts) {
    return KwentaStaking__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { KwentaAccountResolver } from './ethers';
export type { KwentaEscrow } from './ethers';
export type { KwentaStaking } from './ethers';
