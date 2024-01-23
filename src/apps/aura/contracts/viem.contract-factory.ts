import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  AuraBalToken__factory,
  AuraBalVirtualRewardPool__factory,
  AuraBalancerHelpers__factory,
  AuraBaseRewardPool__factory,
  AuraBooster__factory,
  AuraBoosterV2__factory,
  AuraDepositToken__factory,
  AuraLocker__factory,
  AuraMasterchef__factory,
  AuraStashToken__factory,
  AuraToken__factory,
  AuraVirtualBalanceRewardPool__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class AuraViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  auraBalToken({ address, network }: ContractOpts) {
    return AuraBalToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  auraBalVirtualRewardPool({ address, network }: ContractOpts) {
    return AuraBalVirtualRewardPool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  auraBalancerHelpers({ address, network }: ContractOpts) {
    return AuraBalancerHelpers__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  auraBaseRewardPool({ address, network }: ContractOpts) {
    return AuraBaseRewardPool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  auraBooster({ address, network }: ContractOpts) {
    return AuraBooster__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  auraBoosterV2({ address, network }: ContractOpts) {
    return AuraBoosterV2__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  auraDepositToken({ address, network }: ContractOpts) {
    return AuraDepositToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  auraLocker({ address, network }: ContractOpts) {
    return AuraLocker__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  auraMasterchef({ address, network }: ContractOpts) {
    return AuraMasterchef__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  auraStashToken({ address, network }: ContractOpts) {
    return AuraStashToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  auraToken({ address, network }: ContractOpts) {
    return AuraToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  auraVirtualBalanceRewardPool({ address, network }: ContractOpts) {
    return AuraVirtualBalanceRewardPool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
