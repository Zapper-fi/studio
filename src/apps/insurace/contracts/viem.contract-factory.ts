import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { InsuracePoolToken__factory, InsuraceStakersPoolV2__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class InsuraceViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  insuracePoolToken({ address, network }: ContractOpts) {
    return InsuracePoolToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  insuraceStakersPoolV2({ address, network }: ContractOpts) {
    return InsuraceStakersPoolV2__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
