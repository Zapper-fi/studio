import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { BarnbridgeSmartAlphaPool__factory } from './ethers';
import { BarnbridgeSmartAlphaToken__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class BarnbridgeSmartAlphaContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  barnbridgeSmartAlphaPool({ address, network }: ContractOpts) {
    return BarnbridgeSmartAlphaPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  barnbridgeSmartAlphaToken({ address, network }: ContractOpts) {
    return BarnbridgeSmartAlphaToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { BarnbridgeSmartAlphaPool } from './ethers';
export type { BarnbridgeSmartAlphaToken } from './ethers';
