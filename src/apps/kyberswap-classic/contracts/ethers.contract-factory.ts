import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  KyberSwapClassicFactory__factory,
  KyberSwapClassicMasterchef__factory,
  KyberSwapClassicMasterchefV2__factory,
  KyberSwapClassicPool__factory,
} from './ethers';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class KyberswapClassicContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  kyberSwapClassicFactory({ address, network }: ContractOpts) {
    return KyberSwapClassicFactory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  kyberSwapClassicMasterchef({ address, network }: ContractOpts) {
    return KyberSwapClassicMasterchef__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  kyberSwapClassicMasterchefV2({ address, network }: ContractOpts) {
    return KyberSwapClassicMasterchefV2__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  kyberSwapClassicPool({ address, network }: ContractOpts) {
    return KyberSwapClassicPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { KyberSwapClassicFactory } from './ethers';
export type { KyberSwapClassicMasterchef } from './ethers';
export type { KyberSwapClassicMasterchefV2 } from './ethers';
export type { KyberSwapClassicPool } from './ethers';
