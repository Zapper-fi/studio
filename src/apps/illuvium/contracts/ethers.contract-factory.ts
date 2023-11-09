import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  IlluviumCorePool__factory,
  IlluviumIlvPoolV2__factory,
  IlluviumSIlv2__factory,
  IlluviumSushiLpPoolV2__factory,
} from './ethers';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class IlluviumContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  illuviumCorePool({ address, network }: ContractOpts) {
    return IlluviumCorePool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  illuviumIlvPoolV2({ address, network }: ContractOpts) {
    return IlluviumIlvPoolV2__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  illuviumSIlv2({ address, network }: ContractOpts) {
    return IlluviumSIlv2__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  illuviumSushiLpPoolV2({ address, network }: ContractOpts) {
    return IlluviumSushiLpPoolV2__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { IlluviumCorePool } from './ethers';
export type { IlluviumIlvPoolV2 } from './ethers';
export type { IlluviumSIlv2 } from './ethers';
export type { IlluviumSushiLpPoolV2 } from './ethers';
