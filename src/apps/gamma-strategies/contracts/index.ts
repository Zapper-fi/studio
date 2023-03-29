import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  GammaStrategiesFactory__factory,
  GammaStrategiesHypervisor__factory,
  GammaStrategiesHypervisorFactory__factory,
  GammaStrategiesQuickswapMasterchef__factory,
  GammaStrategiesUniOpMasterchef__factory,
  GammaStrategiesZyberswapMasterchef__factory,
  GammaStrategiesZyberswapRewarder__factory,
} from './ethers';

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
  gammaStrategiesQuickswapMasterchef({ address, network }: ContractOpts) {
    return GammaStrategiesQuickswapMasterchef__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  gammaStrategiesUniOpMasterchef({ address, network }: ContractOpts) {
    return GammaStrategiesUniOpMasterchef__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  gammaStrategiesZyberswapMasterchef({ address, network }: ContractOpts) {
    return GammaStrategiesZyberswapMasterchef__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  gammaStrategiesZyberswapRewarder({ address, network }: ContractOpts) {
    return GammaStrategiesZyberswapRewarder__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { GammaStrategiesFactory } from './ethers';
export type { GammaStrategiesHypervisor } from './ethers';
export type { GammaStrategiesHypervisorFactory } from './ethers';
export type { GammaStrategiesQuickswapMasterchef } from './ethers';
export type { GammaStrategiesUniOpMasterchef } from './ethers';
export type { GammaStrategiesZyberswapMasterchef } from './ethers';
export type { GammaStrategiesZyberswapRewarder } from './ethers';
