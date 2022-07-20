import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { ArrakisGelatoPool__factory } from './ethers';
import { ArrakisPool__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class ArrakisContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  arrakisGelatoPool({ address, network }: ContractOpts) {
    return ArrakisGelatoPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  arrakisPool({ address, network }: ContractOpts) {
    return ArrakisPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { ArrakisGelatoPool } from './ethers';
export type { ArrakisPool } from './ethers';
