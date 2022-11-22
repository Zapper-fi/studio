import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { TetuBookkeeper__factory } from './ethers';
import { TetuYieldVault__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class TetuContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  tetuBookkeeper({ address, network }: ContractOpts) {
    return TetuBookkeeper__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  tetuYieldVault({ address, network }: ContractOpts) {
    return TetuYieldVault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { TetuBookkeeper } from './ethers';
export type { TetuYieldVault } from './ethers';
