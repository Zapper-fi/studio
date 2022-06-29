import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { PoolTogetherMerkleDistributor__factory } from './ethers';
import { PoolTogetherV3MultiTokenListener__factory } from './ethers';
import { PoolTogetherV3MultipleWinnersPrizeStrategy__factory } from './ethers';
import { PoolTogetherV3Pod__factory } from './ethers';
import { PoolTogetherV3PodRegistry__factory } from './ethers';
import { PoolTogetherV3PrizePool__factory } from './ethers';
import { PoolTogetherV3Ticket__factory } from './ethers';
import { PoolTogetherV3TokenFaucet__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class PoolTogetherContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  poolTogetherMerkleDistributor({ address, network }: ContractOpts) {
    return PoolTogetherMerkleDistributor__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  poolTogetherV3MultiTokenListener({ address, network }: ContractOpts) {
    return PoolTogetherV3MultiTokenListener__factory.connect(address, this.appToolkit.getNetworkProvider(network));
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
export type { PoolTogetherV3MultiTokenListener } from './ethers';
export type { PoolTogetherV3MultipleWinnersPrizeStrategy } from './ethers';
export type { PoolTogetherV3Pod } from './ethers';
export type { PoolTogetherV3PodRegistry } from './ethers';
export type { PoolTogetherV3PrizePool } from './ethers';
export type { PoolTogetherV3Ticket } from './ethers';
export type { PoolTogetherV3TokenFaucet } from './ethers';
