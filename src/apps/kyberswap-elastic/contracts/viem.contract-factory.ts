import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  Factory__factory,
  KyberswapElasticLm__factory,
  Pool__factory,
  PositionManager__factory,
  TickReader__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class KyberswapElasticViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  factory({ address, network }: ContractOpts) {
    return Factory__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  kyberswapElasticLm({ address, network }: ContractOpts) {
    return KyberswapElasticLm__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pool({ address, network }: ContractOpts) {
    return Pool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  positionManager({ address, network }: ContractOpts) {
    return PositionManager__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  tickReader({ address, network }: ContractOpts) {
    return TickReader__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
