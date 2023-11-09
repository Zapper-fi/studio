import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  Y2KFinanceCarousel__factory,
  Y2KFinanceCarouselFactory__factory,
  Y2KFinanceRewardsFactory__factory,
  Y2KFinanceStakingRewards__factory,
  Y2KFinanceVaultFactoryV1__factory,
  Y2KFinanceVaultV1__factory,
  Y2KFinanceVotingLocked__factory,
} from './ethers';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class Y2KFinanceContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  y2KFinanceCarousel({ address, network }: ContractOpts) {
    return Y2KFinanceCarousel__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  y2KFinanceCarouselFactory({ address, network }: ContractOpts) {
    return Y2KFinanceCarouselFactory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  y2KFinanceRewardsFactory({ address, network }: ContractOpts) {
    return Y2KFinanceRewardsFactory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  y2KFinanceStakingRewards({ address, network }: ContractOpts) {
    return Y2KFinanceStakingRewards__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  y2KFinanceVaultFactoryV1({ address, network }: ContractOpts) {
    return Y2KFinanceVaultFactoryV1__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  y2KFinanceVaultV1({ address, network }: ContractOpts) {
    return Y2KFinanceVaultV1__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  y2KFinanceVotingLocked({ address, network }: ContractOpts) {
    return Y2KFinanceVotingLocked__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { Y2KFinanceCarousel } from './ethers';
export type { Y2KFinanceCarouselFactory } from './ethers';
export type { Y2KFinanceRewardsFactory } from './ethers';
export type { Y2KFinanceStakingRewards } from './ethers';
export type { Y2KFinanceVaultFactoryV1 } from './ethers';
export type { Y2KFinanceVaultV1 } from './ethers';
export type { Y2KFinanceVotingLocked } from './ethers';
