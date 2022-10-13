import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { KyberSwapDmmFactory__factory } from './ethers';
import { KyberSwapDmmMasterchef__factory } from './ethers';
import { KyberSwapDmmPool__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class KyberswapDmmContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  kyberSwapDmmFactory({ address, network }: ContractOpts) {
    return KyberSwapDmmFactory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  kyberSwapDmmMasterchef({ address, network }: ContractOpts) {
    return KyberSwapDmmMasterchef__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  kyberSwapDmmPool({ address, network }: ContractOpts) {
    return KyberSwapDmmPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { KyberSwapDmmFactory } from './ethers';
export type { KyberSwapDmmMasterchef } from './ethers';
export type { KyberSwapDmmPool } from './ethers';
