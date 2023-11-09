import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { InsuracePoolToken__factory, InsuraceStakersPoolV2__factory } from './ethers';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class InsuraceContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  insuracePoolToken({ address, network }: ContractOpts) {
    return InsuracePoolToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  insuraceStakersPoolV2({ address, network }: ContractOpts) {
    return InsuraceStakersPoolV2__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { InsuracePoolToken } from './ethers';
export type { InsuraceStakersPoolV2 } from './ethers';
