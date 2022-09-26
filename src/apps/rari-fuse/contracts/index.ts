import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { RariFuseComptroller__factory } from './ethers';
import { RariFusePoolLens__factory } from './ethers';
import { RariFusePoolsDirectory__factory } from './ethers';
import { RariFuseToken__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class RariFuseContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  rariFuseComptroller({ address, network }: ContractOpts) {
    return RariFuseComptroller__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  rariFusePoolLens({ address, network }: ContractOpts) {
    return RariFusePoolLens__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  rariFusePoolsDirectory({ address, network }: ContractOpts) {
    return RariFusePoolsDirectory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  rariFuseToken({ address, network }: ContractOpts) {
    return RariFuseToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { RariFuseComptroller } from './ethers';
export type { RariFusePoolLens } from './ethers';
export type { RariFusePoolsDirectory } from './ethers';
export type { RariFuseToken } from './ethers';
