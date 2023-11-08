import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { Benis__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class BananoViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  benis({ address, network }: ContractOpts) {
    return Benis__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
