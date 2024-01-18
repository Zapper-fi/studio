import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  SpoolLens__factory,
  SpoolStaking__factory,
  SpoolVault__factory,
  SpoolVospool__factory,
  StrategyRegistry__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class SpoolV2ViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  spoolLens({ address, network }: ContractOpts) {
    return SpoolLens__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  spoolStaking({ address, network }: ContractOpts) {
    return SpoolStaking__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  spoolVault({ address, network }: ContractOpts) {
    return SpoolVault__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  spoolVospool({ address, network }: ContractOpts) {
    return SpoolVospool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  strategyRegistry({ address, network }: ContractOpts) {
    return StrategyRegistry__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
