import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { VaporwaveLaunchpool__factory, VaporwaveVault__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class VaporwaveFinanceContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  vaporwaveLaunchpool({ address, network }: ContractOpts) {
    return VaporwaveLaunchpool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  vaporwaveVault({ address, network }: ContractOpts) {
    return VaporwaveVault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { VaporwaveLaunchpool } from './ethers';
export type { VaporwaveVault } from './ethers';
