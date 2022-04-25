import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { PickleJar__factory } from './ethers';
import { PickleJarMasterchef__factory } from './ethers';
import { PickleJarSingleRewardStaking__factory } from './ethers';
import { PickleMiniChefV2__factory } from './ethers';
import { PickleRegistry__factory } from './ethers';
import { PickleRewarder__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class PickleContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
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
  pickleMiniChefV2({ address, network }: ContractOpts) {
    return PickleMiniChefV2__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pickleRegistry({ address, network }: ContractOpts) {
    return PickleRegistry__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pickleRewarder({ address, network }: ContractOpts) {
    return PickleRewarder__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { PickleJar } from './ethers';
export type { PickleJarMasterchef } from './ethers';
export type { PickleJarSingleRewardStaking } from './ethers';
export type { PickleMiniChefV2 } from './ethers';
export type { PickleRegistry } from './ethers';
export type { PickleRewarder } from './ethers';
