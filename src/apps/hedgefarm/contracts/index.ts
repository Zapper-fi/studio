import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { AlphaOne__factory, AlphaTwo__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class HedgefarmContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  alphaOne({ address, network }: ContractOpts) {
    return AlphaOne__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  alphaTwo({ address, network }: ContractOpts) {
    return AlphaTwo__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { AlphaOne } from './ethers';
export type { AlphaTwo } from './ethers';
