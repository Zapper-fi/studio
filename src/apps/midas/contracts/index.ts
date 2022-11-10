import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { MidasPool__factory } from './ethers';
import { MidasPoolDirectory__factory } from './ethers';
import { MidasPoolLens__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class MidasContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  midasPool({ address, network }: ContractOpts) {
    return MidasPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  midasPoolDirectory({ address, network }: ContractOpts) {
    return MidasPoolDirectory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  midasPoolLens({ address, network }: ContractOpts) {
    return MidasPoolLens__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { MidasPool } from './ethers';
export type { MidasPoolDirectory } from './ethers';
export type { MidasPoolLens } from './ethers';
