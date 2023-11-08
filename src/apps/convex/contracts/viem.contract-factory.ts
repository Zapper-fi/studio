import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  ConvexAbracadabraWrapper__factory,
  ConvexBooster__factory,
  ConvexBoosterSidechain__factory,
  ConvexCvxCrvStaking__factory,
  ConvexCvxCrvStakingUtilities__factory,
  ConvexCvxCrvStakingWrapped__factory,
  ConvexCvxStaking__factory,
  ConvexDepositToken__factory,
  ConvexDepositor__factory,
  ConvexRewardPool__factory,
  ConvexSingleStakingRewards__factory,
  ConvexStashTokenWrapped__factory,
  ConvexStashTokenWrapper__factory,
  ConvexVirtualBalanceRewardPool__factory,
  ConvexVotingEscrow__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class ConvexViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  convexAbracadabraWrapper({ address, network }: ContractOpts) {
    return ConvexAbracadabraWrapper__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  convexBooster({ address, network }: ContractOpts) {
    return ConvexBooster__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  convexBoosterSidechain({ address, network }: ContractOpts) {
    return ConvexBoosterSidechain__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  convexCvxCrvStaking({ address, network }: ContractOpts) {
    return ConvexCvxCrvStaking__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  convexCvxCrvStakingUtilities({ address, network }: ContractOpts) {
    return ConvexCvxCrvStakingUtilities__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  convexCvxCrvStakingWrapped({ address, network }: ContractOpts) {
    return ConvexCvxCrvStakingWrapped__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  convexCvxStaking({ address, network }: ContractOpts) {
    return ConvexCvxStaking__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  convexDepositToken({ address, network }: ContractOpts) {
    return ConvexDepositToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  convexDepositor({ address, network }: ContractOpts) {
    return ConvexDepositor__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  convexRewardPool({ address, network }: ContractOpts) {
    return ConvexRewardPool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  convexSingleStakingRewards({ address, network }: ContractOpts) {
    return ConvexSingleStakingRewards__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  convexStashTokenWrapped({ address, network }: ContractOpts) {
    return ConvexStashTokenWrapped__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  convexStashTokenWrapper({ address, network }: ContractOpts) {
    return ConvexStashTokenWrapper__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  convexVirtualBalanceRewardPool({ address, network }: ContractOpts) {
    return ConvexVirtualBalanceRewardPool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  convexVotingEscrow({ address, network }: ContractOpts) {
    return ConvexVotingEscrow__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
