import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  AcrossHubPoolV2__factory,
  AcrossPoolV1__factory,
  AcrossPoolV2__factory,
  AcrossStaking__factory,
} from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class AcrossContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  acrossHubPoolV2({ address, network }: ContractOpts) {
    return AcrossHubPoolV2__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  acrossPoolV1({ address, network }: ContractOpts) {
    return AcrossPoolV1__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  acrossPoolV2({ address, network }: ContractOpts) {
    return AcrossPoolV2__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  acrossStaking({ address, network }: ContractOpts) {
    return AcrossStaking__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { AcrossHubPoolV2 } from './ethers';
export type { AcrossPoolV1 } from './ethers';
export type { AcrossPoolV2 } from './ethers';
export type { AcrossStaking } from './ethers';
