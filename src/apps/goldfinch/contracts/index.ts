import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { GoldfinchSeniorPool__factory, GoldfinchStakingRewards__factory, GoldfinchVault__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class GoldfinchContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  goldfinchSeniorPool({ address, network }: ContractOpts) {
    return GoldfinchSeniorPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  goldfinchStakingRewards({ address, network }: ContractOpts) {
    return GoldfinchStakingRewards__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  goldfinchVault({ address, network }: ContractOpts) {
    return GoldfinchVault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { GoldfinchSeniorPool } from './ethers';
export type { GoldfinchStakingRewards } from './ethers';
export type { GoldfinchVault } from './ethers';
