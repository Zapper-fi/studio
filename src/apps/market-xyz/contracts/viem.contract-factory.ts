import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  MarketXyzComptroller__factory,
  MarketXyzPoolDirectory__factory,
  MarketXyzPoolLens__factory,
  MarketXyzToken__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class MarketXyzViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  marketXyzComptroller({ address, network }: ContractOpts) {
    return MarketXyzComptroller__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  marketXyzPoolDirectory({ address, network }: ContractOpts) {
    return MarketXyzPoolDirectory__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  marketXyzPoolLens({ address, network }: ContractOpts) {
    return MarketXyzPoolLens__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  marketXyzToken({ address, network }: ContractOpts) {
    return MarketXyzToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
