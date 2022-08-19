import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { Launchpool__factory } from './ethers';
import { Vault__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class VaporwaveFinanceContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  launchpool({ address, network }: ContractOpts) {
    return Launchpool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  vault({ address, network }: ContractOpts) {
    return Vault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { Launchpool } from './ethers';
export type { Vault } from './ethers';
