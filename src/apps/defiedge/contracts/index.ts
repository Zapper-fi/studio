import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { MiniChefV2__factory, Strategy__factory } from './ethers';
// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class DefiedgeContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  miniChefV2({ address, network }: ContractOpts) {
    return MiniChefV2__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  strategy({ address, network }: ContractOpts) {
    return Strategy__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { MiniChefV2 } from './ethers';
export type { Strategy } from './ethers';
