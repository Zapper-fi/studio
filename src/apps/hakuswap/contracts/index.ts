import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { HakuswapFactory__factory } from './ethers';
import { HakuswapMasterchef__factory } from './ethers';
import { HakuswapPool__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class HakuswapContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  hakuswapFactory({ address, network }: ContractOpts) {
    return HakuswapFactory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  hakuswapMasterchef({ address, network }: ContractOpts) {
    return HakuswapMasterchef__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  hakuswapPool({ address, network }: ContractOpts) {
    return HakuswapPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { HakuswapFactory } from './ethers';
export type { HakuswapMasterchef } from './ethers';
export type { HakuswapPool } from './ethers';
