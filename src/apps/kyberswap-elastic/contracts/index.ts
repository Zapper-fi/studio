import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { Factory__factory } from './ethers';
import { KyberswapElasticLm__factory } from './ethers';
import { Pool__factory } from './ethers';
import { PositionManager__factory } from './ethers';
import { TickReader__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class KyberswapElasticContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  factory({ address, network }: ContractOpts) {
    return Factory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  kyberswapElasticLm({ address, network }: ContractOpts) {
    return KyberswapElasticLm__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pool({ address, network }: ContractOpts) {
    return Pool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  positionManager({ address, network }: ContractOpts) {
    return PositionManager__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  tickReader({ address, network }: ContractOpts) {
    return TickReader__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { Factory } from './ethers';
export type { KyberswapElasticLm } from './ethers';
export type { Pool } from './ethers';
export type { PositionManager } from './ethers';
export type { TickReader } from './ethers';
