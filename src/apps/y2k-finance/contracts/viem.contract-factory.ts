import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  Y2KFinanceCarousel__factory,
  Y2KFinanceCarouselFactory__factory,
  Y2KFinanceRewardsFactory__factory,
  Y2KFinanceStakingRewards__factory,
  Y2KFinanceVaultFactoryV1__factory,
  Y2KFinanceVaultV1__factory,
  Y2KFinanceVotingLocked__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class Y2KFinanceViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  y2KFinanceCarousel({ address, network }: ContractOpts) {
    return Y2KFinanceCarousel__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  y2KFinanceCarouselFactory({ address, network }: ContractOpts) {
    return Y2KFinanceCarouselFactory__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  y2KFinanceRewardsFactory({ address, network }: ContractOpts) {
    return Y2KFinanceRewardsFactory__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  y2KFinanceStakingRewards({ address, network }: ContractOpts) {
    return Y2KFinanceStakingRewards__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  y2KFinanceVaultFactoryV1({ address, network }: ContractOpts) {
    return Y2KFinanceVaultFactoryV1__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  y2KFinanceVaultV1({ address, network }: ContractOpts) {
    return Y2KFinanceVaultV1__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  y2KFinanceVotingLocked({ address, network }: ContractOpts) {
    return Y2KFinanceVotingLocked__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
