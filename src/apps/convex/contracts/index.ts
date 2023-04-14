import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
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
} from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class ConvexContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  convexAbracadabraWrapper({ address, network }: ContractOpts) {
    return ConvexAbracadabraWrapper__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  convexBooster({ address, network }: ContractOpts) {
    return ConvexBooster__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  convexBoosterSidechain({ address, network }: ContractOpts) {
    return ConvexBoosterSidechain__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  convexCvxCrvStaking({ address, network }: ContractOpts) {
    return ConvexCvxCrvStaking__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  convexCvxCrvStakingUtilities({ address, network }: ContractOpts) {
    return ConvexCvxCrvStakingUtilities__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  convexCvxCrvStakingWrapped({ address, network }: ContractOpts) {
    return ConvexCvxCrvStakingWrapped__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  convexCvxStaking({ address, network }: ContractOpts) {
    return ConvexCvxStaking__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  convexDepositToken({ address, network }: ContractOpts) {
    return ConvexDepositToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  convexDepositor({ address, network }: ContractOpts) {
    return ConvexDepositor__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  convexRewardPool({ address, network }: ContractOpts) {
    return ConvexRewardPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  convexSingleStakingRewards({ address, network }: ContractOpts) {
    return ConvexSingleStakingRewards__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  convexStashTokenWrapped({ address, network }: ContractOpts) {
    return ConvexStashTokenWrapped__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  convexStashTokenWrapper({ address, network }: ContractOpts) {
    return ConvexStashTokenWrapper__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  convexVirtualBalanceRewardPool({ address, network }: ContractOpts) {
    return ConvexVirtualBalanceRewardPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  convexVotingEscrow({ address, network }: ContractOpts) {
    return ConvexVotingEscrow__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { ConvexAbracadabraWrapper } from './ethers';
export type { ConvexBooster } from './ethers';
export type { ConvexBoosterSidechain } from './ethers';
export type { ConvexCvxCrvStaking } from './ethers';
export type { ConvexCvxCrvStakingUtilities } from './ethers';
export type { ConvexCvxCrvStakingWrapped } from './ethers';
export type { ConvexCvxStaking } from './ethers';
export type { ConvexDepositToken } from './ethers';
export type { ConvexDepositor } from './ethers';
export type { ConvexRewardPool } from './ethers';
export type { ConvexSingleStakingRewards } from './ethers';
export type { ConvexStashTokenWrapped } from './ethers';
export type { ConvexStashTokenWrapper } from './ethers';
export type { ConvexVirtualBalanceRewardPool } from './ethers';
export type { ConvexVotingEscrow } from './ethers';
