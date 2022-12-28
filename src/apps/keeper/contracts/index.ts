import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { KeeperJobManager__factory } from './ethers';
import { Klp__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class KeeperContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  keeperJobManager({ address, network }: ContractOpts) {
    return KeeperJobManager__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  klp({ address, network }: ContractOpts) {
    return Klp__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { KeeperJobManager } from './ethers';
export type { Klp } from './ethers';
