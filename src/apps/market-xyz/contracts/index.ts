import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { MarketXyzPoolDirectory__factory } from './ethers';
import { MarketXyzPoolLens__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class MarketXyzContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  marketXyzPoolDirectory({ address, network }: ContractOpts) {
    return MarketXyzPoolDirectory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  marketXyzPoolLens({ address, network }: ContractOpts) {
    return MarketXyzPoolLens__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { MarketXyzPoolDirectory } from './ethers';
export type { MarketXyzPoolLens } from './ethers';
