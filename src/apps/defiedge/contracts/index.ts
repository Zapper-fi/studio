import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { Factory__factory } from './ethers';
import { LiquidityHelper__factory } from './ethers';
import { Pool__factory } from './ethers';
import { Strategy__factory } from './ethers';
import { StrategyManager__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class DefiedgeContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  factory({ address, network }: ContractOpts) {
    return Factory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  liquidityHelper({ address, network }: ContractOpts) {
    return LiquidityHelper__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pool({ address, network }: ContractOpts) {
    return Pool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  strategy({ address, network }: ContractOpts) {
    return Strategy__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  strategyManager({ address, network }: ContractOpts) {
    return StrategyManager__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { Factory } from './ethers';
export type { LiquidityHelper } from './ethers';
export type { Pool } from './ethers';
export type { Strategy } from './ethers';
export type { StrategyManager } from './ethers';
