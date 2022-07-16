import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { EvmoswapFactory__factory } from './ethers';
import { EvmoswapMasterchef__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class EvmoswapContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  evmoswapFactory({ address, network }: ContractOpts) {
    return EvmoswapFactory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  evmoswapMasterchef({ address, network }: ContractOpts) {
    return EvmoswapMasterchef__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { EvmoswapFactory } from './ethers';
export type { EvmoswapMasterchef } from './ethers';
