import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { DfxCurve__factory } from './ethers';
import { DfxStaking__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class DfxContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  dfxCurve({ address, network }: ContractOpts) {
    return DfxCurve__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  dfxStaking({ address, network }: ContractOpts) {
    return DfxStaking__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { DfxCurve } from './ethers';
export type { DfxStaking } from './ethers';
