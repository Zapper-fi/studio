import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  RadiantCapitalDataProvider__factory,
  RadiantCapitalLendingProvider__factory,
  RadiantCapitalPlatformFees__factory,
  RadiantCapitalStaking__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class RadiantCapitalViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  radiantCapitalDataProvider({ address, network }: ContractOpts) {
    return RadiantCapitalDataProvider__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  radiantCapitalLendingProvider({ address, network }: ContractOpts) {
    return RadiantCapitalLendingProvider__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  radiantCapitalPlatformFees({ address, network }: ContractOpts) {
    return RadiantCapitalPlatformFees__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  radiantCapitalStaking({ address, network }: ContractOpts) {
    return RadiantCapitalStaking__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
