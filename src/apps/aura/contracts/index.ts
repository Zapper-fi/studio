import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { AuraBalToken__factory } from './ethers';
import { AuraBalancerHelpers__factory } from './ethers';
import { AuraBaseRewardPool__factory } from './ethers';
import { AuraBooster__factory } from './ethers';
import { AuraDepositToken__factory } from './ethers';
import { AuraLocker__factory } from './ethers';
import { AuraMasterchef__factory } from './ethers';
import { AuraToken__factory } from './ethers';
import { AuraVirtualBalanceRewardPool__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class AuraContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  auraBalToken({ address, network }: ContractOpts) {
    return AuraBalToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  auraBalancerHelpers({ address, network }: ContractOpts) {
    return AuraBalancerHelpers__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  auraBaseRewardPool({ address, network }: ContractOpts) {
    return AuraBaseRewardPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  auraBooster({ address, network }: ContractOpts) {
    return AuraBooster__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  auraDepositToken({ address, network }: ContractOpts) {
    return AuraDepositToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
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
}

export type { AuraBalToken } from './ethers';
export type { AuraBalancerHelpers } from './ethers';
export type { AuraBaseRewardPool } from './ethers';
export type { AuraBooster } from './ethers';
export type { AuraDepositToken } from './ethers';
export type { AuraLocker } from './ethers';
export type { AuraMasterchef } from './ethers';
export type { AuraToken } from './ethers';
export type { AuraVirtualBalanceRewardPool } from './ethers';
