import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  GammaStrategiesFactory__factory,
  GammaStrategiesHypervisor__factory,
  GammaStrategiesHypervisorFactory__factory,
  GammaStrategiesQuickswapMasterchef__factory,
  GammaStrategiesUniOpMasterchef__factory,
  GammaStrategiesZyberswapMasterchef__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class GammaStrategiesViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  gammaStrategiesFactory({ address, network }: ContractOpts) {
    return GammaStrategiesFactory__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  gammaStrategiesHypervisor({ address, network }: ContractOpts) {
    return GammaStrategiesHypervisor__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  gammaStrategiesHypervisorFactory({ address, network }: ContractOpts) {
    return GammaStrategiesHypervisorFactory__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  gammaStrategiesQuickswapMasterchef({ address, network }: ContractOpts) {
    return GammaStrategiesQuickswapMasterchef__factory.connect(
      address,
      this.appToolkit.getViemNetworkProvider(network),
    );
  }
  gammaStrategiesUniOpMasterchef({ address, network }: ContractOpts) {
    return GammaStrategiesUniOpMasterchef__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  gammaStrategiesZyberswapMasterchef({ address, network }: ContractOpts) {
    return GammaStrategiesZyberswapMasterchef__factory.connect(
      address,
      this.appToolkit.getViemNetworkProvider(network),
    );
  }
}
