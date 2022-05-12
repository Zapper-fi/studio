import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { AladdinConvexVault__factory } from './ethers';
import { AladdinCrv__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class ConcentratorContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  aladdinConvexVault({ address, network }: ContractOpts) {
    return AladdinConvexVault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  aladdinCrv({ address, network }: ContractOpts) {
    return AladdinCrv__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { AladdinConvexVault } from './ethers';
export type { AladdinCrv } from './ethers';
