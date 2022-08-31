import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { GammaStrategiesFactory__factory } from './ethers';
import { GammaStrategiesHypervisor__factory } from './ethers';
import { GammaStrategiesHypervisorFactory__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class GammaStrategiesContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  gammaStrategiesFactory({ address, network }: ContractOpts) {
    return GammaStrategiesFactory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  gammaStrategiesHypervisor({ address, network }: ContractOpts) {
    return GammaStrategiesHypervisor__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  gammaStrategiesHypervisorFactory({ address, network }: ContractOpts) {
    return GammaStrategiesHypervisorFactory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { GammaStrategiesFactory } from './ethers';
export type { GammaStrategiesHypervisor } from './ethers';
export type { GammaStrategiesHypervisorFactory } from './ethers';
