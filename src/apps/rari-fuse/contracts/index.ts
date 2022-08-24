import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { RariFusePoolLens__factory } from './ethers';
import { RariFusePoolsDirectory__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class RariFuseContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  rariFusePoolLens({ address, network }: ContractOpts) {
    return RariFusePoolLens__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  rariFusePoolsDirectory({ address, network }: ContractOpts) {
    return RariFusePoolsDirectory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { RariFusePoolLens } from './ethers';
export type { RariFusePoolsDirectory } from './ethers';
