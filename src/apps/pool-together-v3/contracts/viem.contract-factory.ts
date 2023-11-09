import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  PoolTogetherMerkleDistributor__factory,
  PoolTogetherV3CommunityPrizePool__factory,
  PoolTogetherV3MultiTokenListener__factory,
  PoolTogetherV3MultipleWinners__factory,
  PoolTogetherV3MultipleWinnersPrizeStrategy__factory,
  PoolTogetherV3Pod__factory,
  PoolTogetherV3PodRegistry__factory,
  PoolTogetherV3PoolWithMultipleWinnersBuilder__factory,
  PoolTogetherV3PrizePool__factory,
  PoolTogetherV3Ticket__factory,
  PoolTogetherV3TokenFaucet__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class PoolTogetherV3ViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  poolTogetherMerkleDistributor({ address, network }: ContractOpts) {
    return PoolTogetherMerkleDistributor__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  poolTogetherV3CommunityPrizePool({ address, network }: ContractOpts) {
    return PoolTogetherV3CommunityPrizePool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  poolTogetherV3MultiTokenListener({ address, network }: ContractOpts) {
    return PoolTogetherV3MultiTokenListener__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  poolTogetherV3MultipleWinners({ address, network }: ContractOpts) {
    return PoolTogetherV3MultipleWinners__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  poolTogetherV3MultipleWinnersPrizeStrategy({ address, network }: ContractOpts) {
    return PoolTogetherV3MultipleWinnersPrizeStrategy__factory.connect(
      address,
      this.appToolkit.getViemNetworkProvider(network),
    );
  }
  poolTogetherV3Pod({ address, network }: ContractOpts) {
    return PoolTogetherV3Pod__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  poolTogetherV3PodRegistry({ address, network }: ContractOpts) {
    return PoolTogetherV3PodRegistry__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  poolTogetherV3PoolWithMultipleWinnersBuilder({ address, network }: ContractOpts) {
    return PoolTogetherV3PoolWithMultipleWinnersBuilder__factory.connect(
      address,
      this.appToolkit.getViemNetworkProvider(network),
    );
  }
  poolTogetherV3PrizePool({ address, network }: ContractOpts) {
    return PoolTogetherV3PrizePool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  poolTogetherV3Ticket({ address, network }: ContractOpts) {
    return PoolTogetherV3Ticket__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  poolTogetherV3TokenFaucet({ address, network }: ContractOpts) {
    return PoolTogetherV3TokenFaucet__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
