import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { RenDarknodeRegistry__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class RenContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  renDarknodeRegistry({ address, network }: ContractOpts) {
    return RenDarknodeRegistry__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { RenDarknodeRegistry } from './ethers';
