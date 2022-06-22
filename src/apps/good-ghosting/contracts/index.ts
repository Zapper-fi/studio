import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { GoodghostingAbiV001__factory } from './ethers';
import { GoodghostingAbiV002__factory } from './ethers';
import { GoodghostingAbiV003__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class GoodGhostingContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  goodghostingAbiV001({ address, network }: ContractOpts) {
    return GoodghostingAbiV001__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  goodghostingAbiV002({ address, network }: ContractOpts) {
    return GoodghostingAbiV002__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  goodghostingAbiV003({ address, network }: ContractOpts) {
    return GoodghostingAbiV003__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { GoodghostingAbiV001 } from './ethers';
export type { GoodghostingAbiV002 } from './ethers';
export type { GoodghostingAbiV003 } from './ethers';
