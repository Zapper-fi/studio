import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { Iq__factory } from './ethers';
import { IqHiiq__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class IqContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  iq({ address, network }: ContractOpts) {
    return Iq__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  iqHiiq({ address, network }: ContractOpts) {
    return IqHiiq__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { Iq } from './ethers';
export type { IqHiiq } from './ethers';
