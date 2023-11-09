import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { VerseFarm__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class VerseViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  verseFarm({ address, network }: ContractOpts) {
    return VerseFarm__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
