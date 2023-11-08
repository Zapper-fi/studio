import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { LlamapayStream__factory, LlamapayVestingEscrow__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class LlamapayViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  llamapayStream({ address, network }: ContractOpts) {
    return LlamapayStream__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  llamapayVestingEscrow({ address, network }: ContractOpts) {
    return LlamapayVestingEscrow__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
