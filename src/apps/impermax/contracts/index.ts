import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { Borrowable__factory } from './ethers';
import { Factory__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class ImpermaxContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  borrowable({ address, network }: ContractOpts) {
    return Borrowable__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  factory({ address, network }: ContractOpts) {
    return Factory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { Borrowable } from './ethers';
export type { Factory } from './ethers';
