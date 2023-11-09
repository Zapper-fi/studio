import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { PoolV2__factory, PoolV2Legacy__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class MetaStreetViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  poolV2({ address, network }: ContractOpts) {
    return PoolV2__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  poolV2Legacy({ address, network }: ContractOpts) {
    return PoolV2Legacy__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
