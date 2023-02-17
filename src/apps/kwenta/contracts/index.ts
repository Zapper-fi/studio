import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { KwentaLpStaking__factory, KwentaStaking__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class KwentaContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  kwentaLpStaking({ address, network }: ContractOpts) {
    return KwentaLpStaking__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  kwentaStaking({ address, network }: ContractOpts) {
    return KwentaStaking__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { KwentaLpStaking } from './ethers';
export type { KwentaStaking } from './ethers';
