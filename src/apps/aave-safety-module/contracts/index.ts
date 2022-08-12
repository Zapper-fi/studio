import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { AaveStakedApyHelper__factory } from './ethers';
import { BalancerAbpt__factory } from './ethers';
import { BalancerPoolToken__factory } from './ethers';
import { BalancerStkAbpt__factory } from './ethers';
import { StakedAave__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class AaveSafetyModuleContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  aaveStakedApyHelper({ address, network }: ContractOpts) {
    return AaveStakedApyHelper__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  balancerAbpt({ address, network }: ContractOpts) {
    return BalancerAbpt__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  balancerPoolToken({ address, network }: ContractOpts) {
    return BalancerPoolToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  balancerStkAbpt({ address, network }: ContractOpts) {
    return BalancerStkAbpt__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  stakedAave({ address, network }: ContractOpts) {
    return StakedAave__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { AaveStakedApyHelper } from './ethers';
export type { BalancerAbpt } from './ethers';
export type { BalancerPoolToken } from './ethers';
export type { BalancerStkAbpt } from './ethers';
export type { StakedAave } from './ethers';
