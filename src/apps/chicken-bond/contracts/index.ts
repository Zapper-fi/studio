import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { ChickenBondBlusd__factory } from './ethers';
import { ChickenBondBondNft__factory } from './ethers';
import { ChickenBondManager__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class ChickenBondContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  chickenBondBlusd({ address, network }: ContractOpts) {
    return ChickenBondBlusd__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  chickenBondBondNft({ address, network }: ContractOpts) {
    return ChickenBondBondNft__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  chickenBondManager({ address, network }: ContractOpts) {
    return ChickenBondManager__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { ChickenBondBlusd } from './ethers';
export type { ChickenBondBondNft } from './ethers';
export type { ChickenBondManager } from './ethers';
