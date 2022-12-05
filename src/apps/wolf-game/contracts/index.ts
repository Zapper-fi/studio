import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { WolfGameWoolPouch__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class WolfGameContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  wolfGameWoolPouch({ address, network }: ContractOpts) {
    return WolfGameWoolPouch__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { WolfGameWoolPouch } from './ethers';
