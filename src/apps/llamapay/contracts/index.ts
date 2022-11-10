import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { Llamapay__factory } from './ethers';
import { LlamapayFactory__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class LlamapayContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  llamapay({ address, network }: ContractOpts) {
    return Llamapay__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  llamapayFactory({ address, network }: ContractOpts) {
    return LlamapayFactory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { Llamapay } from './ethers';
export type { LlamapayFactory } from './ethers';
