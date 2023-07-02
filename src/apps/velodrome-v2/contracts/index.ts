import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  VelodromeV2Pool__factory,
  VelodromeV2PoolFactory__factory,
  VelodromeV2Rewards__factory,
  VelodromeV2Ve__factory,
} from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class VelodromeV2ContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  velodromeV2Pool({ address, network }: ContractOpts) {
    return VelodromeV2Pool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  velodromeV2PoolFactory({ address, network }: ContractOpts) {
    return VelodromeV2PoolFactory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  velodromeV2Rewards({ address, network }: ContractOpts) {
    return VelodromeV2Rewards__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  velodromeV2Ve({ address, network }: ContractOpts) {
    return VelodromeV2Ve__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { VelodromeV2Pool } from './ethers';
export type { VelodromeV2PoolFactory } from './ethers';
export type { VelodromeV2Rewards } from './ethers';
export type { VelodromeV2Ve } from './ethers';
