import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { AuraLocker__factory } from './ethers';
import { AuraMasterchef__factory } from './ethers';
import { AuraToken__factory } from './ethers';
import { AuraVirtualBalanceRewardPool__factory } from './ethers';
import { BalancerHelpers__factory } from './ethers';
import { BaseRewardPool__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class AuraContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  auraLocker({ address, network }: ContractOpts) {
    return AuraLocker__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  auraMasterchef({ address, network }: ContractOpts) {
    return AuraMasterchef__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  auraToken({ address, network }: ContractOpts) {
    return AuraToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  auraVirtualBalanceRewardPool({ address, network }: ContractOpts) {
    return AuraVirtualBalanceRewardPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  balancerHelpers({ address, network }: ContractOpts) {
    return BalancerHelpers__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  baseRewardPool({ address, network }: ContractOpts) {
    return BaseRewardPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { AuraLocker } from './ethers';
export type { AuraMasterchef } from './ethers';
export type { AuraToken } from './ethers';
export type { AuraVirtualBalanceRewardPool } from './ethers';
export type { BalancerHelpers } from './ethers';
export type { BaseRewardPool } from './ethers';
