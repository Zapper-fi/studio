import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { IdleController__factory, IdlePerpYieldTranches__factory, IdleToken__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class IdleViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  idleController({ address, network }: ContractOpts) {
    return IdleController__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  idlePerpYieldTranches({ address, network }: ContractOpts) {
    return IdlePerpYieldTranches__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  idleToken({ address, network }: ContractOpts) {
    return IdleToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
