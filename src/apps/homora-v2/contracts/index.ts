import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { CyToken__factory } from './ethers';
import { HomoraBank__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class HomoraV2ContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  cyToken({ address, network }: ContractOpts) {
    return CyToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  homoraBank({ address, network }: ContractOpts) {
    return HomoraBank__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { CyToken } from './ethers';
export type { HomoraBank } from './ethers';
