import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  RamsesBribe__factory,
  RamsesGauge__factory,
  RamsesPool__factory,
  RamsesRewards__factory,
  RamsesVe__factory,
  RamsesVoter__factory,
} from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class RamsesContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  ramsesBribe({ address, network }: ContractOpts) {
    return RamsesBribe__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  ramsesGauge({ address, network }: ContractOpts) {
    return RamsesGauge__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  ramsesPool({ address, network }: ContractOpts) {
    return RamsesPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  ramsesRewards({ address, network }: ContractOpts) {
    return RamsesRewards__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  ramsesVe({ address, network }: ContractOpts) {
    return RamsesVe__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  ramsesVoter({ address, network }: ContractOpts) {
    return RamsesVoter__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { RamsesBribe } from './ethers';
export type { RamsesGauge } from './ethers';
export type { RamsesPool } from './ethers';
export type { RamsesRewards } from './ethers';
export type { RamsesVe } from './ethers';
export type { RamsesVoter } from './ethers';
