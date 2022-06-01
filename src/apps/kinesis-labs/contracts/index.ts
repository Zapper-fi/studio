import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { KinesisLabsPool__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class KinesisLabsContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  kinesisLabsPool({ address, network }: ContractOpts) {
    return KinesisLabsPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { KinesisLabsPool } from './ethers';
