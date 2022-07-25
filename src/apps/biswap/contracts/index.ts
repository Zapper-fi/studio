import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { BiswapFactory__factory } from './ethers';
import { BiswapMasterchef__factory } from './ethers';
import { BiswapPool__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class BiswapContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  biswapFactory({ address, network }: ContractOpts) {
    return BiswapFactory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  biswapMasterchef({ address, network }: ContractOpts) {
    return BiswapMasterchef__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  biswapPool({ address, network }: ContractOpts) {
    return BiswapPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { BiswapFactory } from './ethers';
export type { BiswapMasterchef } from './ethers';
export type { BiswapPool } from './ethers';
