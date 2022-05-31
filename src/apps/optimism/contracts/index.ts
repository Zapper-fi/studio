import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { OptimismMerkleDistributor__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class OptimismContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  optimismMerkleDistributor({ address, network }: ContractOpts) {
    return OptimismMerkleDistributor__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { OptimismMerkleDistributor } from './ethers';
