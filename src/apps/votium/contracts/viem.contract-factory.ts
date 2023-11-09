import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { VotiumMultiMerkle__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class VotiumViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  votiumMultiMerkle({ address, network }: ContractOpts) {
    return VotiumMultiMerkle__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
