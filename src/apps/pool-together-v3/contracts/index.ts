import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
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
} from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class PoolTogetherV3ContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  poolTogetherMerkleDistributor({ address, network }: ContractOpts) {
    return PoolTogetherMerkleDistributor__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  poolTogetherV3CommunityPrizePool({ address, network }: ContractOpts) {
    return PoolTogetherV3CommunityPrizePool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  poolTogetherV3MultiTokenListener({ address, network }: ContractOpts) {
    return PoolTogetherV3MultiTokenListener__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  poolTogetherV3MultipleWinners({ address, network }: ContractOpts) {
    return PoolTogetherV3MultipleWinners__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  poolTogetherV3MultipleWinnersPrizeStrategy({ address, network }: ContractOpts) {
    return PoolTogetherV3MultipleWinnersPrizeStrategy__factory.connect(
      address,
      this.appToolkit.getNetworkProvider(network),
    );
  }
  poolTogetherV3Pod({ address, network }: ContractOpts) {
    return PoolTogetherV3Pod__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  poolTogetherV3PodRegistry({ address, network }: ContractOpts) {
    return PoolTogetherV3PodRegistry__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  poolTogetherV3PoolWithMultipleWinnersBuilder({ address, network }: ContractOpts) {
    return PoolTogetherV3PoolWithMultipleWinnersBuilder__factory.connect(
      address,
      this.appToolkit.getNetworkProvider(network),
    );
  }
  poolTogetherV3PrizePool({ address, network }: ContractOpts) {
    return PoolTogetherV3PrizePool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  poolTogetherV3Ticket({ address, network }: ContractOpts) {
    return PoolTogetherV3Ticket__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  poolTogetherV3TokenFaucet({ address, network }: ContractOpts) {
    return PoolTogetherV3TokenFaucet__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { PoolTogetherMerkleDistributor } from './ethers';
export type { PoolTogetherV3CommunityPrizePool } from './ethers';
export type { PoolTogetherV3MultiTokenListener } from './ethers';
export type { PoolTogetherV3MultipleWinners } from './ethers';
export type { PoolTogetherV3MultipleWinnersPrizeStrategy } from './ethers';
export type { PoolTogetherV3Pod } from './ethers';
export type { PoolTogetherV3PodRegistry } from './ethers';
export type { PoolTogetherV3PoolWithMultipleWinnersBuilder } from './ethers';
export type { PoolTogetherV3PrizePool } from './ethers';
export type { PoolTogetherV3Ticket } from './ethers';
export type { PoolTogetherV3TokenFaucet } from './ethers';
