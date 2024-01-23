import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { Cnv__factory, Lsdcnv__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class ConcaveViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  cnv({ address, network }: ContractOpts) {
    return Cnv__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  lsdcnv({ address, network }: ContractOpts) {
    return Lsdcnv__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
