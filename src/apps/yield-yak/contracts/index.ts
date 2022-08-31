import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { YieldYakChef__factory } from './ethers';
import { YieldYakVault__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class YieldYakContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  yieldYakChef({ address, network }: ContractOpts) {
    return YieldYakChef__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  yieldYakVault({ address, network }: ContractOpts) {
    return YieldYakVault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { YieldYakChef } from './ethers';
export type { YieldYakVault } from './ethers';
