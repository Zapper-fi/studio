import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { LodestarV0Comptroller__factory, LodestarV0IToken__factory, LodestarV0Lens__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class LodestarV0ContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  lodestarV0Comptroller({ address, network }: ContractOpts) {
    return LodestarV0Comptroller__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  lodestarV0IToken({ address, network }: ContractOpts) {
    return LodestarV0IToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  lodestarV0Lens({ address, network }: ContractOpts) {
    return LodestarV0Lens__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { LodestarV0Comptroller } from './ethers';
export type { LodestarV0IToken } from './ethers';
export type { LodestarV0Lens } from './ethers';
