import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { MoonrockToken__factory } from './ethers';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class MoonrockContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  moonrockToken({ address, network }: ContractOpts) {
    return MoonrockToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { MoonrockToken } from './ethers';
