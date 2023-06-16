import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  TraderJoeV2LbFactory__factory,
  TraderJoeV2LbPair__factory,
  TraderJoeV2LbPairProxy__factory,
  TraderJoeV2LbQuoter__factory,
  TraderJoeV2LbRouter__factory,
} from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class TraderJoeV2ContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  traderJoeV2LbFactory({ address, network }: ContractOpts) {
    return TraderJoeV2LbFactory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  traderJoeV2LbPair({ address, network }: ContractOpts) {
    return TraderJoeV2LbPair__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  traderJoeV2LbPairProxy({ address, network }: ContractOpts) {
    return TraderJoeV2LbPairProxy__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  traderJoeV2LbQuoter({ address, network }: ContractOpts) {
    return TraderJoeV2LbQuoter__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  traderJoeV2LbRouter({ address, network }: ContractOpts) {
    return TraderJoeV2LbRouter__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { TraderJoeV2LbFactory } from './ethers';
export type { TraderJoeV2LbPair } from './ethers';
export type { TraderJoeV2LbPairProxy } from './ethers';
export type { TraderJoeV2LbQuoter } from './ethers';
export type { TraderJoeV2LbRouter } from './ethers';
