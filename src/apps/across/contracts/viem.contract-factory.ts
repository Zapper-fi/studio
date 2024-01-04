import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { AcrossHubPoolV2__factory, AcrossPoolV2__factory, AcrossStaking__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class AcrossViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  acrossHubPoolV2({ address, network }: ContractOpts) {
    return AcrossHubPoolV2__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  acrossPoolV2({ address, network }: ContractOpts) {
    return AcrossPoolV2__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  acrossStaking({ address, network }: ContractOpts) {
    return AcrossStaking__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
