import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { TempusAmm__factory, TempusPool__factory, TempusPyToken__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class TempusViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  tempusAmm({ address, network }: ContractOpts) {
    return TempusAmm__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  tempusPool({ address, network }: ContractOpts) {
    return TempusPool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  tempusPyToken({ address, network }: ContractOpts) {
    return TempusPyToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
