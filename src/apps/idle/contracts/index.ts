import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { IdleController__factory, IdlePerpYieldTranches__factory, IdleToken__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class IdleContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  idleController({ address, network }: ContractOpts) {
    return IdleController__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  idlePerpYieldTranches({ address, network }: ContractOpts) {
    return IdlePerpYieldTranches__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  idleToken({ address, network }: ContractOpts) {
    return IdleToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { IdleController } from './ethers';
export type { IdlePerpYieldTranches } from './ethers';
export type { IdleToken } from './ethers';
