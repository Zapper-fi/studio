import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { TenderSwap__factory } from './ethers';
import { TenderToken__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class TenderizeContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  tenderSwap({ address, network }: ContractOpts) {
    return TenderSwap__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  tenderToken({ address, network }: ContractOpts) {
    return TenderToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { TenderSwap } from './ethers';
export type { TenderToken } from './ethers';
