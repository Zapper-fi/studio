import { Injectable, Inject } from '@nestjs/common';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';

import { NetworkProviderService } from '~network-provider/network-provider.service';
import { Network } from '~types/network.interface';

import { IdleController__factory } from './ethers';
import type { IdleController } from './ethers';
import { IdlePerpetualYieldTranches__factory } from './ethers';
import type { IdlePerpetualYieldTranches } from './ethers';
import { IdleToken__factory } from './ethers';
import type { IdleToken } from './ethers';
import { ContractFactory } from '~contract/contracts';
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
  idlePerpetualYieldTranches({ address, network }: ContractOpts) {
    return IdlePerpetualYieldTranches__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  idleToken({ address, network }: ContractOpts) {
    return IdleToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { IdleController } from './ethers';
export type { IdlePerpetualYieldTranches } from './ethers';
export type { IdleToken } from './ethers';
