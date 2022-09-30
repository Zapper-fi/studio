import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { DystopiaGauge__factory } from './ethers';
import { DystopiaPair__factory } from './ethers';
import { DystopiaVe__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class DystopiaContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  dystopiaGauge({ address, network }: ContractOpts) {
    return DystopiaGauge__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  dystopiaPair({ address, network }: ContractOpts) {
    return DystopiaPair__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  dystopiaVe({ address, network }: ContractOpts) {
    return DystopiaVe__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { DystopiaGauge } from './ethers';
export type { DystopiaPair } from './ethers';
export type { DystopiaVe } from './ethers';
