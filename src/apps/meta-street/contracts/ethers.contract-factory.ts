import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { PoolV2__factory, PoolV2Legacy__factory } from './ethers';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class MetaStreetContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  poolV2({ address, network }: ContractOpts) {
    return PoolV2__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  poolV2Legacy({ address, network }: ContractOpts) {
    return PoolV2Legacy__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { PoolV2 } from './ethers';
export type { PoolV2Legacy } from './ethers';
