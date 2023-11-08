import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { AlphaBank__factory } from './ethers';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class AlphaV1ContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  alphaBank({ address, network }: ContractOpts) {
    return AlphaBank__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { AlphaBank } from './ethers';
