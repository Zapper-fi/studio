import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  RadiantCapitalDataProvider__factory,
  RadiantCapitalLendingProvider__factory,
  RadiantCapitalPlatformFees__factory,
  RadiantCapitalStaking__factory,
} from './ethers';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class RadiantCapitalContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  radiantCapitalDataProvider({ address, network }: ContractOpts) {
    return RadiantCapitalDataProvider__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  radiantCapitalLendingProvider({ address, network }: ContractOpts) {
    return RadiantCapitalLendingProvider__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  radiantCapitalPlatformFees({ address, network }: ContractOpts) {
    return RadiantCapitalPlatformFees__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  radiantCapitalStaking({ address, network }: ContractOpts) {
    return RadiantCapitalStaking__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { RadiantCapitalDataProvider } from './ethers';
export type { RadiantCapitalLendingProvider } from './ethers';
export type { RadiantCapitalPlatformFees } from './ethers';
export type { RadiantCapitalStaking } from './ethers';
