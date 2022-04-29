import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { Stakingv2__factory, Stakingv3__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class AirswapContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  stakingV2({ address, network }: ContractOpts) {
    return Stakingv2__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }

  stakingV3({ address, network }: ContractOpts) {
    return Stakingv3__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { Stakingv2 } from './ethers';
