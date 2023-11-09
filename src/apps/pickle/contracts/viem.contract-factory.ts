import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
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
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class PickleViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  pickleController({ address, network }: ContractOpts) {
    return PickleController__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pickleJar({ address, network }: ContractOpts) {
    return PickleJar__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pickleJarMasterchef({ address, network }: ContractOpts) {
    return PickleJarMasterchef__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pickleJarSingleRewardStaking({ address, network }: ContractOpts) {
    return PickleJarSingleRewardStaking__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pickleJarUniv3({ address, network }: ContractOpts) {
    return PickleJarUniv3__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pickleMiniChefV2({ address, network }: ContractOpts) {
    return PickleMiniChefV2__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pickleRegistry({ address, network }: ContractOpts) {
    return PickleRegistry__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pickleRewarder({ address, network }: ContractOpts) {
    return PickleRewarder__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pickleStrategyUniv3({ address, network }: ContractOpts) {
    return PickleStrategyUniv3__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pickleVotingEscrow({ address, network }: ContractOpts) {
    return PickleVotingEscrow__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pickleVotingEscrowReward({ address, network }: ContractOpts) {
    return PickleVotingEscrowReward__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pickleVotingEscrowRewardV2({ address, network }: ContractOpts) {
    return PickleVotingEscrowRewardV2__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
