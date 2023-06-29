import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { VelodromeRewards__factory, VelodromeVe__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class VelodromeV2ContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  velodromeRewards({ address, network }: ContractOpts) {
    return VelodromeRewards__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  velodromeVe({ address, network }: ContractOpts) {
    return VelodromeVe__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { VelodromeRewards } from './ethers';
export type { VelodromeVe } from './ethers';
