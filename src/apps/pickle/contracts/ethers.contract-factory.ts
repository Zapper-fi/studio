import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  PickleController__factory,
  PickleJar__factory,
  PickleJarMasterchef__factory,
  PickleJarSingleRewardStaking__factory,
  PickleJarUniv3__factory,
  PickleMiniChefV2__factory,
  PickleRegistry__factory,
  PickleRewarder__factory,
  PickleStrategyUniv3__factory,
  PickleVotingEscrow__factory,
  PickleVotingEscrowReward__factory,
  PickleVotingEscrowRewardV2__factory,
} from './ethers';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class PickleContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  pickleController({ address, network }: ContractOpts) {
    return PickleController__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pickleJar({ address, network }: ContractOpts) {
    return PickleJar__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pickleJarMasterchef({ address, network }: ContractOpts) {
    return PickleJarMasterchef__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pickleJarSingleRewardStaking({ address, network }: ContractOpts) {
    return PickleJarSingleRewardStaking__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pickleJarUniv3({ address, network }: ContractOpts) {
    return PickleJarUniv3__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pickleMiniChefV2({ address, network }: ContractOpts) {
    return PickleMiniChefV2__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pickleRegistry({ address, network }: ContractOpts) {
    return PickleRegistry__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pickleRewarder({ address, network }: ContractOpts) {
    return PickleRewarder__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pickleStrategyUniv3({ address, network }: ContractOpts) {
    return PickleStrategyUniv3__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pickleVotingEscrow({ address, network }: ContractOpts) {
    return PickleVotingEscrow__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pickleVotingEscrowReward({ address, network }: ContractOpts) {
    return PickleVotingEscrowReward__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pickleVotingEscrowRewardV2({ address, network }: ContractOpts) {
    return PickleVotingEscrowRewardV2__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { PickleController } from './ethers';
export type { PickleJar } from './ethers';
export type { PickleJarMasterchef } from './ethers';
export type { PickleJarSingleRewardStaking } from './ethers';
export type { PickleJarUniv3 } from './ethers';
export type { PickleMiniChefV2 } from './ethers';
export type { PickleRegistry } from './ethers';
export type { PickleRewarder } from './ethers';
export type { PickleStrategyUniv3 } from './ethers';
export type { PickleVotingEscrow } from './ethers';
export type { PickleVotingEscrowReward } from './ethers';
export type { PickleVotingEscrowRewardV2 } from './ethers';
