import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { Iq__factory, IqHiiq__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class IqViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  iq({ address, network }: ContractOpts) {
    return Iq__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  iqHiiq({ address, network }: ContractOpts) {
    return IqHiiq__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
