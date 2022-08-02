import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { LooksRareCompounder__factory } from './ethers';
import { LooksRareFeeSharing__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class LooksRareContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  looksRareCompounder({ address, network }: ContractOpts) {
    return LooksRareCompounder__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  looksRareFeeSharing({ address, network }: ContractOpts) {
    return LooksRareFeeSharing__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { LooksRareCompounder } from './ethers';
export type { LooksRareFeeSharing } from './ethers';
