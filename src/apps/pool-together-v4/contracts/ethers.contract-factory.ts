import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  PoolTogetherMerkleDistributor__factory,
  PoolTogetherV3TokenFaucet__factory,
  PoolTogetherV4PrizePool__factory,
  PoolTogetherV4Ticket__factory,
} from './ethers';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class PoolTogetherV4ContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  poolTogetherMerkleDistributor({ address, network }: ContractOpts) {
    return PoolTogetherMerkleDistributor__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  poolTogetherV3TokenFaucet({ address, network }: ContractOpts) {
    return PoolTogetherV3TokenFaucet__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  poolTogetherV4PrizePool({ address, network }: ContractOpts) {
    return PoolTogetherV4PrizePool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  poolTogetherV4Ticket({ address, network }: ContractOpts) {
    return PoolTogetherV4Ticket__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { PoolTogetherMerkleDistributor } from './ethers';
export type { PoolTogetherV3TokenFaucet } from './ethers';
export type { PoolTogetherV4PrizePool } from './ethers';
export type { PoolTogetherV4Ticket } from './ethers';
