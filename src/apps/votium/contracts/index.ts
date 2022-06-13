import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { VotiumMultiMerkle__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class VotiumContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  votiumMultiMerkle({ address, network }: ContractOpts) {
    return VotiumMultiMerkle__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { VotiumMultiMerkle } from './ethers';
