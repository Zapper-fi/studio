import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { Yamato__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class YamatoViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  yamato({ address, network }: ContractOpts) {
    return Yamato__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
