import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { Cnv__factory, Lsdcnv__factory } from './ethers';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class ConcaveContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  cnv({ address, network }: ContractOpts) {
    return Cnv__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  lsdcnv({ address, network }: ContractOpts) {
    return Lsdcnv__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { Cnv } from './ethers';
export type { Lsdcnv } from './ethers';