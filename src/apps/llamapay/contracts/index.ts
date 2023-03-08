import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { LlamapayStream__factory, LlamapayVestingEscrow__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class LlamapayContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  llamapayStream({ address, network }: ContractOpts) {
    return LlamapayStream__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  llamapayVestingEscrow({ address, network }: ContractOpts) {
    return LlamapayVestingEscrow__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { LlamapayStream } from './ethers';
export type { LlamapayVestingEscrow } from './ethers';
