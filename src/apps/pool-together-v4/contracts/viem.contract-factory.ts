import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  PoolTogetherMerkleDistributor__factory,
  PoolTogetherV3TokenFaucet__factory,
  PoolTogetherV4PrizePool__factory,
  PoolTogetherV4Ticket__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class PoolTogetherV4ViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  poolTogetherMerkleDistributor({ address, network }: ContractOpts) {
    return PoolTogetherMerkleDistributor__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  poolTogetherV3TokenFaucet({ address, network }: ContractOpts) {
    return PoolTogetherV3TokenFaucet__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  poolTogetherV4PrizePool({ address, network }: ContractOpts) {
    return PoolTogetherV4PrizePool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  poolTogetherV4Ticket({ address, network }: ContractOpts) {
    return PoolTogetherV4Ticket__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
